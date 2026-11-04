// The shaders of the Switch build's renderer (Renut on deko3d), made from the player's own game files: deko3d_glsl.bin,
// which the NRO reads beside itself (the NRO carries only the 4 shaders the game makes at run time). katamari-nx-installer's
// lib/deko3d.js, with Hexic 2's set.
//
// The chain is hexic2-nx's native one (Renut's XenosRecomp with the early alpha copies of tools/renut_early_alpha.py
// and BANJO_DEKO3D_SPIRV_DIR, tools/deko3d_shaders.py, tools/deko3d_glsl_opt.py, tools/deko3d_shader_package.py:
// tools/switch_shaders.ps1), in the page:
//   lib/installer.js   gameContainers(): the 13 containers stored in default.xex (lib/shaders.js)
//   wasm/renut_hlsl    Renut's translator (hexic2-nx's tools/renut_hlsl_frontend.cpp, peggle2-nx's): container -> HLSL
//   lib/early_alpha    tools/renut_early_alpha.py (banjo-nx's banjo_gpu_early_alpha): the alpha-tested pixel shaders'
//                      early alpha copy
//   wasm/dxc_web       DXC v2025.1 with the native renderer's fixed arguments; Renut's -DBANJO_DEKO3D -DRENUT_RECOMP
//                      come first in the text as #define lines, and the y flip it adds to a vertex shader
//                      (-fvk-invert-y; deko3d takes D3D's clip space as it is) is taken out of the GLSL below
//   wasm/spirv_cross   SPIRV-Cross with tools/deko3d_shaders.py's arguments
//   lib/deko3d_glsl    tools/deko3d_glsl.py's conversion and tools/deko3d_glsl_opt.py's passes
//   lib/deko3d_package the package (zstd frames of raw blocks, no dictionary)
// Checked against hexic2-nx's native chain (test/deko3d_node.mjs): all 195 shaders' GLSL after the conversion and the
// passes is the native chain's once SPIR-V's value numbers are renamed (the page's DXC, v2025.1, is newer than the
// translator's own, and numbers them differently in 72 of them): the same shaders. The package is the one the NRO was
// tested with, pinned by its SHA-256 in the build's manifest entry.

import { deko3dShader } from './deko3d_glsl.js';
import { writeDeko3dPackage } from './deko3d_package.js';
import { renutEarlyAlpha } from './early_alpha.js';

const DXC_PREAMBLE = '#define BANJO_DEKO3D 1\n#define RENUT_RECOMP 1\n';

// DXC's -fvk-invert-y, as SPIRV-Cross writes it: the position copied, its y negated, the copy stored. Back to the
// position stored as it is (what the native chain, compiled without the flag, writes).
export function undoInvertY(glsl) {
  const re = /^([ \t]*)vec4 (_\d+) = (_\d+);\n[ \t]*\2\.y = -\3\.y;\n[ \t]*gl_Position = \2;$/m;
  const m = re.exec(glsl);
  if (!m) {
    throw new Error('deko3d: the vertex shader has no y flip where DXC puts it');
  }
  return glsl.slice(0, m.index) + `${m[1]}gl_Position = ${m[3]};` + glsl.slice(m.index + m[0].length);
}

// The translator's HLSL of every container: Map name ('ps_<16 upper-case hex>') -> { hlsl, container } (container:
// the index in `containers` of its source). One container a run: the translator names its output by the container's
// XXH3, the shaders' names.
export function translateContainers(containers, renutHlsl, shaderCommon) {
  renutHlsl.FS.writeFile('/shader_common.h', shaderCommon);
  const out = new Map();
  containers.forEach((c, i) => {
    renutHlsl.FS.mkdirTree(`/deko3d_in/${i}`);
    renutHlsl.FS.writeFile(`/deko3d_in/${i}/${c.stage}.bin`, c.bytes);
    const rc = renutHlsl.callMain([`/deko3d_in/${i}`, `/deko3d_out/${i}`, '/shader_common.h']);
    if (rc !== 0 && rc !== undefined) {
      throw new Error(`deko3d: the translator failed on container ${i} (${rc})`);
    }
    for (const n of renutHlsl.FS.readdir(`/deko3d_out/${i}`).filter((f) => f.endsWith('.hlsl'))) {
      const name = n.slice(0, -5).replace(/^(vs|ps)_([0-9a-fA-F]{16})$/, (_, s, h) => `${s}_${h.toUpperCase()}`);
      out.set(name, { hlsl: renutHlsl.FS.readFile(`/deko3d_out/${i}/${n}`, { encoding: 'utf8' }), container: i });
    }
  });
  return out;
}

// containers: [{ stage, bytes }] (lib/installer.js gameContainers()); names: the
// shaders the build's entry lists (every one must come out of the translator; null: every translated one); modules: { renutHlsl, dxc, spirvCross }
// instantiated Emscripten modules (fresh ones: the translator wants an empty output folder); shaderCommon: Renut's
// shader_common.h (hexic2-nx's app/thirdparty/reblue-XenosRecomp/XenosRecomp/).
// Returns { package, shaders: [{ name, glsl, container, earlyAlpha }] }.
export async function buildDeko3dPackage(containers, names, modules, shaderCommon, log = () => {}) {
  const { renutHlsl, dxc, spirvCross } = modules;
  const translated = translateContainers(containers, renutHlsl, shaderCommon);
  names = names ?? [...translated.keys()].sort();
  const missing = names.filter((n) => !translated.has(n));
  if (missing.length) {
    throw new Error(`deko3d: ${missing.join(', ')} not among the translated shaders`);
  }
  dxc.FS.mkdirTree('/deko3d');
  spirvCross.FS.mkdirTree('/deko3d');
  const shaders = [];
  for (const name of names) {
    const vertex = name.startsWith('vs_');
    let { hlsl } = translated.get(name);
    let earlyAlpha = null;
    if (!vertex) {
      const ea = renutEarlyAlpha(name.toLowerCase(), hlsl);
      hlsl = ea.hlsl;
      earlyAlpha = ea.status;
    }
    dxc.FS.writeFile(`/deko3d/${name}.hlsl`, DXC_PREAMBLE + hlsl);
    const crc = dxc.ccall('compile', 'number', ['string', 'string', 'number'],
                          [`/deko3d/${name}.hlsl`, `/deko3d/${name}.spv`, vertex ? 1 : 0]);
    if (crc !== 0) {
      throw new Error(`deko3d: DXC rejected ${name} (${crc})`);
    }
    spirvCross.FS.writeFile(`/deko3d/${name}.spv`, dxc.FS.readFile(`/deko3d/${name}.spv`));
    const xrc = spirvCross.callMain([`/deko3d/${name}.spv`, '--version', '460', '--vulkan-semantics',
                                     '--relax-nan-checks', '--output', `/deko3d/${name}.vk.glsl`]);
    if (xrc !== 0 && xrc !== undefined) {
      throw new Error(`deko3d: SPIRV-Cross rejected ${name} (${xrc})`);
    }
    let vk = spirvCross.FS.readFile(`/deko3d/${name}.vk.glsl`, { encoding: 'utf8' });
    if (vertex) {
      vk = undoInvertY(vk);
    }
    const glsl = deko3dShader(name, vk).opt;  // tools/deko3d_shaders.py + tools/deko3d_glsl_opt.py
    shaders.push({ name, glsl, container: translated.get(name).container, earlyAlpha });
    log(`deko3d: ${name}`);
  }
  return { package: writeDeko3dPackage(shaders), shaders };
}
