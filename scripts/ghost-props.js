// Ghost Props - Open to Stay (Katya Solomatina)
// Objects from the stories appear as pale "ghost memory" splats around you: they build themselves
// out of drifting particles, hold, then burn away. Touch one with a fingertip (or controller) and it
// pops like a soap bubble.
//
// Each prop is a small Gaussian splat (.sog) made from a free 3D model and streamed from GitHub
// (luckysunshine1994/portal-storage/props), so nothing is stored in PlayCanvas.
// The list of props, their sizes and where they float comes from props/props-manifest.json.
//
// Put this script on its own entity (e.g. "GhostProps"). It does not change xr-portal.js.
// In AR it starts `startDelay` seconds after the green cube is touched.
// On desktop (no AR) it starts after 2 s around the camera, so you can preview it with Launch.

var GhostProps = pc.createScript('ghostProps');

GhostProps.attributes.add('manifestUrl', { type: 'string', default: 'https://raw.githubusercontent.com/luckysunshine1994/portal-storage/main/props/props-manifest.json', title: 'Props list (props-manifest.json link)' });
GhostProps.attributes.add('stories', { type: 'string', default: 'lagan,tayo,israel,kowther', title: 'Stories to show, in order (comma separated)' });
GhostProps.attributes.add('startDelay', { type: 'number', default: 8, title: 'Start this many seconds after the cube touch (AR)' });
GhostProps.attributes.add('perWave', { type: 'number', default: 6, title: 'Props shown at the same time' });
GhostProps.attributes.add('appearDuration', { type: 'number', default: 3.5, title: 'Build-up time (s)' });
GhostProps.attributes.add('holdDuration', { type: 'number', default: 10, title: 'Hold time (s)' });
GhostProps.attributes.add('vanishDuration', { type: 'number', default: 3, title: 'Burn-away time (s)' });
GhostProps.attributes.add('waveGap', { type: 'number', default: 1.5, title: 'Pause between waves (s)' });
GhostProps.attributes.add('loop', { type: 'boolean', default: true, title: 'Start again after the last wave' });
GhostProps.attributes.add('ghostTint', { type: 'rgb', default: [0.86, 0.93, 1.0], title: 'Ghost colour' });
GhostProps.attributes.add('ghostAmount', { type: 'number', default: 0.75, title: 'How ghostly (0 = real colours, 1 = all ghost colour)' });
GhostProps.attributes.add('ghostOpacity', { type: 'number', default: 0.8, title: 'Ghost opacity' });
GhostProps.attributes.add('edgeColor', { type: 'rgb', default: [0.75, 0.9, 1.0], title: 'Build/burn edge colour' });
GhostProps.attributes.add('edgeGlow', { type: 'number', default: 1.6, title: 'Edge glow' });
GhostProps.attributes.add('popDuration', { type: 'number', default: 0.45, title: 'Pop time when touched (s)' });
GhostProps.attributes.add('popLift', { type: 'number', default: 0.6, title: 'Pop lift (m)' });
GhostProps.attributes.add('touchPadding', { type: 'number', default: 0.06, title: 'Touch distance padding (m)' });
GhostProps.attributes.add('distanceScale', { type: 'number', default: 1, title: 'Push props further out (x)' });

