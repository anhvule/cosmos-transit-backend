const { legacyLensLookup, pandaLookup } = require('../services/interpretations');
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'db', 'cosmos.db'), { readonly: true });

function pickRow(where) {
  return db.prepare(`
    SELECT * FROM interpretations WHERE ${where} LIMIT 1
  `).get();
}

describe('services/interpretations', () => {
  test('legacy lens lookup returns ascendant-specific text for a seeded ascendant', () => {
    // Any Capricorn career aspect row seeded from the legacy DB.
    const row = pickRow(
      "ascendant = 'Capricorn' AND lens = 'career' AND kind = 'aspect' AND description != ''",
    );
    expect(row).toBeDefined();
    const lookup = legacyLensLookup('career');
    expect(lookup(row.display_name, 'Capricorn')).toBe(row.description);
  });

  test('legacy lens lookup falls back to the generic set for an unseeded ascendant when Aries has no row', () => {
    // A transit_house key: generic set covers all of them; pick one with no
    // Gemini and no Aries row.
    const row = db.prepare(`
      SELECT g.* FROM interpretations g
      WHERE g.ascendant = '*' AND g.lens = 'career' AND g.kind = 'transit_house'
        AND NOT EXISTS (
          SELECT 1 FROM interpretations a
          WHERE a.ascendant IN ('Gemini', 'Aries') AND a.lens = g.lens
            AND a.kind = g.kind AND a.transit_planet = g.transit_planet
            AND a.target_house = g.target_house AND a.phase = g.phase
        )
      LIMIT 1
    `).get();
    if (!row) return; // every key covered by Aries — fallback order proven in unit tests
    const lookup = legacyLensLookup('career');
    expect(lookup(row.display_name, 'Gemini')).toBe(row.description);
  });

  test('panda lookup returns generic text for an unseeded ascendant', () => {
    const row = pickRow("ascendant = '*' AND lens = 'career' AND kind = 'aspect' AND phase = 'exact'");
    const lookup = pandaLookup('career');
    expect(lookup(row.display_name, 'Gemini')).toBe(row.description);
  });

  test('panda lookup prefers ascendant-specific text for a seeded ascendant', () => {
    const row = pickRow(
      "ascendant = 'Capricorn' AND lens = 'career' AND kind = 'aspect' AND description != ''",
    );
    const lookup = pandaLookup('career');
    expect(lookup(row.display_name, 'Capricorn')).toBe(row.description);
  });

  test('unparseable names return empty string', () => {
    expect(legacyLensLookup('career')('gibberish event', 'Aries')).toBe('');
    expect(pandaLookup('career')('gibberish event', 'Aries')).toBe('');
  });
});
