const Database = require('better-sqlite3');
const { ensureInterpretationsSchema } = require('../db/_interpretations-schema');
const { createInterpretationLookup } = require('../db/cosmos');

function makeDb(rows) {
  const db = new Database(':memory:');
  ensureInterpretationsSchema(db);
  const ins = db.prepare(`
    INSERT INTO interpretations
      (ascendant, lens, kind, transit_planet, natal_planet, target_house,
       target_angle, special_label, lord_house, phase, display_name, description)
    VALUES (@ascendant, @lens, @kind, @transit_planet, @natal_planet,
            @target_house, @target_angle, @special_label, @lord_house,
            @phase, @display_name, @description)
  `);
  for (const r of rows) {
    ins.run({
      lens: 'career', kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus',
      target_house: 0, target_angle: '', special_label: '', lord_house: 0,
      display_name: 'Mars aspect Venus', ...r,
    });
  }
  return db;
}

const KEY = { kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus', phase: 'exact' };

describe('lookupInterpretation fallback chain', () => {
  test('resolution order: asc phase → asc window → Aries phase → Aries window → * phase → * window', () => {
    const rows = [
      { ascendant: 'Taurus', phase: 'exact',  description: 'T-exact' },
      { ascendant: 'Taurus', phase: 'window', description: 'T-window' },
      { ascendant: 'Aries',  phase: 'exact',  description: 'A-exact' },
      { ascendant: 'Aries',  phase: 'window', description: 'A-window' },
      { ascendant: '*',      phase: 'exact',  description: 'G-exact' },
      { ascendant: '*',      phase: 'window', description: 'G-window' },
    ];
    const expectedOrder = ['T-exact', 'T-window', 'A-exact', 'A-window', 'G-exact', 'G-window'];
    for (let drop = 0; drop <= rows.length; drop++) {
      const db = makeDb(rows.slice(drop));
      const lookup = createInterpretationLookup(db);
      const expected = drop < expectedOrder.length ? expectedOrder[drop] : '';
      expect(lookup('career', KEY, ['Taurus', 'Aries', '*'])).toBe(expected);
      db.close();
    }
  });

  test('window-phase key does not double-query', () => {
    const db = makeDb([{ ascendant: '*', phase: 'window', description: 'G-window' }]);
    const lookup = createInterpretationLookup(db);
    expect(lookup('career', { ...KEY, phase: 'window' }, ['Gemini', '*'])).toBe('G-window');
    db.close();
  });

  test('panda chain skips Aries', () => {
    const db = makeDb([
      { ascendant: 'Aries', phase: 'exact', description: 'A-exact' },
      { ascendant: '*',     phase: 'exact', description: 'G-exact' },
    ]);
    const lookup = createInterpretationLookup(db);
    expect(lookup('career', KEY, ['Gemini', '*'])).toBe('G-exact');
    db.close();
  });

  test('empty-description rows fall through', () => {
    const db = makeDb([
      { ascendant: 'Taurus', phase: 'exact', description: '' },
      { ascendant: '*',      phase: 'exact', description: 'G-exact' },
    ]);
    const lookup = createInterpretationLookup(db);
    expect(lookup('career', KEY, ['Taurus', 'Aries', '*'])).toBe('G-exact');
    db.close();
  });

  test('duplicate ascendants in chain are queried once (Aries chart, legacy chain)', () => {
    const db = makeDb([{ ascendant: 'Aries', phase: 'exact', description: 'A-exact' }]);
    const lookup = createInterpretationLookup(db);
    expect(lookup('career', KEY, ['Aries', 'Aries', '*'])).toBe('A-exact');
    db.close();
  });

  test('null key and wrong lens return empty string', () => {
    const db = makeDb([{ ascendant: '*', phase: 'exact', description: 'G-exact' }]);
    const lookup = createInterpretationLookup(db);
    expect(lookup('career', null, ['*'])).toBe('');
    expect(lookup('food', KEY, ['*'])).toBe('');
    db.close();
  });
});
