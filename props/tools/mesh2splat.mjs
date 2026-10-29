// mesh2splat.mjs  — turn a .glb/.gltf model into a Gaussian splat .ply (surface sampled, textured colours)
// usage: node mesh2splat.mjs in.glb out.ply --size 1.2 --count 20000
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import { MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'fs';

const args = process.argv.slice(2);
const inFile = args[0], outFile = args[1];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const targetSize = parseFloat(opt('size', '1'));
const count = parseInt(opt('count', '20000'));
const sizeAxis = opt('axis', 'max'); // max | height
const rotX = parseFloat(opt('rotx', '0')) * Math.PI / 180;
const rotY = parseFloat(opt('roty', '0')) * Math.PI / 180;

await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'meshopt.decoder': MeshoptDecoder
});
const doc = await io.read(inFile);
const root = doc.getRoot();
const scene = root.getDefaultScene() || root.listScenes()[0];

// ---- texture cache
const texCache = new Map();
async function getTex(tex) {
  if (!tex) return null;
  if (texCache.has(tex)) return texCache.get(tex);
  let t = null;
  try {
    const img = sharp(Buffer.from(tex.getImage())).ensureAlpha();
    const meta = await img.metadata();
    const scale = Math.min(1, 512 / Math.max(meta.width, meta.height));
    const w = Math.max(1, Math.round(meta.width * scale)), h = Math.max(1, Math.round(meta.height * scale));
    const data = await img.resize(w, h).raw().toBuffer();
    t = { w, h, data };
  } catch (e) { t = null; }
  texCache.set(tex, t);
  return t;
}
const srgb2lin = c => c; // keep sRGB values: splat colours are display-referred

// ---- collect triangles in world space
const tris = []; // {a,b,c (vec3), uv?, col, tex}
function rot(v){let [x,y,z]=v;if(rotX){const c=Math.cos(rotX),s=Math.sin(rotX);[y,z]=[y*c-z*s,y*s+z*c];}if(rotY){const c=Math.cos(rotY),s=Math.sin(rotY);[x,z]=[x*c+z*s,-x*s+z*c];}return [x,y,z];}
function mulMat0(m, v) { return [m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12], m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13], m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14]]; }
function mulMat(m, v) { return rot(mulMat0(m, v)); }
const prims = [];
scene.traverse(node => {
  const mesh = node.getMesh(); if (!mesh) return;
  const M = node.getWorldMatrix();
  for (const p of mesh.listPrimitives()) prims.push({ p, M });
});
for (const { p, M } of prims) {
  if (p.getMode() !== 4) continue;
  const pos = p.getAttribute('POSITION'); if (!pos) continue;
  const uv = p.getAttribute('TEXCOORD_0');
  const vcol = p.getAttribute('COLOR_0');
  const mat = p.getMaterial();
  const factor = mat ? mat.getBaseColorFactor() : [0.8, 0.8, 0.8, 1];
  const tex = mat ? await getTex(mat.getBaseColorTexture()) : null;
  const idx = p.getIndices();
  const n = idx ? idx.getCount() : pos.getCount();
  const P = [], U = [], C = [];
  for (let i = 0; i < pos.getCount(); i++) {
    P.push(mulMat(M, pos.getElement(i, [])));
    if (uv) U.push(uv.getElement(i, []));
    if (vcol) C.push(vcol.getElement(i, []));
  }
  for (let i = 0; i + 2 < n; i += 3) {
    const ia = idx ? idx.getScalar(i) : i, ib = idx ? idx.getScalar(i + 1) : i + 1, ic = idx ? idx.getScalar(i + 2) : i + 2;
    tris.push({ a: P[ia], b: P[ib], c: P[ic], ua: U[ia], ub: U[ib], uc: U[ic], ca: C[ia], factor, tex, alpha: mat ? mat.getAlphaMode() : 'OPAQUE' });
  }
}
if (!tris.length) { console.error('no triangles'); process.exit(1); }

// ---- normalise: centre on x/z, floor at y=0, scale to target size
let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
for (const t of tris) for (const v of [t.a, t.b, t.c]) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], v[k]); mx[k] = Math.max(mx[k], v[k]); }
const ext = [mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]];
const ref = sizeAxis === 'height' ? ext[1] : Math.max(...ext);
const s = targetSize / ref;
const cx = (mn[0] + mx[0]) / 2, cz = (mn[2] + mx[2]) / 2, fy = mn[1];
const norm = v => [(v[0] - cx) * s, (v[1] - fy) * s, (v[2] - cz) * s];
let area = 0; const cum = [];
for (const t of tris) {
  t.a = norm(t.a); t.b = norm(t.b); t.c = norm(t.c);
  const e1 = [t.b[0]-t.a[0], t.b[1]-t.a[1], t.b[2]-t.a[2]], e2 = [t.c[0]-t.a[0], t.c[1]-t.a[1], t.c[2]-t.a[2]];
  const cr = [e1[1]*e2[2]-e1[2]*e2[1], e1[2]*e2[0]-e1[0]*e2[2], e1[0]*e2[1]-e1[1]*e2[0]];
  const len = Math.hypot(...cr);
  t.n = len > 0 ? cr.map(x => x / len) : [0, 1, 0];
  area += len / 2; cum.push(area);
}

