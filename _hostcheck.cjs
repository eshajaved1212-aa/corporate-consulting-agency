const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'server', '.env');
const content = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
for (const line of content.split(/\r?\n/)) {
  const m = line.match(/^MONGO_URI\s*=\s*(.*)$/);
  if (m) {
    const val = m[1].replace(/^["']|["']$/g, '').trim();
    if (val.startsWith('mongodb+srv://')) {
      const rest = val.slice('mongodb+srv://'.length);
      const atIdx = rest.indexOf('@');
      const slashIdx = rest.indexOf('/');
      const hostPart = atIdx > -1 ? rest.slice(atIdx + 1, slashIdx > -1 ? slashIdx : undefined) : rest;
      console.log('MONGO_URI -> MongoDB Atlas cluster host:', hostPart);
      console.log('Action needed: whitelist your current IP in Atlas Network Access, or use a local MongoDB.');
    } else if (val.startsWith('mongodb://')) {
      const rest = val.slice('mongodb://'.length);
      const atIdx = rest.indexOf('@');
      const hostPart = atIdx > -1 ? rest.slice(atIdx + 1) : rest;
      console.log('MONGO_URI -> Local MongoDB:', hostPart);
    } else {
      console.log('MONGO_URI -> unrecognized format.');
    }
  }
}