var GHOST_GLSL = [
    'uniform float uProgress;',
    'uniform float uEdgeWidth;',
    'uniform float uNoiseFrequency;',
    'uniform vec3 uEdgeColor;',
    'uniform float uLiftDistance;',
    'uniform float uWaveAmplitude;',
    'uniform float uTime;',
    'uniform vec3 uGhostTint;',
    'uniform float uGhostAmount;',
    'uniform float uGhostOpacity;',
    'float g_burn;',
    'float gpHash(vec3 p) { p = fract(p * vec3(443.8975, 397.2973, 491.1871)); p += dot(p, p.yzx + 19.19); return fract((p.x + p.y) * p.z); }',
    'float gpNoise(vec3 p) { vec3 i = floor(p); vec3 f = fract(p); vec3 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(mix(gpHash(i), gpHash(i + vec3(1.0,0.0,0.0)), u.x), mix(gpHash(i + vec3(0.0,1.0,0.0)), gpHash(i + vec3(1.0,1.0,0.0)), u.x), u.y),',
    '             mix(mix(gpHash(i + vec3(0.0,0.0,1.0)), gpHash(i + vec3(1.0,0.0,1.0)), u.x), mix(gpHash(i + vec3(0.0,1.0,1.0)), gpHash(i + vec3(1.0,1.0,1.0)), u.x), u.y), u.z); }',
    'float gpFbm(vec3 p) { return (0.5 * gpNoise(p) + 0.25 * gpNoise(p * 2.02) + 0.125 * gpNoise(p * 4.04)) / 0.875; }',
    'void modifySplatCenter(inout vec3 center) {',
    '    float n = gpFbm(center * uNoiseFrequency);',
    '    g_burn = clamp((uProgress * (1.0 + uEdgeWidth) - n) / uEdgeWidth, 0.0, 1.0);',
    '    if (g_burn <= 0.0) return;',
    '    float travel = g_burn * g_burn;',
    '    float ph = n * 43.7;',
    '    center += vec3(sin(center.y * 5.8 + ph + uTime * 2.0) * uWaveAmplitude * travel, travel * uLiftDistance, cos(center.x * 5.8 + ph + uTime * 1.7) * uWaveAmplitude * travel);',
    '}',
    'void modifySplatRotationScale(vec3 originalCenter, vec3 modifiedCenter, inout vec4 rotation, inout vec3 scale) {',
    '    if (g_burn <= 0.0) return;',
    '    if (g_burn >= 1.0) { scale = vec3(0.0); return; }',
    '    float size = max(max(scale.x, scale.y), scale.z);',
    '    scale = mix(scale, vec3(size), min(g_burn * 3.0, 1.0)) * (1.0 - g_burn);',
    '}',
    'void modifySplatColor(vec3 center, inout vec4 color) {',
    '    color.rgb = mix(color.rgb, uGhostTint * (0.72 + 0.28 * dot(color.rgb, vec3(0.333))), uGhostAmount);',
    '    color.a *= uGhostOpacity;',
    '    if (g_burn <= 0.0) return;',
    '    color.rgb = mix(color.rgb, uEdgeColor, smoothstep(0.0, 0.4, g_burn));',
    '    color.a *= 1.0 - smoothstep(0.5, 1.0, g_burn);',
    '}'
].join('\n');

var GHOST_WGSL = [
    'uniform uProgress: f32;',
    'uniform uEdgeWidth: f32;',
    'uniform uNoiseFrequency: f32;',
    'uniform uEdgeColor: vec3f;',
    'uniform uLiftDistance: f32;',
    'uniform uWaveAmplitude: f32;',
    'uniform uTime: f32;',
    'uniform uGhostTint: vec3f;',
    'uniform uGhostAmount: f32;',
    'uniform uGhostOpacity: f32;',
    'var<private> g_burn: f32;',
    'fn gpHash(pIn: vec3f) -> f32 { var p = fract(pIn * vec3f(443.8975, 397.2973, 491.1871)); p = p + dot(p, p.yzx + 19.19); return fract((p.x + p.y) * p.z); }',
    'fn gpNoise(p: vec3f) -> f32 { let i = floor(p); let f = fract(p); let u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(mix(gpHash(i), gpHash(i + vec3f(1.0,0.0,0.0)), u.x), mix(gpHash(i + vec3f(0.0,1.0,0.0)), gpHash(i + vec3f(1.0,1.0,0.0)), u.x), u.y),',
    '             mix(mix(gpHash(i + vec3f(0.0,0.0,1.0)), gpHash(i + vec3f(1.0,0.0,1.0)), u.x), mix(gpHash(i + vec3f(0.0,1.0,1.0)), gpHash(i + vec3f(1.0,1.0,1.0)), u.x), u.y), u.z); }',
    'fn gpFbm(p: vec3f) -> f32 { return (0.5 * gpNoise(p) + 0.25 * gpNoise(p * 2.02) + 0.125 * gpNoise(p * 4.04)) / 0.875; }',
    'fn modifySplatCenter(center: ptr<function, vec3f>) {',
    '    let n = gpFbm((*center) * uniform.uNoiseFrequency);',
    '    g_burn = clamp((uniform.uProgress * (1.0 + uniform.uEdgeWidth) - n) / uniform.uEdgeWidth, 0.0, 1.0);',
    '    if (g_burn <= 0.0) { return; }',
    '    let travel = g_burn * g_burn;',
    '    let ph = n * 43.7;',
    '    let c = *center;',
    '    *center = c + vec3f(sin(c.y * 5.8 + ph + uniform.uTime * 2.0) * uniform.uWaveAmplitude * travel, travel * uniform.uLiftDistance, cos(c.x * 5.8 + ph + uniform.uTime * 1.7) * uniform.uWaveAmplitude * travel);',
    '}',
    'fn modifySplatRotationScale(originalCenter: vec3f, modifiedCenter: vec3f, rotation: ptr<function, vec4f>, scale: ptr<function, vec3f>) {',
    '    if (g_burn <= 0.0) { return; }',
    '    if (g_burn >= 1.0) { *scale = vec3f(0.0); return; }',
    '    let s = *scale;',
    '    let size = max(max(s.x, s.y), s.z);',
    '    *scale = mix(s, vec3f(size), min(g_burn * 3.0, 1.0)) * (1.0 - g_burn);',
    '}',
    'fn modifySplatColor(center: vec3f, color: ptr<function, vec4f>) {',
    '    var c = *color;',
    '    c = vec4f(mix(c.rgb, uniform.uGhostTint * (0.72 + 0.28 * dot(c.rgb, vec3f(0.333))), uniform.uGhostAmount), c.a * uniform.uGhostOpacity);',
    '    if (g_burn > 0.0) {',
    '        c = vec4f(mix(c.rgb, uniform.uEdgeColor, smoothstep(0.0, 0.4, g_burn)), c.a * (1.0 - smoothstep(0.5, 1.0, g_burn)));',
    '    }',
    '    *color = c;',
    '}'
].join('\n');

