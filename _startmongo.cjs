const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '.mongodb-data');
const logPath = path.join(dataDir, 'mongod-run.log');
const mongoBin = 'C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe';

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Remove any stale lock files
const lockFile = path.join(dataDir, 'mongod.lock');
if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);

console.log('Starting mongod...');
const child = spawn(mongoBin, [
  '--dbpath', dataDir,
  '--port', '27017',
  '--bind_ip', '127.0.0.1',
  '--logpath', logPath,
], { stdio: 'ignore' });

child.on('error', (err) => {
  console.error('Failed to spawn mongod:', err.message);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  console.log('mongod exited with code', code, 'signal', signal);
  process.exit(0);
});

// Poll for connection readiness
setTimeout(() => {
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://127.0.0.1:27017/consultpro', { family: 4, serverSelectionTimeoutMS: 3000 })
    .then(() => {
      console.log('SUCCESS: MongoDB connection established!');
      console.log('DB:', mongoose.connection.name);
      process.exit(0);
    })
    .catch((e) => {
      console.log('MongoDB not ready yet:', e.message);
      console.log('--- Latest log ---');
      const content = fs.readFileSync(logPath, 'utf8');
      console.log(content.slice(-2000));
      process.exit(1);
    });
}, 6000);
