// Glass Sphere Test - a Gaussian splat place shown inside a glass ball, floating in passthrough (Quest 3 AR).
// Built from the official PlayCanvas glass-refraction example, minus the screen-grab refraction
// (that part needs a desktop render pass that WebXR does not support). What is kept: the splat is
// cropped to the inside of the sphere in the GPU work buffer, and a glossy see-through glass shell.
// Splats are loaded from GitHub (luckysunshine1994/portal-storage), not stored in PlayCanvas.
// Put this script on the Camera entity. Project setting "Transparent Canvas" must be ON.

var GlassSphere = pc.createScript('glassSphere');

GlassSphere.attributes.add('splatUrl', {
    type: 'string',
    default: 'https://raw.githubusercontent.com/luckysunshine1994/portal-storage/main/LibrarySplat250K/lod-meta.json',
    title: 'Splat (lod-meta.json link)'
});
GlassSphere.attributes.add('sphereRadius', { type: 'number', default: 0.25, title: 'Sphere radius (m)' });
GlassSphere.attributes.add('distance', { type: 'number', default: 0.9, title: 'Distance in front of you (m)' });
GlassSphere.attributes.add('height', { type: 'number', default: 1.2, title: 'Height above floor (m)' });
GlassSphere.attributes.add('splatScale', { type: 'number', default: 0.12, title: 'Splat scale inside the ball' });
GlassSphere.attributes.add('splatOffset', { type: 'vec3', default: [0.84, 0, 0.66], title: 'Splat offset (ball units)' });
GlassSphere.attributes.add('splatTiltX', { type: 'number', default: 0, title: 'Splat tilt X (deg)' });
GlassSphere.attributes.add('splatTiltZ', { type: 'number', default: 180, title: 'Splat tilt Z (deg, 180 = flip upright)' });
GlassSphere.attributes.add('spinSpeed', { type: 'number', default: 0, title: 'Slow spin of the world inside (deg/s, 0 = off; costs performance)' });
GlassSphere.attributes.add('exposure', { type: 'number', default: 1.0, title: 'Splat brightness' });
GlassSphere.attributes.add('glassOpacity', { type: 'number', default: 0.12, title: 'Glass opacity' });

var CROP_GLSL = [
    'uniform mat4 uCropMatrix;',
    'uniform float uCropSphere;',
    'uniform float uCropScale;',
    'uniform float uEdgeScaleFactor;',
    'uniform float uSplatExposure;',
    'void modifySplatCenter(inout vec3 center) {}',
    'void modifySplatRotationScale(vec3 originalCenter, vec3 modifiedCenter, inout vec4 rotation, inout vec3 scale) {',
    '    vec3 local = (uCropMatrix * vec4(modifiedCenter, 1.0)).xyz;',
    '    float minDist = uCropSphere - length(local);',
    '    if (minDist < 0.0) { scale = vec3(0.0); return; }',
    '    float worldDist = minDist * uCropScale;',
    '    float maxRadius = length(scale) * 3.0;',
    '    if (maxRadius > worldDist) { scale *= (worldDist / maxRadius) * uEdgeScaleFactor; }',
    '}',
    'void modifySplatColor(vec3 center, inout vec4 color) { color.rgb *= uSplatExposure; }'
].join('\n');

var CROP_WGSL = [
    'uniform uCropMatrix: mat4x4f;',
    'uniform uCropSphere: f32;',
    'uniform uCropScale: f32;',
    'uniform uEdgeScaleFactor: f32;',
    'uniform uSplatExposure: f32;',
    'fn modifySplatCenter(center: ptr<function, vec3f>) {}',
    'fn modifySplatRotationScale(originalCenter: vec3f, modifiedCenter: vec3f, rotation: ptr<function, vec4f>, scale: ptr<function, vec3f>) {',
    '    let local = (uniform.uCropMatrix * vec4f(modifiedCenter, 1.0)).xyz;',
    '    let minDist = uniform.uCropSphere - length(local);',
    '    if (minDist < 0.0) { *scale = vec3f(0.0); return; }',
    '    let worldDist = minDist * uniform.uCropScale;',
    '    let maxRadius = length(*scale) * 3.0;',
    '    if (maxRadius > worldDist) { *scale = (*scale) * (worldDist / maxRadius) * uniform.uEdgeScaleFactor; }',
    '}',
    'fn modifySplatColor(center: vec3f, color: ptr<function, vec4f>) { *color = vec4f((*color).rgb * uniform.uSplatExposure, (*color).a); }'
].join('\n');

