const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#ED0D51');
  gradient.addColorStop(1, '#FF3D71');
  
  // Draw rounded rectangle
  const radius = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw "Bob" text
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Adjust font size based on icon size
  const fontSize = size < 32 ? size * 0.5 : size * 0.38;
  ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('Bob', size / 2, size / 2 + (size * 0.03));
  
  return canvas.toBuffer('image/png');
}

const publicDir = path.join(__dirname, '..', 'public');

sizes.forEach(({ name, size }) => {
  const buffer = generateIcon(size);
  fs.writeFileSync(path.join(publicDir, name), buffer);
  console.log(`Generated ${name}`);
});

// Also create favicon.ico (just use 32x32 png renamed)
fs.copyFileSync(
  path.join(publicDir, 'favicon-32x32.png'),
  path.join(publicDir, 'favicon.ico')
);
console.log('Generated favicon.ico');
