const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 1. Read ADMIN_TOKEN from server/.env
const envFile = path.join(__dirname, 'server', '.env');
const content = fs.readFileSync(envFile, 'utf8').replace(/^\uFEFF/, '');
let adminToken = '(not set)';
let mongoURI = '(not set)';
let port = '5000';
for (const line of content.split(/\r?\n/)) {
  let m = line.match(/^ADMIN_TOKEN\s*=\s*(.*)$/);
  if (m) adminToken = m[1].trim().replace(/^["']|["']$/g, '');
  m = line.match(/^MONGO_URI\s*=\s*(.*)$/);
  if (m) mongoURI = m[1].trim().replace(/^["']|["']$/g, '');
  m = line.match(/^PORT\s*=\s*(.*)$/);
  if (m) port = m[1].trim();
}

console.log('=== Admin Dashboard Run Check ===');
console.log('PORT       :', port);
console.log('MONGO_URI  :', mongoURI);
console.log('ADMIN_TOKEN:', adminToken === '(not set)' ? '(not set!)' : '(set) ' + adminToken);

// 2. Test MongoDB connection
console.log('\nTesting MongoDB connection...');
mongoose.connect(mongoURI, { family: 4, serverSelectionTimeoutMS: 4000 })
  .then(() => {
    console.log('MongoDB connected:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((e) => {
    console.log('MongoDB connection FAILED:', e.message);
    if (e.message.includes('ECONNREFUSED')) {
      console.log('   Local MongoDB not running. Start it with: mongod');
    }
    process.exit(1);
  });
