import { SPEC, STORIES } from './spec.mjs';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUT = '/home/claude/portal-storage/props';
const TMP = '/tmp/claude-0/-home-claude/2fb93f8c-f93f-5662-9694-4c826d21533d/scratchpad/props-tool/ply';
fs.mkdirSync(TMP, { recursive: true });
const only = process.argv[2];

// credits from the download metadata
const sf = JSON.parse(fs.readFileSync('/mnt/user-data/uploads/Downloads/ots_props_split/sketchfab_meta.json'));
const pp = JSON.parse(fs.readFileSync('pp/polypizza_meta.json'));
function credit(s) {
  if (s.site) return { site: s.site, author: s.author, lic: s.lic, url: s.url, title: s.label };
  const base = path.basename(s.src);
  const m = sf.find(x => x.file && base === x.file.split('/').pop());
  if (m) return { site: 'Sketchfab', author: m.author, lic: m.lic, url: m.url, title: m.title };
  const p = pp.find(x => base === x.key + '.glb');
  if (p) { const by = (p.title.match(/By (.+) - Poly Pizza/) || [])[1]; return { site: 'Poly Pizza', author: by, lic: p.lic, url: p.url, title: p.title.split(' - ')[0] }; }
  return { site: '?', author: '?', lic: '?', url: '' };
}

const results = fs.existsSync('build-results.json') ? JSON.parse(fs.readFileSync('build-results.json')) : {};
for (const s of SPEC) {
  if (s.reuse) continue;
  if (only && s.id !== only) continue;
  const dir = path.join(OUT, s.story); fs.mkdirSync(dir, { recursive: true });
  const ply = path.join(TMP, `${s.story}__${s.id}.ply`), sog = path.join(dir, `${s.id}.sog`);
  try {
    const out = execFileSync('node', ['--max-old-space-size=6000', 'mesh2splat.mjs', s.src, ply, '--size', String(s.size), '--count', String(s.count), '--axis', s.axis || 'max', '--rotx', String(s.rotx || 0), '--roty', String(s.roty || 0)], { encoding: 'utf8' });
    execFileSync('npx', ['splat-transform', '-q', '-w', ply, sog], { encoding: 'utf8' });
    results[s.story + '/' + s.id] = { ...JSON.parse(out.trim().split('\n').pop()), bytes: fs.statSync(sog).size };
    console.log('OK', s.story, s.id, results[s.story + '/' + s.id].splats, results[s.story + '/' + s.id].size);
  } catch (e) { console.log('FAIL', s.id, String(e.stderr || e).slice(0, 300)); }
}
fs.writeFileSync('build-results.json', JSON.stringify(results, null, 1));

// manifest
const props = SPEC.map(s => {
  const r = results[s.story + '/' + s.id] || {};
  const file = s.reuse ? s.reuse : `${s.story}/${s.id}.sog`;
  const size = r.size || null;
  const e = { id: s.story + '-' + s.id, story: s.story, label: s.label, splat: file, size: s.size, height: size ? size[1] : s.size, y: s.y || 0, distance: s.distance, splats: r.splats || (s.reuse ? 4000 : null) };
  if (s.yaw) e.yaw = s.yaw;
  if (s.silhouette) Object.assign(e, { silhouette: true, tint: [0.03, 0.03, 0.04], ghostAmount: 1, opacity: 0.95 });
  return e;
});
fs.writeFileSync(path.join(OUT, 'props-manifest.json'), JSON.stringify({
  about: 'Open to Stay ghost props. Read by scripts/ghost-props.js. splat paths are relative to this file. size/height/y/distance in metres. Set "enabled": false on a line to hide that prop.',
  stories: STORIES, props
}, null, 1));

// README + CREDITS
const lic = s => credit(s);
let md = `# Props: ghost memories for Open to Stay\n\nObjects the storytellers mention, turned into small Gaussian splats (.sog) so they stream from GitHub like the scans and use no PlayCanvas storage.\nThey are shown by \`scripts/ghost-props.js\`, which reads \`props-manifest.json\` in this folder.\n\nMade 29 Oct 2026 from free models (Sketchfab, Poly Pizza, Poly Haven). Each model was surface-sampled into splats with its own colours, scaled to real size, centred, and its base put on the floor (y = 0). Converter: \`props/tools/mesh2splat.mjs\`, then splat-transform 3.10.3 to .sog.\n\n**Folders:** one per story. File name = object. Options for the same object end in -a, -b, -c.\n\nTo hide a prop: set \`"enabled": false\` on its line in props-manifest.json. To change where it floats: edit its \`distance\` (m from you) or \`y\` (m above the floor).\n\n`;
for (const [k, title] of Object.entries(STORIES)) {
  md += `## ${title} — \`props/${k}/\`\n\n| File | What it is | Splats | Size (m) | Source | Licence |\n|---|---|---|---|---|---|\n`;
  for (const s of SPEC.filter(x => x.story === k)) {
    const r = results[s.story + '/' + s.id] || {};
    const c = s.reuse ? { site: 'same file as', author: s.reuse, lic: '', url: '' } : lic(s);
    md += `| \`${s.reuse ? s.reuse : k + '/' + s.id + '.sog'}\` | ${s.label}${s.silhouette ? ' (dark silhouette)' : ''} | ${r.splats ? r.splats.toLocaleString('en-GB') : '—'} | ${r.size ? r.size.join(' × ') : '—'} | ${c.url ? `[${c.site}: ${c.author}](${c.url})` : c.site + ' ' + c.author} | ${c.lic} |\n`;
  }
  md += '\n';
}
md += `## Not included\n\n- Magpie (Tom McGrath) and the low-poly milk carton (Ada_A): Sketchfab "Standard" licence, which doesn't allow sharing the model files publicly. They're in your Downloads source folder if you want them for a private build.\n\n## Source models\n\nOriginal downloads are on the laptop in \`Downloads\\ots_props_split\\\` (Sketchfab) and \`Downloads\\ots_props_polypizza.zip\`, \`Downloads\\ots_props_polyhaven.zip\`. Not stored here (too big for GitHub).\n`;
fs.writeFileSync(path.join(OUT, 'README.md'), md);

let cr = `# Credits for props\n\nThe Open to Stay props are converted from these models. CC-BY models need this credit in the work's credits. CC BY-SA: the converted splat is shared under the same licence.\n\n`;
for (const s of SPEC.filter(x => !x.reuse)) { const c = lic(s); cr += `- "${c.title || s.label}" by ${c.author} (${c.site}), ${c.lic}. ${c.url}\n`; }
fs.writeFileSync(path.join(OUT, 'CREDITS.md'), cr);
console.log('manifest props:', props.length);
