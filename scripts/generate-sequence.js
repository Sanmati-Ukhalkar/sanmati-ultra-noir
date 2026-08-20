import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse CLI flags (e.g. --type=avatar --frameCount=45)
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value || true;
  return acc;
}, {});

const type = args.type || 'avatar';
const frameCount = parseInt(args.frameCount, 10) || 45;
const outputDir = path.join(__dirname, `../public/assets/${type}-sequence`);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Generating ${frameCount} frames for sequence "${type}" in ${outputDir}...`);

for (let i = 0; i < frameCount; i++) {
  const paddedIndex = String(i).padStart(3, '0');
  const filePath = path.join(outputDir, `frame_${paddedIndex}.webp`);
  const progress = i / (frameCount - 1);

  let svgContent = '';

  if (type === 'avatar') {
    // Generate avatar pose sequence covering: wave -> think -> code/build -> point -> celebrate -> wave-goodbye
    const angle = progress * Math.PI * 2;
    const armLeftY = 300 + Math.sin(angle * 2) * 40;
    const armRightY = 300 - Math.cos(angle * 2) * 40;
    const headRot = Math.sin(angle) * 8;

    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <defs>
        <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FF6B4A" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#FF6B4A" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#avatarGlow)"/>
      <g transform="rotate(${headRot} 200 180)">
        <!-- Head -->
        <rect x="140" y="110" width="120" height="140" rx="30" fill="#101820"/>
        <!-- Glasses -->
        <rect x="150" y="150" width="40" height="25" rx="6" fill="none" stroke="#F2B134" stroke-width="4"/>
        <rect x="210" y="150" width="40" height="25" rx="6" fill="none" stroke="#F2B134" stroke-width="4"/>
        <line x1="190" y1="162" x2="210" y2="162" stroke="#F2B134" stroke-width="4"/>
        <!-- Smile -->
        <path d="M 175 210 Q 200 225 225 210" fill="none" stroke="#FAF5EE" stroke-width="4" stroke-linecap="round"/>
      </g>
      <!-- Body -->
      <path d="M 120 450 Q 200 270 280 450 Z" fill="#FF6B4A"/>
      <!-- Arms -->
      <line x1="130" y1="320" x2="70" y2="${armLeftY}" stroke="#101820" stroke-width="16" stroke-linecap="round"/>
      <line x1="270" y1="320" x2="330" y2="${armRightY}" stroke="#101820" stroke-width="16" stroke-linecap="round"/>
      <text x="200" y="470" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" fill="#101820" text-anchor="middle">
        AVATAR POSING [FRAME ${paddedIndex}/${String(frameCount - 1).padStart(3, '0')}]
      </text>
    </svg>`;
  } else if (type === 'pipeline') {
    // Generate ETL pipeline packet flow sequence
    const packetX = 50 + progress * 700;
    const waveY = 150 + Math.sin(progress * Math.PI * 4) * 30;

    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" viewBox="0 0 800 300">
      <rect width="800" height="300" rx="16" fill="#101820" opacity="0.95"/>
      <path d="M 50 150 Q 250 80 400 150 T 750 150" fill="none" stroke="#334155" stroke-width="4" stroke-dasharray="8 6"/>
      <path d="M 50 150 Q 250 80 400 150 T 750 150" fill="none" stroke="#FF6B4A" stroke-width="3" opacity="0.6"/>
      <!-- Travelling Data Packet -->
      <circle cx="${packetX}" cy="${waveY}" r="14" fill="#FF6B4A"/>
      <circle cx="${packetX}" cy="${waveY}" r="26" fill="#FF6B4A" opacity="0.3"/>
      <circle cx="${packetX}" cy="${waveY}" r="6" fill="#FAF5EE"/>
      <text x="400" y="260" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" fill="#FAF5EE" text-anchor="middle" opacity="0.8">
        ETL DATA FLOW STREAM [FRAME ${paddedIndex}/${String(frameCount - 1).padStart(3, '0')}]
      </text>
    </svg>`;
  } else {
    // Default hero frame
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#FAF5EE"/>
      <circle cx="400" cy="300" r="${150 + progress * 50}" fill="none" stroke="#FF6B4A" stroke-width="2"/>
    </svg>`;
  }

  fs.writeFileSync(filePath, svgContent);
}

console.log(`Successfully generated ${frameCount} frames for sequence "${type}"!`);
