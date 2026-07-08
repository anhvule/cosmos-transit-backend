// Single runtime connection to db/cosmos.db.
//
// Exposes:
//   - lookupInterpretation(lens, key, ascendantChain): the unified,
//     ascendant-aware lookup against the `interpretations` table.
//   - createInterpretationLookup(db): factory behind it (exported for tests).
//   - lookup(lens, key): legacy chart-agnostic lookup against
//     `event_templates` (kept for reference; no runtime callers after the
//     unified-interpretations refactor).
//
// This is the only runtime module that touches cosmos.db.

const Database = require('better-sqlite3');
const path = require('path');
const { ensureInterpretationsSchema } = require('./_interpretations-schema');

const DB_PATH = path.join(__dirname, 'cosmos.db');
const db = new Database(DB_PATH, { fileMustExist: true });
db.pragma('journal_mode = WAL');
ensureInterpretationsSchema(db);

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
 * Legacy chart-agnostic lookup against event_templates.
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

/**
 * Build a lookupInterpretation(lens, key, ascendantChain) function bound to
 * `database`. Walks the ascendant chain in order; within each ascendant the
 * phase-specific row wins, then the phase-agnostic ('window') row — mirroring
 * the legacy lookupEventWithFallback ordering (full name first, then the
 * phase-stripped base name, per ascendant). First non-empty description wins.
 */
function createInterpretationLookup(database) {
  const stmt = database.prepare(`
    SELECT description FROM interpretations
    WHERE ascendant = @ascendant
      AND lens = @lens
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

  return function lookupInterpretation(lens, key, ascendantChain) {
    if (!key) return '';
    const base = {
      lens,
      kind:           key.kind,
      transit_planet: key.transit_planet || '',
      natal_planet:   key.natal_planet   || '',
      target_house:   key.target_house   || 0,
      target_angle:   key.target_angle   || '',
      special_label:  key.special_label  || '',
      lord_house:     key.lord_house     || 0,
    };
    const keyPhase = key.phase || 'window';
    const phases = keyPhase === 'window' ? ['window'] : [keyPhase, 'window'];
    const seen = new Set();
    for (const ascendant of ascendantChain) {
      if (!ascendant || seen.has(ascendant)) continue;
      seen.add(ascendant);
      for (const phase of phases) {
        const row = stmt.get({ ...base, ascendant, phase });
        if (row && row.description) return row.description;
      }
    }
    return '';
  };
}

const lookupInterpretation = createInterpretationLookup(db);

module.exports = { lookup, lookupInterpretation, createInterpretationLookup, db };
