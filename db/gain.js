const Database = require('better-sqlite3');
const path = require('path');
const { ensureEventsSchema } = require('./_events-schema');

const DB_PATH = path.join(__dirname, 'gain_events.db');

const db = new Database(DB_PATH);
ensureEventsSchema(db);

module.exports = db;
