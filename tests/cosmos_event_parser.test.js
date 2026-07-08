const { parseEventName } = require('../services/cosmos_event_parser');
const { generateEventNames, ASCENDANTS } = require('../db/seed_all_ascendants');

function keyId(k) {
  return [
    k.kind, k.transit_planet || '', k.natal_planet || '',
    k.target_house || 0, k.target_angle || '', k.special_label || '',
    k.lord_house || 0, k.phase || 'window',
  ].join('|');
}

describe('parseEventName spot checks', () => {
  test('aspect with phase discards natal house', () => {
    expect(parseEventName('Mars aspect Venus in 9th house : Exact')).toEqual({
      kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus', phase: 'exact',
    });
  });
  test('aspect alternate phrasing ("in the")', () => {
    expect(parseEventName('Mars aspect Venus in the 9th house')).toEqual({
      kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus', phase: 'window',
    });
  });
  test('transit house', () => {
    expect(parseEventName('Moon Transits the 8th House')).toEqual({
      kind: 'transit_house', transit_planet: 'Moon', target_house: 8, phase: 'window',
    });
  });
  test('ruler', () => {
    expect(parseEventName('Mars ruler of the 11th House in the 9th House')).toEqual({
      kind: 'ruler', lord_house: 11, target_house: 9, phase: 'window',
    });
  });
  test('dispositor', () => {
    expect(parseEventName('Sun in 9th (Dispositor)')).toEqual({
      kind: 'dispositor', natal_planet: 'Sun', target_house: 9, phase: 'window',
    });
  });
  test('angle aspects', () => {
    expect(parseEventName('Jupiter Aspecting Midheaven (MC) : Starts')).toEqual({
      kind: 'angle_aspect', transit_planet: 'Jupiter', target_angle: 'MC', phase: 'starts',
    });
    expect(parseEventName('Venus Aspecting Ascendant (ASC)')).toEqual({
      kind: 'angle_aspect', transit_planet: 'Venus', target_angle: 'ASC', phase: 'window',
    });
  });
  test('outer specials', () => {
    expect(parseEventName('Pluto conjunct Saturn : Ends')).toEqual({
      kind: 'outer_special', special_label: 'Pluto-Saturn', phase: 'ends',
    });
    expect(parseEventName('Uranus conjunct Venus')).toEqual({
      kind: 'outer_special', special_label: 'Uranus-Venus', phase: 'window',
    });
  });
  test('unknown name returns null', () => {
    expect(parseEventName('Total nonsense event')).toBeNull();
    expect(parseEventName('')).toBeNull();
    expect(parseEventName(null)).toBeNull();
  });
});

describe('parseEventName round-trip over generateEventNames', () => {
  for (const ascendant of ASCENDANTS) {
    test(`every generated ${ascendant} event name parses`, () => {
      const failures = [];
      for (const name of generateEventNames(ascendant)) {
        if (parseEventName(name) === null) failures.push(name);
      }
      expect(failures).toEqual([]);
    });
  }

  test('distinct names produce distinct keys, except the deliberate aspect natal-house collapse', () => {
    for (const ascendant of ASCENDANTS) {
      const byKey = new Map();
      for (const name of generateEventNames(ascendant)) {
        const key = parseEventName(name);
        const id = keyId(key);
        if (!byKey.has(id)) byKey.set(id, []);
        byKey.get(id).push({ name, key });
      }
      for (const [id, group] of byKey) {
        if (group.length === 1) continue;
        // Only aspects may collapse, and only across the natal-house segment:
        // stripping " in [the] Nth house" must make every name identical.
        expect(group[0].key.kind).toBe('aspect');
        const stripped = new Set(group.map((g) =>
          g.name.replace(/\s+in\s+(?:the\s+)?\d+(?:st|nd|rd|th)\s+house/i, '')));
        if (stripped.size !== 1) {
          throw new Error(`unexpected key collapse for ${id}: ${group.map((g) => g.name).join(' | ')}`);
        }
      }
    }
  });
});
