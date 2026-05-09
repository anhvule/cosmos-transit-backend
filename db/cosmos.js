// Read-only handle for db/cosmos.db (the new structured-template DB).
// Exposes a single lookup() that takes a (lens, structured-key) and returns
// the row's description, or '' if no match.
//
// This is intentionally separate from the legacy db/career.js etc. — those
// keep serving the old /api/career endpoint while /api/panda/* routes use
// this module against the new schema.

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'cosmos.db');
const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });

const lookupStmt = db.prepare(`
  SELECT description FROM event_templates
  WHERE lens = @lens
    AND kind = @kind
    AND transit_planet = @transit_planet
    AND natal_planet = @natal_planet
    AND target_house = @target_house
    AND target_angle = @target_angle
    AND special_label = @special_label
    AND lord_house = @lord_house
    AND phase = @phase
  LIMIT 1
`);

/**
 * Look up the description for a structured event key.
 * Returns '' if no row matches; never throws.
 */
function lookup(lens, key) {
  if (!key) return '';
  const row = lookupStmt.get({
    lens,
    kind:           key.kind,
    transit_planet: key.transit_planet || '',
    natal_planet:   key.natal_planet   || '',
    target_house:   key.target_house   || 0,
    target_angle:   key.target_angle   || '',
    special_label:  key.special_label  || '',
    lord_house:     key.lord_house     || 0,
    phase:          key.phase          || 'window',
  });
  return row ? row.description : '';
}

module.exports = { lookup, db };
