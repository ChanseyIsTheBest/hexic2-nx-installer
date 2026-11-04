// Writes the build's entry of release/manifest.json for a release of hexic2-nx: the NRO's SHA-256 and size, and the
// fingerprints of the game and of the shaders made from your copy with the page's own code ("deko3d": the shaders, their
// containers, the package's SHA-256). Test the NRO with exactly the deko3d_glsl.bin this leaves in release/.
// Usage: node test/release_node.mjs <game package or folder> <title update package or folder> <hexic2-nx.nro> <hexic_shader_files.json> [--version <x.y.z>] [--write]
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { chosenOnDisk, loadModules, root } from './node_files.mjs';
import { findGame, gameContainers, identifyGame } from '../lib/installer.js';
import { buildDeko3dPackage } from '../lib/deko3d.js';

const args = process.argv.slice(2);
const take = (flag) => {
  const at = args.indexOf(flag);
  return at >= 0 ? args.splice(at, 2)[1] : null;
};
const has = (flag) => {
  const at = args.indexOf(flag);
  return at >= 0 ? (args.splice(at, 1), true) : false;
};
const version = take('--version') || '1.0.0';
const write = has('--write');
const [input, updateInput, nroPath, placesPath] = args;
if (!input || !updateInput || !nroPath || !placesPath) {
  console.error('usage: node test/release_node.mjs <game package or folder> <title update package or folder> <hexic2-nx.nro> <hexic_shader_files.json> [--version <x.y.z>] [--write]');
  process.exit(1);
}
const sha = (b) => createHash('sha256').update(b).digest('hex');

const chosen = await findGame(chosenOnDisk([input, updateInput]));
const { game, update } = chosen;
if (!game || !update) {
  throw new Error(`no game or title update in ${input}, ${updateInput}`);
}
const modules = await loadModules();
const { xex, xexHash, xexp, xexpHash } = await identifyGame(chosen, { builds: [] });
// The game's tools/hexic_shader_files.py says where each shader is.
const places = JSON.parse(fs.readFileSync(placesPath, 'utf8'));
const list = { image_sha256: places.image_sha256, files: places.files, split: places.split };
const containers = await gameContainers(game.files, xex, xexp, list, modules);
const common = fs.readFileSync(path.join(root, 'renut_shader_common.h'));
const { package: pkg, shaders } = await buildDeko3dPackage(containers, null, modules, common);
const nro = fs.readFileSync(nroPath);
const build = {
  edition: 'Xbox Live Arcade (title 58410826) with Title Update 1',
  version,
  xex_sha256: xexHash,
  nro: 'hexic2-nx.nro',
  nro_sha256: sha(nro),
  nro_size: nro.length,
  game_files: game.files.length,
  game_bytes: game.files.reduce((sum, f) => sum + f.size, 0),
  update: {
    xexp_sha256: xexpHash,
    files: update.files.length,
    bytes: update.files.reduce((sum, f) => sum + f.size, 0),
  },
  deko3d: {
    shaders: shaders.map((s) => s.name),
    image_sha256: list.image_sha256,
    files: list.files,
    split: list.split,
    package_sha256: sha(pkg),
    package_size: pkg.length,
  },
};
console.log(`${build.edition} ${version}: NRO ${build.nro_sha256} (${build.nro_size} bytes)`);
console.log(`game: ${build.game_files} files, ${build.game_bytes} bytes; default.xex ${xexHash}`);
console.log(`title update: ${build.update.files} files, ${build.update.bytes} bytes; default.xexp ${xexpHash}`);
console.log(`shaders: ${shaders.length}, package ${build.deko3d.package_sha256} (${pkg.length} bytes)`);
if (write) {
  const manifestPath = path.join(root, 'release/manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ version: 1, builds: [build] }, null, 2) + '\n');
  fs.copyFileSync(nroPath, path.join(root, 'release', build.nro));
  fs.writeFileSync(path.join(root, 'release', 'deko3d_glsl.bin'), pkg);
  console.log('written: release/manifest.json; the NRO and deko3d_glsl.bin to release/ for local tests (neither is ' +
    'committed)');
} else {
  console.log('(dry run: add --write to save)');
}
