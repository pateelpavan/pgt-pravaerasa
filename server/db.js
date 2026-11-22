const fs = require('fs');
const path = require('path');

const isVercel = Boolean(process.env.VERCEL);
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Directory might be read-only or already exist
}

// On Vercel serverless environment, copy packaged initial db to /tmp
if (isVercel) {
  try {
    const packagedDb = path.join(__dirname, 'data', 'db.json');
    if (!fs.existsSync(DB_FILE) && fs.existsSync(packagedDb)) {
      fs.copyFileSync(packagedDb, DB_FILE);
    }
  } catch (e) {
    console.warn('Could not copy packaged db to /tmp:', e.message);
  }
}

function getInitialData() {
  return {
    users: [],
    projects: [],
    meetings: [],
    payments: [],
    installments: [],
    contacts: []
  };
}

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    if (!content.trim()) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file, recovering with clean state:', err);
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function writeDb(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing to database file:', err);
    throw err;
  }
}

// Initialize clean empty database if file does not exist
if (!fs.existsSync(DB_FILE)) {
  writeDb(getInitialData());
}

module.exports = {
  readDb,
  writeDb,
  getInitialData
};
