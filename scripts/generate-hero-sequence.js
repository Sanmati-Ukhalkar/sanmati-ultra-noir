import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '../public/assets/hero-sequence');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Generating 60 frame sequence assets in ${outputDir}...`);

// Generate 60 SVG frame sequence files that can be loaded as frame images
for (let i = 0; i < 60; i++) {
  const paddedIndex = String(i).padStart(3, '0');
  const filePath = path.join(outputDir, `frame_${paddedIndex}.webp`);

  const progress = i / 59;
  const angle = progress * Math.PI * 2;
  const radius = 180 + Math.sin(angle * 3) * 20;

  const nodeCount = 12;
  let nodesSvg = '';
  for (let n = 0; n < nodeCount; n++) {
    const na = (n / nodeCount) * Math.PI * 2 + angle * 0.5;
    const nx = 400 + Math.cos(na) * radius;
    const ny = 300 + Math.sin(na) * radius;
    const color = n % 2 === 0 ? '#FF6B4A' : '#F2B134';
    nodesSvg += `<circle cx="${nx}" cy="${ny}" r="8" fill="${color}" opacity="0.9"/>`;
    nodesSvg += `<circle cx="${nx}" cy="${ny}" r="18" fill="${color}" opacity="0.2"/>`;
  }

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="#FAF5EE"/>
        <stop offset="70%" stop-color="#F2E6D5"/>
        <stop offset="100%" stop-color="#E8D7C0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bg)"/>
    <g stroke="rgba(255, 107, 74, 0.2)" stroke-width="1.5">
      <circle cx="400" cy="300" r="${radius}" fill="none"/>
      <circle cx="400" cy="300" r="${radius * 0.7}" fill="none" stroke-dasharray="8 6"/>
    </g>
    ${nodesSvg}
    <text x="400" y="305" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" fill="#101820" text-anchor="middle" opacity="0.85">
      AI NEURAL PIPELINE [FRAME ${paddedIndex}/059]
    </text>
  </svg>`;

  // Write SVG or data-uri webp sequence frame
  fs.writeFileSync(filePath, svgContent);
}

console.log('Frame sequence generation complete!');
