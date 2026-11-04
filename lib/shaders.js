// The Direct3D shader containers stored in default.xex.

function be32(data, offset) {
  return ((data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
}

export async function sha256(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// The containers of an executable image: aligned to 4 bytes, signature 0x102A1101 (vertex) or 0x102A1100 (pixel), then
// the sizes of the header and of the microcode. Candidates only: the build's entry lists the real ones by SHA-256.
export function imageContainers(image) {
  const found = [];
  for (let off = 0; off < image.length - 12; off += 4) {
    const magic = be32(image, off);
    if (magic !== 0x102a1101 && magic !== 0x102a1100) {
      continue;
    }
    const header = be32(image, off + 4);
    const ucode = be32(image, off + 8);
    if (header < 12 || header > 1 << 16 || ucode === 0 || ucode > 1 << 20 || ucode % 4) {
      continue;
    }
    if (off + header + ucode > image.length) {
      continue;
    }
    found.push({ stage: magic === 0x102a1101 ? 'vs' : 'ps', bytes: image.slice(off, off + header + ucode) });
  }
  return found;
}
