// Makes deko3d_glsl.bin from the game (package or folder) in Node, with the page's code (lib/deko3d.js). With hexic2-nx's
// native GLSL (out/deko3d_shaders/glsl_opt) it also compares the shaders text for text.
// Usage: node test/deko3d_node.mjs <game package or folder> <title update package or folder> [<native glsl_opt folder>] [--out <file>] [--image <the patched image to compare>]
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { chosenOnDisk, loadModules, root } from './node_files.mjs';
import { findGame, gameContainers, identifyGame, patchedImage } from '../lib/installer.js';
import { buildDeko3dPackage } from '../lib/deko3d.js';

const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
const out = outAt >= 0 ? args.splice(outAt, 2)[1] : null;
const placesAt = args.indexOf('--places');
const placesPath = placesAt >= 0 ? args.splice(placesAt, 2)[1] : null;
const imageAt = args.indexOf('--image');
const imageRef = imageAt >= 0 ? args.splice(imageAt, 2)[1] : null;
const [input, updateInput, reference] = args;
if (!input || !updateInput) {
  console.error('usage: node test/deko3d_node.mjs <game package or folder> <title update package or folder> [<native glsl_opt folder>] [--places <hexic_shader_files.json>] [--out <file>] [--image <file>]');
  process.exit(1);
}
const sha = (b) => createHash('sha256').update(b).digest('hex');
const started = Date.now();

const chosen = await findGame(chosenOnDisk([input, updateInput]));
if (!chosen.game || !chosen.update) {
  throw new Error(`no game or title update in ${input}, ${updateInput}`);
}
const modules = await loadModules();
const { xex, xexHash, xexp, xexpHash } = await identifyGame(chosen, { builds: [] });
console.log(`default.xex SHA-256 ${xexHash}, default.xexp ${xexpHash}`);
const image = await patchedImage(xex, xexp, modules);
console.log(`patched image: ${image.length} bytes, SHA-256 ${sha(image)}`);
if (imageRef) {
  const same = Buffer.compare(Buffer.from(image), fs.readFileSync(imageRef)) === 0;
  console.log(`patched image ${same ? 'identical to' : 'DIFFERENT from'} ${imageRef}`);
}
const list = placesPath
  ? JSON.parse(fs.readFileSync(placesPath, 'utf8'))
  : JSON.parse(fs.readFileSync(path.join(root, 'release/manifest.json'), 'utf8')).builds[0].deko3d;
const containers = await gameContainers(chosen.game.files, xex, xexp, list, modules);
console.log(`${containers.length} containers (${list.image_sha256.length} in the executable, ${(list.files ?? []).length} in files, ${(list.split ?? []).length} split)`);

const common = fs.readFileSync(path.join(root, 'renut_shader_common.h'));
const { package: pkg, shaders } = await buildDeko3dPackage(containers, null, modules, common);
console.log(`${shaders.length} shaders, package ${pkg.length} bytes, SHA-256 ${sha(pkg)} (${Date.now() - started} ms)`);
if (out) {
  fs.writeFileSync(out, pkg);
}

if (reference) {
  let same = 0;
  const different = [];
  for (const s of shaders) {
    const file = path.join(reference, `${s.name}.glsl`);
    if (!fs.existsSync(file)) {
      different.push(`${s.name} (no native file)`);
    } else if (fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n') === s.glsl) {
      same++;
    } else {
      different.push(s.name);
    }
  }
  console.log(`${same} of ${shaders.length} shaders' GLSL identical to the native chain's`);
  if (different.length) {
    console.log(`different: ${different.join(' ')}`);
  }
  const debug = process.env.DEKO3D_DEBUG_DIR;
  if (debug) {
    fs.mkdirSync(debug, { recursive: true });
    for (const s of shaders) {
      fs.writeFileSync(path.join(debug, `${s.name}.glsl`), s.glsl);
    }
  }
}