GhostProps.prototype.initialize = function () {
    this._props = [];      // everything in the manifest for the chosen stories
    this._waves = [];      // arrays of prop entries
    this._waveIndex = -1;
    this._active = [];     // props currently on screen
    this._time = 0;
    this._started = false;
    this._startAt = null;
    this._baseUrl = this.manifestUrl.replace(/[^\/]*$/, '');
    this._layer = null;
    this._edge = [0, 0, 0];
    this._white = [1.6, 1.6, 1.6];
    this._tint = [0, 0, 0];
    this._loadManifest();
};

GhostProps.prototype._loadManifest = function () {
    var self = this;
    fetch(this.manifestUrl, { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (m) {
        var wanted = self.stories.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        var list = [];
        wanted.forEach(function (story) {
            (m.props || []).forEach(function (p) { if (p.story === story && p.enabled !== false) list.push(p); });
        });
        self._props = list;
        // waves: within each story, split into groups of perWave
        var per = Math.max(1, Math.round(self.perWave));
        wanted.forEach(function (story) {
            var s = list.filter(function (p) { return p.story === story; });
            for (var i = 0; i < s.length; i += per) self._waves.push(s.slice(i, i + per));
        });
        console.log('ghostProps: ' + list.length + ' props in ' + self._waves.length + ' waves');
    }).catch(function (e) { console.error('ghostProps: could not load props list', e); });
};

// own transparent layer, drawn after the portal's splat layers so ghosts are never hidden by the farm
GhostProps.prototype._ensureLayer = function () {
    if (this._layer) return;
    var layers = this.app.scene.layers;
    this._layer = new pc.Layer({ name: 'GhostProps' });
    layers.pushTransparent(this._layer);
    var cams = this.app.root.findComponents('camera');
    for (var i = 0; i < cams.length; i++) {
        var ids = cams[i].layers.slice();
        if (ids.indexOf(this._layer.id) === -1) { ids.push(this._layer.id); cams[i].layers = ids; }
    }
};

GhostProps.prototype._camera = function () {
    var cams = this.app.root.findComponents('camera');
    return cams.length ? cams[0].entity : null;
};

// place a wave on an arc in front of the viewer; big things further away
GhostProps.prototype._layout = function (wave) {
    var cam = this._camera();
    var p = cam ? cam.getPosition().clone() : new pc.Vec3();
    var fwd = cam ? cam.forward.clone() : new pc.Vec3(0, 0, -1);
    fwd.y = 0; if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1); fwd.normalize();
    var baseYaw = Math.atan2(fwd.x, fwd.z);
    var xr = this.app.xr && this.app.xr.active;
    var floorY = xr ? (cam.parent ? cam.parent.getPosition().y : 0) : p.y - 1.6;
    var n = wave.length;
    var spread = Math.min(Math.PI * 1.1, 0.5 + n * 0.32); // total arc
    var out = [];
    for (var i = 0; i < n; i++) {
        var item = wave[i];
        var a = baseYaw + (n === 1 ? 0 : (-spread / 2 + spread * i / (n - 1)));
        var d = (item.distance || 2) * this.distanceScale;
        out.push({
            pos: new pc.Vec3(p.x + Math.sin(a) * d, floorY + (item.y || 0), p.z + Math.cos(a) * d),
            yaw: a * pc.math.RAD_TO_DEG + 180 + (item.yaw || 0)   // face the viewer
        });
    }
    return out;
};

