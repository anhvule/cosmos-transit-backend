// Shared schema + lazy migration for the per-category events tables.
//
// The events table started life as `(id, name UNIQUE, description, created_at)`
// — a single global interpretation per event name, written for an Aries
// ascendant native. To support per-ascendant interpretations without breaking
// existing API behavior, we add an `ascendant` column and key uniqueness on
// (ascendant, name). Existing rows are migrated to ascendant='Aries'.
//
// The migration runs idempotently every time the schema file is required,
// so a stale DB picks up the new shape on the next process boot.

function ensureEventsSchema(db) {
  // Fresh-DB path: creates the new shape directly.
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ascendant TEXT NOT NULL DEFAULT 'Aries',
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (ascendant, name)
    )
  `);

  // Existing-DB path: detect old schema (no `ascendant` column) and rebuild.
  const cols = db.prepare("PRAGMA table_info(events)").all();
  const hasAscendant = cols.some(c => c.name === 'ascendant');
  if (hasAscendant) return;

  db.exec(`
    BEGIN TRANSACTION;
    ALTER TABLE events RENAME TO events_old;
    CREATE TABLE events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ascendant TEXT NOT NULL DEFAULT 'Aries',
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (ascendant, name)
    );
    INSERT INTO events (id, ascendant, name, description, created_at)
      SELECT id, 'Aries', name, description, created_at FROM events_old;
    DROP TABLE events_old;
    COMMIT;
  `);
}

module.exports = { ensureEventsSchema };
