// generate-icons.cjs
// Pure Node.js script (using built-in zlib) to render high-quality PNG icons for PWA
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function createPng(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // color type (RGBA)
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdr = createChunk('IHDR', ihdrData);

  // Raw image data with scanline filter byte (0)
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let srcOffset = 0;
  let dstOffset = 0;
  for (let y = 0; y < height; y++) {
    rawData[dstOffset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      rawData[dstOffset++] = rgbaBuffer[srcOffset++];
      rawData[dstOffset++] = rgbaBuffer[srcOffset++];
      rawData[dstOffset++] = rgbaBuffer[srcOffset++];
      rawData[dstOffset++] = rgbaBuffer[srcOffset++];
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressedData);
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crcTarget = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crcVal = crc32(crcTarget);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

// Render LumaBooth Icon to RGBA buffer
function renderIcon(size, isMaskable = false) {
  const buffer = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.44;
  const cornerRadius = isMaskable ? 0 : size * 0.22;

  // Colors
  const bgNavy = [9, 8, 23, 255]; // #090817
  const bgSurface = [18, 16, 42, 255];
  const purple = [139, 77, 255]; // #8B4DFF
  const magenta = [216, 60, 157]; // #D83C9D
  const pink = [232, 62, 122]; // #E83E7A
  const cyan = [0, 245, 212]; // #00F5D4
  const white = [255, 255, 255];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Check rounded box boundary if not maskable
      let insideBase = true;
      if (!isMaskable) {
        const dx = Math.max(Math.abs(x - cx) - (size / 2 - cornerRadius), 0);
        const dy = Math.max(Math.abs(y - cy) - (size / 2 - cornerRadius), 0);
        if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
          insideBase = false;
        }
      }

      if (!insideBase) {
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
        continue;
      }

      // Background Gradient (#12102A -> #090817)
      const gradT = (x + y) / (size * 2);
      let r = Math.round(bgSurface[0] * (1 - gradT) + bgNavy[0] * gradT);
      let g = Math.round(bgSurface[1] * (1 - gradT) + bgNavy[1] * gradT);
      let b = Math.round(bgSurface[2] * (1 - gradT) + bgNavy[2] * gradT);
      let a = 255;

      // Glow behind camera center
      const distToCenter = Math.hypot(x - cx, y - (cy + size * 0.03));
      if (distToCenter < size * 0.38) {
        const glowFactor = Math.pow(1 - distToCenter / (size * 0.38), 2) * 0.45;
        r = Math.min(255, Math.round(r + purple[0] * glowFactor));
        g = Math.min(255, Math.round(g + purple[1] * glowFactor));
        b = Math.min(255, Math.round(b + purple[2] * glowFactor));
      }

      // Normalized coordinates relative to center
      const nx = (x - cx) / size;
      const ny = (y - cy) / size;

      // Camera body rectangle: width 0.62, height 0.46, rounded 0.1
      const camW = 0.58;
      const camH = 0.44;
      const camR = 0.09;
      const cdx = Math.max(Math.abs(nx) - (camW / 2 - camR), 0);
      const cdy = Math.max(Math.abs(ny - 0.03) - (camH / 2 - camR), 0);
      const camDist = Math.hypot(cdx, cdy);

      const strokeW = 0.036;

      // Camera Top Notch / Prism
      const notchW = 0.18;
      const notchTop = -0.28;
      const inNotch = ny >= notchTop && ny <= -0.19 && Math.abs(nx) <= (notchW / 2 + (ny - notchTop) * 0.3);

      // Camera Body Stroke
      if (Math.abs(camDist - camR) < strokeW / 2 || inNotch) {
        const t = (nx + 0.3) / 0.6;
        const cr = Math.round(purple[0] * (1 - t) + pink[0] * t);
        const cg = Math.round(purple[1] * (1 - t) + pink[1] * t);
        const cb = Math.round(purple[2] * (1 - t) + pink[2] * t);
        r = cr;
        g = cg;
        b = cb;
      }

      // Camera Lens
      const lensDist = Math.hypot(nx, ny - 0.03);
      const outerLensR = 0.16;
      const innerLensR = 0.095;
      const pupilR = 0.048;

      if (lensDist < outerLensR) {
        if (Math.abs(lensDist - outerLensR) < strokeW / 2.2) {
          // Outer lens ring
          const t = (nx + 0.15) / 0.3;
          r = Math.round(purple[0] * (1 - t) + magenta[0] * t);
          g = Math.round(purple[1] * (1 - t) + magenta[1] * t);
          b = Math.round(purple[2] * (1 - t) + magenta[2] * t);
        } else if (Math.abs(lensDist - innerLensR) < 0.015) {
          // Inner glowing ring
          r = cyan[0];
          g = cyan[1];
          b = cyan[2];
        } else if (lensDist < pupilR) {
          // Pupil core
          const t = (nx + 0.05) / 0.1;
          r = Math.round(pink[0] * (1 - t) + purple[0] * t);
          g = Math.round(pink[1] * (1 - t) + purple[1] * t);
          b = Math.round(pink[2] * (1 - t) + purple[2] * t);
          
          // Glint highlight
          if (Math.hypot(nx - 0.015, (ny - 0.03) + 0.015) < 0.015) {
            r = white[0];
            g = white[1];
            b = white[2];
          }
        } else {
          // Dark lens interior
          r = 10;
          g = 8;
          b = 26;
        }
      }

      // Flash strobe dot
      if (Math.hypot(nx - 0.18, ny - (-0.11)) < 0.026) {
        r = cyan[0];
        g = cyan[1];
        b = cyan[2];
      }

      // Sparkle Star (top right)
      const sx = nx - 0.26;
      const sy = ny - (-0.26);
      if (Math.abs(sx) < 0.05 && Math.abs(sy) < 0.05) {
        if (Math.abs(sx * sy) < 0.0006) {
          r = pink[0];
          g = pink[1];
          b = pink[2];
        }
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  return buffer;
}

const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate 192x192
console.log('Generating icon-192x192.png...');
const buf192 = renderIcon(192, false);
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), createPng(192, 192, buf192));

// Generate 512x512
console.log('Generating icon-512x512.png...');
const buf512 = renderIcon(512, false);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), createPng(512, 512, buf512));

// Generate maskable 192x192
console.log('Generating icon-maskable-192x192.png...');
const bufMask192 = renderIcon(192, true);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192x192.png'), createPng(192, 192, bufMask192));

// Generate maskable 512x512
console.log('Generating icon-maskable-512x512.png...');
const bufMask512 = renderIcon(512, true);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), createPng(512, 512, bufMask512));

// Generate apple-touch-icon.png (180x180)
console.log('Generating apple-touch-icon.png...');
const bufApple = renderIcon(180, false);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), createPng(180, 180, bufApple));

console.log('All PWA icons generated successfully!');
