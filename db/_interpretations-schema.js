// Schema for the unified `interpretations` table in db/cosmos.db —
// the ascendant-aware, sparse successor to both the legacy per-lens
// `events` tables and the chart-agnostic `event_templates` table.
// Shared by scripts/seed.js and db/cosmos.js (ensure-on-open).

const CREATE_SQL = `
  CREATE TABLE IF NOT EXISTS interpretations (
    id             INTEGER PRIMARY KEY,
    ascendant      TEXT NOT NULL,
    lens           TEXT NOT NULL,
    kind           TEXT NOT NULL,
    transit_planet TEXT NOT NULL DEFAULT '',
    natal_planet   TEXT NOT NULL DEFAULT '',
    target_house   INTEGER NOT NULL DEFAULT 0,
    target_angle   TEXT NOT NULL DEFAULT '',
    special_label  TEXT NOT NULL DEFAULT '',
    lord_house     INTEGER NOT NULL DEFAULT 0,
    phase          TEXT NOT NULL DEFAULT 'window',
    display_name   TEXT NOT NULL,
    description    TEXT NOT NULL,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ascendant, lens, kind, transit_planet, natal_planet,
            target_house, target_angle, special_label, lord_house, phase)
  )
`;

const INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_interp_lookup
    ON interpretations(lens, ascendant, kind, transit_planet, natal_planet, phase)
`;

function ensureInterpretationsSchema(db) {
  db.exec(CREATE_SQL);
  db.exec(INDEX_SQL);
}

module.exports = { ensureInterpretationsSchema };
