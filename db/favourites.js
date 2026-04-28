const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'favourites.db');

const db = new Database(DB_PATH);

// Per-user transit-date bookmarks. user_key is an opaque client-generated
// device identifier (no auth) — it scopes a row to the device that wrote it
// so list/delete are isolated. transit_date is stored as YYYY-MM-DD.
db.exec(`
  CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_key TEXT NOT NULL,
    transit_date TEXT NOT NULL,
    title TEXT,
    description TEXT NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_favourites_user_key
    ON favourites(user_key);
`);

module.exports = db;
