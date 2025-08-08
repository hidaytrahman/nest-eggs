const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../src/data/users.db.json');
const destDir = path.join(__dirname, '../dist/data');
const dest = path.join(destDir, 'users.db.json');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}
fs.copyFileSync(src, dest);
console.log('users.db.json copied to dist/data/');
