const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'duality_events.db');

const db = new Database(DB_PATH);

// Schema diverges slightly from the events(name, description) pattern used
// by the other lookup DBs because Duality rows are keyed by the
// (essence_number, personal_year) pair — not a single string label — and
// also carry a derived duality_number for downstream filtering.
db.exec(`
  CREATE TABLE IF NOT EXISTS dualities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    essence_number INTEGER NOT NULL,
    personal_year INTEGER NOT NULL,
    duality_number INTEGER NOT NULL,
    keyword TEXT NOT NULL,
    duality_explaination TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (essence_number, personal_year)
  )
`);

module.exports = db;