GhostProps.prototype._startWave = function () {
    if (!this._waves.length) return;
    this._waveIndex++;
    if (this._waveIndex >= this._waves.length) {
        if (!this.loop) return;
        this._waveIndex = 0;
    }
    this._ensureLayer();
    var wave = this._waves[this._waveIndex];
    var places = this._layout(wave);
    var self = this;
    console.log('ghostProps: wave ' + (this._waveIndex + 1) + '/' + this._waves.length + ' (' + wave[0].story + ')');
    wave.forEach(function (item, i) {
        var url = /^https?:/.test(item.splat) ? item.splat : self._baseUrl + item.splat;
        var asset = new pc.Asset('ghost-' + item.id, 'gsplat', { url: url });
        self.app.assets.add(asset);
        var e = new pc.Entity('Ghost ' + item.id);
        e.setPosition(places[i].pos);
        e.setEulerAngles(0, places[i].yaw, 0);
        self.app.root.addChild(e);
        var prop = { item: item, entity: e, asset: asset, state: 'loading', t0: 0, radius: (item.size || 1) * 0.5, centerY: (item.height || item.size || 1) * 0.5 };
        self._active.push(prop);
        asset.on('load', function () {
            if (!prop.entity) return;
            e.addComponent('gsplat', { asset: asset, layers: [self._layer.id] });
            e.gsplat.setWorkBufferModifier({ glsl: GHOST_GLSL, wgsl: GHOST_WGSL });
            prop.state = 'appearing';
            prop.t0 = self._time;
            self._apply(prop, 1, self._edgeArr());
        });
        asset.on('error', function (err) { console.error('ghostProps: could not load ' + url, err); prop.state = 'done'; });
        self.app.assets.load(asset);
    });
    this._waveEnds = null;
};

GhostProps.prototype._edgeArr = function () {
    this._edge[0] = this.edgeColor.r * this.edgeGlow; this._edge[1] = this.edgeColor.g * this.edgeGlow; this._edge[2] = this.edgeColor.b * this.edgeGlow;
    return this._edge;
};

GhostProps.prototype._apply = function (prop, progress, edge, lift) {
    var g = prop.entity && prop.entity.gsplat;
    if (!g) return;
    var item = prop.item;
    var tint = item.tint || [this.ghostTint.r, this.ghostTint.g, this.ghostTint.b];
    g.setParameter('uProgress', progress);
    g.setParameter('uEdgeWidth', 0.14);
    g.setParameter('uNoiseFrequency', 3.0 / Math.max(0.15, Math.min(item.size || 1, 4)));
    g.setParameter('uEdgeColor', item.silhouette ? [0.9, 0.35, 0.08] : edge);
    g.setParameter('uLiftDistance', lift !== undefined ? lift : 0.25 * Math.min(item.size || 1, 3));
    g.setParameter('uWaveAmplitude', 0.03 * Math.min(item.size || 1, 3));
    g.setParameter('uTime', this._time);
    g.setParameter('uGhostTint', tint);
    g.setParameter('uGhostAmount', item.ghostAmount !== undefined ? item.ghostAmount : this.ghostAmount);
    g.setParameter('uGhostOpacity', item.opacity !== undefined ? item.opacity : this.ghostOpacity);
};

