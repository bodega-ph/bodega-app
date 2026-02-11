const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, '..', 'public', 'auth-hero.png');

console.log('Checking:', imagePath);

if (fs.existsSync(imagePath)) {
  const stats = fs.statSync(imagePath);
  console.log('✅ File exists!');
  console.log('Size:', stats.size, 'bytes');
  console.log('Modified:', stats.mtime);
} else {
  console.log('❌ File NOT found');
  console.log('\nFiles in public directory:');
  const publicDir = path.join(__dirname, '..', 'public');
  const files = fs.readdirSync(publicDir);
  files.forEach(file => console.log('  -', file));
}