GlassSphere.prototype.initialize = function () {
    var app = this.app;
    var self = this;

    // passthrough needs a fully transparent clear (with the project's Transparent Canvas setting)
    this.entity.camera.clearColor = new pc.Color(0, 0, 0, 0);
    this.entity.camera.nearClip = 0.02;

    // leftover template geometry should not float in the room
    ['Box', 'Plane'].forEach(function (n) { var e = app.root.findByName(n); if (e) e.enabled = false; });

    // layers: splat first, glass shell on top of it
    this.splatLayer = new pc.Layer({ name: 'SphereSplat' });
    this.glassLayer = new pc.Layer({ name: 'SphereGlass' });
    app.scene.layers.pushTransparent(this.splatLayer);
    app.scene.layers.pushTransparent(this.glassLayer);
    var camLayers = this.entity.camera.layers.filter(function (id) { return id !== pc.LAYERID_SKYBOX; });
    camLayers.push(this.splatLayer.id, this.glassLayer.id);
    this.entity.camera.layers = camLayers;

    if (app.scene.gsplat) {
        app.scene.gsplat.splatBudget = 300000;
        if ('radialSorting' in app.scene.gsplat) app.scene.gsplat.radialSorting = true;
    }

    // light for the glass highlights (there is no environment map in passthrough)
    var light = new pc.Entity('GlassLight');
    light.addComponent('light', { type: 'directional', color: new pc.Color(1, 1, 1), intensity: 1.2, castShadows: false });
    light.setEulerAngles(45, 30, 0);
    app.root.addChild(light);

    // glass ball (unit sphere, scaled to the radius)
    this.ball = new pc.Entity('GlassBall');
    app.root.addChild(this.ball);

    var glass = new pc.StandardMaterial();
    glass.diffuse = new pc.Color(0.85, 0.95, 1);
    glass.useMetalness = true;
    glass.metalness = 0;
    glass.useMetalnessSpecularColor = true;
    glass.specular = pc.Color.WHITE;
    glass.specularityFactor = 1;
    glass.gloss = 0.95;
    glass.emissive = new pc.Color(0.05, 0.08, 0.1);
    glass.blendType = pc.BLEND_NORMAL;
    glass.opacity = this.glassOpacity;
    glass.opacityFadesSpecular = false;
    glass.depthWrite = false;
    glass.update();
    this.glassMaterial = glass;

    var mesh = pc.Mesh.fromGeometry(app.graphicsDevice, new pc.SphereGeometry({ radius: 1, latitudeBands: 48, longitudeBands: 48 }));
    this.ball.addComponent('render', { meshInstances: [new pc.MeshInstance(mesh, glass)], layers: [this.glassLayer.id] });

    // the world inside: a pivot (for the slow spin) holding the splat
    this.pivot = new pc.Entity('SpherePivot');
    this.ball.addChild(this.pivot);

    var asset = new pc.Asset('sphereSplat', 'gsplat', { url: this.splatUrl });
    app.assets.add(asset);
    this.splat = new pc.Entity('SphereSplat');
    this.splat.addComponent('gsplat', { asset: asset, layers: [this.splatLayer.id] });
    this.pivot.addChild(this.splat);
    this._applySplatTransform();

    this.splat.gsplat.setWorkBufferModifier({ glsl: CROP_GLSL, wgsl: CROP_WGSL });
    this._cropMatrix = new pc.Mat4();

    this._placed = false;
    this._spin = 0;

    // desktop preview: put the ball in front of a fixed camera so it can be checked without a headset
    this.entity.setPosition(0, this.height, 0);
    this.entity.setEulerAngles(0, 0, 0);
    this._placeInFront();

    // enter AR on the first tap / click
    if (app.xr && app.xr.isAvailable(pc.XRTYPE_AR)) {
        var requested = false;
        var startAr = function () {
            if (requested || app.xr.active) return;
            requested = true;
            self.entity.setLocalPosition(0, 0, 0);
            self.entity.setLocalEulerAngles(0, 0, 0);
            app.xr.start(self.entity.camera, pc.XRTYPE_AR, pc.XRSPACE_LOCALFLOOR, {
                callback: function (err) { if (err) { console.error('glassSphere: AR failed', err); requested = false; } }
            });
        };
        if (app.mouse) app.mouse.on(pc.EVENT_MOUSEDOWN, startAr);
        if (app.touch) app.touch.on(pc.EVENT_TOUCHSTART, startAr);
        app.xr.on('start', function () {
            try { app.xr.fixedFoveation = 1; } catch (e) {}
            self._placed = false; // place in front of the headset on the first tracked frame
        });
        // trigger / pinch re-places the ball in front of you
        app.xr.input.on('select', function () { self._placeInFront(); });
    } else {
        console.warn('glassSphere: immersive AR not available, desktop preview only');
    }
};

GlassSphere.prototype._applySplatTransform = function () {
    var o = this.splatOffset;
    this.splat.setLocalPosition(o.x, o.y, o.z);
    this.splat.setLocalEulerAngles(this.splatTiltX, 0, this.splatTiltZ);
    this.splat.setLocalScale(this.splatScale, this.splatScale, this.splatScale);
};

var _fwd = new pc.Vec3();
GlassSphere.prototype._placeInFront = function () {
    var cam = this.entity;
    var p = cam.getPosition();
    _fwd.copy(cam.forward);
    _fwd.y = 0;
    if (_fwd.lengthSq() < 1e-6) _fwd.set(0, 0, -1);
    _fwd.normalize();
    this.ball.setPosition(p.x + _fwd.x * this.distance, this.height, p.z + _fwd.z * this.distance);
    this.ball.setLocalScale(this.sphereRadius, this.sphereRadius, this.sphereRadius);
    this._updateCrop();
    this._placed = true;
};

// world -> ball-local matrix for the crop; only re-sent when the ball moves (each send re-crops)
GlassSphere.prototype._updateCrop = function () {
    var g = this.splat && this.splat.gsplat;
    if (!g) return;
    this._cropMatrix.copy(this.ball.getWorldTransform()).invert();
    g.setParameter('uCropMatrix', this._cropMatrix.data);
    g.setParameter('uCropSphere', 1.0);
    g.setParameter('uCropScale', this.sphereRadius);
    g.setParameter('uEdgeScaleFactor', 0.0);
    g.setParameter('uSplatExposure', this.exposure);
};

GlassSphere.prototype.update = function (dt) {
    if (this.app.xr && this.app.xr.active && !this._placed) {
        this._placeInFront();
    }
    // slow spin of the world inside the glass; the crop stays fixed to the ball
    if (this.spinSpeed !== 0 && this.pivot) {
        this._spin = (this._spin + this.spinSpeed * dt) % 360;
        this.pivot.setLocalEulerAngles(0, this._spin, 0);
    }
};