GhostProps.prototype._remove = function (prop) {
    if (prop.entity) prop.entity.destroy();
    prop.entity = null;
    if (prop.asset) { prop.asset.unload(); this.app.assets.remove(prop.asset); }
    prop.asset = null;
    prop.state = 'done';
};

var _gpTip = new pc.Vec3();
var _gpCenter = new pc.Vec3();
GhostProps.prototype._checkTouches = function () {
    var xr = this.app.xr;
    if (!xr || !xr.active || !xr.input) return;
    var points = [];
    var sources = xr.input.inputSources;
    for (var i = 0; i < sources.length; i++) {
        var s = sources[i];
        if (s.hand && s.hand.tracking) {
            var tip = s.hand.getJointById('index-finger-tip');
            if (tip) points.push(tip.getPosition().clone());
        } else if (s.grip && s.getPosition) {
            var gp = s.getPosition();
            if (gp) points.push(gp.clone());
        }
    }
    if (!points.length) return;
    for (var k = 0; k < this._active.length; k++) {
        var prop = this._active[k];
        if (prop.state !== 'holding' && prop.state !== 'appearing') continue;
        _gpCenter.copy(prop.entity.getPosition());
        _gpCenter.y += prop.centerY;
        var r = Math.max(0.08, prop.radius) + this.touchPadding;
        for (var j = 0; j < points.length; j++) {
            if (points[j].distance(_gpCenter) < r) { prop.state = 'popping'; prop.t0 = this._time; break; }
        }
    }
};

GhostProps.prototype.update = function (dt) {
    this._time += dt;

    // decide when to start
    if (!this._started) {
        var xr = this.app.xr;
        if (xr && xr.active) {
            var portal = this._camera() && this._camera().script && this._camera().script.xrPortal;
            if (portal && portal._primaryTriggered && this._startAt === null) this._startAt = this._time + this.startDelay;
        } else if (this._startAt === null && this._time > 0.1 && !(xr && xr.isAvailable && xr.isAvailable(pc.XRTYPE_AR))) {
            this._startAt = this._time + 2; // desktop preview
        }
        if (this._startAt !== null && this._time >= this._startAt && this._waves.length) {
            this._started = true;
            this._startWave();
        }
        return;
    }

    this._checkTouches();

    var edge = this._edgeArr();
    var anyAlive = false, allLoaded = true, allHeld = true;
    for (var i = 0; i < this._active.length; i++) {
        var p = this._active[i];
        if (p.state === 'done') continue;
        anyAlive = true;
        var t = this._time - p.t0;
        if (p.state === 'loading') { allLoaded = false; continue; }
        if (p.state === 'appearing') {
            var a = Math.min(1, t / Math.max(this.appearDuration, 0.01));
            this._apply(p, 1 - a, edge);
            if (a >= 1) { p.state = 'holding'; p.t0 = this._time; this._apply(p, 0, edge); }
            allHeld = false;
        } else if (p.state === 'vanishing') {
            var v = Math.min(1, t / Math.max(this.vanishDuration, 0.01));
            this._apply(p, v, edge);
            if (v >= 1) this._remove(p);
        } else if (p.state === 'popping') {
            var q = Math.min(1, t / Math.max(this.popDuration, 0.01));
            this._apply(p, q, this._white, this.popLift);
            if (q >= 1) this._remove(p);
        }
    }

    // wave timing: once everything has built up, hold, then burn the rest away
    if (allLoaded && allHeld && this._waveEnds === null && anyAlive) this._waveEnds = this._time + this.holdDuration;
    if (this._waveEnds !== null && this._time >= this._waveEnds) {
        for (var j = 0; j < this._active.length; j++) {
            if (this._active[j].state === 'holding') { this._active[j].state = 'vanishing'; this._active[j].t0 = this._time; }
        }
        this._waveEnds = Infinity;
    }
    if (!anyAlive || this._active.every(function (x) { return x.state === 'done'; })) {
        this._active = [];
        if (this._nextWaveAt === undefined || this._nextWaveAt === null) this._nextWaveAt = this._time + this.waveGap;
        if (this._time >= this._nextWaveAt) { this._nextWaveAt = null; this._startWave(); }
    }
};