// ---- sample
const N = count;
const spacing = Math.sqrt(area / N);
const r = spacing * 0.75; // splat radius
function pick(u) { let lo = 0, hi = cum.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < u) lo = m + 1; else hi = m; } return tris[lo]; }
function sampleTex(tex, uvv) {
  let u = uvv[0] - Math.floor(uvv[0]), v = uvv[1] - Math.floor(uvv[1]);
  const x = Math.min(tex.w - 1, Math.floor(u * tex.w)), y = Math.min(tex.h - 1, Math.floor(v * tex.h));
  const o = (y * tex.w + x) * 4;
  return [tex.data[o] / 255, tex.data[o + 1] / 255, tex.data[o + 2] / 255, tex.data[o + 3] / 255];
}
function quatFromZ(n) { // rotate +z onto n
  const z = [0, 0, 1]; const d = z[0]*n[0]+z[1]*n[1]+z[2]*n[2];
  if (d < -0.9999) return [0, 1, 0, 0]; // w,x,y,z
  const ax = [z[1]*n[2]-z[2]*n[1], z[2]*n[0]-z[0]*n[2], z[0]*n[1]-z[1]*n[0]];
  const q = [1 + d, ax[0], ax[1], ax[2]]; const l = Math.hypot(...q); return q.map(x => x / l);
}
const SH0 = 0.28209479177387814;
const rows = [];
let rng = 12345; const rand = () => { rng = (rng * 1664525 + 1013904223) >>> 0; return rng / 4294967296; };
for (let i = 0; i < N; i++) {
  const t = pick(((i + rand()) / N) * area);
  let u1 = rand(), u2 = rand(); if (u1 + u2 > 1) { u1 = 1 - u1; u2 = 1 - u2; }
  const w0 = 1 - u1 - u2;
  const p = [0, 1, 2].map(k => w0 * t.a[k] + u1 * t.b[k] + u2 * t.c[k]);
  let col = [t.factor[0], t.factor[1], t.factor[2], t.factor[3]];
  if (t.tex && t.ua) {
    const uvv = [w0 * t.ua[0] + u1 * t.ub[0] + u2 * t.uc[0], w0 * t.ua[1] + u1 * t.ub[1] + u2 * t.uc[1]];
    const tc = sampleTex(t.tex, uvv); col = [col[0] * tc[0], col[1] * tc[1], col[2] * tc[2], col[3] * tc[3]];
  } else if (t.ca) { col = [col[0] * t.ca[0], col[1] * t.ca[1], col[2] * t.ca[2], col[3]]; }
  if (t.alpha !== 'OPAQUE' && col[3] < 0.3) continue;
  // glTF factors/vertex colours are linear; textures are sRGB. Approximate linear->sRGB for untextured colours.
  if (!(t.tex && t.ua)) col = [0, 1, 2].map(k => Math.pow(Math.max(0, col[k]), 1 / 2.2)).concat([col[3]]);
  const q = quatFromZ(t.n);
  rows.push([p[0], p[1], p[2], (col[0] - 0.5) / SH0, (col[1] - 0.5) / SH0, (col[2] - 0.5) / SH0,
    Math.log(0.95 / 0.05), Math.log(r), Math.log(r), Math.log(r * 0.25), q[0], q[1], q[2], q[3]]);
}
const props = ['x','y','z','f_dc_0','f_dc_1','f_dc_2','opacity','scale_0','scale_1','scale_2','rot_0','rot_1','rot_2','rot_3'];
const header = `ply\nformat binary_little_endian 1.0\nelement vertex ${rows.length}\n` + props.map(p => `property float ${p}`).join('\n') + '\nend_header\n';
const buf = Buffer.alloc(rows.length * props.length * 4);
let o = 0; for (const row of rows) for (const v of row) { buf.writeFloatLE(v, o); o += 4; }
fs.writeFileSync(outFile, Buffer.concat([Buffer.from(header), buf]));
console.log(JSON.stringify({ in: inFile, tris: tris.length, splats: rows.length, size: [ext[0]*s, ext[1]*s, ext[2]*s].map(x => +x.toFixed(2)) }));
