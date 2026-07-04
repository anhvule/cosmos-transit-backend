const {
  normalizeTitle,
  titlesFromCareerResponse,
  missingTitles,
} = require('./planner_titles');

describe('normalizeTitle', () => {
  test('trims and collapses whitespace', () => {
    expect(normalizeTitle('  Moon   aspect  Venus  ')).toBe('moon aspect venus');
  });

  test('is case-insensitive', () => {
    expect(normalizeTitle('Mars in 8th (Dispositor)')).toBe(
      normalizeTitle('mars in 8th (dispositor)'),
    );
  });

  test('treats optional "the" before house ordinal as equivalent', () => {
    expect(normalizeTitle('Venus ruler of the 7th House in the 8th house')).toBe(
      normalizeTitle('Venus ruler of the 7th House in 8th house'),
    );
    expect(normalizeTitle('Moon aspect Venus in 8th house')).toBe(
      normalizeTitle('Moon aspect Venus in the 8th house'),
    );
  });

  test('treats Transit and Transits as equivalent', () => {
    expect(normalizeTitle('Sun Transit the 12th House')).toBe(
      normalizeTitle('Sun Transits the 12th House'),
    );
  });

  test('preserves phase suffixes', () => {
    expect(normalizeTitle('Saturn aspect Sun in 9th house : Exact')).toContain(': exact');
  });
});

describe('titlesFromCareerResponse', () => {
  test('unions aspects and rulers descriptions', () => {
    const titles = titlesFromCareerResponse({
      aspects: [{ description: 'Moon Transits the 8th House' }],
      rulers: [
        { description: 'Mars in 8th (Dispositor)' },
        { description: 'Venus ruler of the 7th House in the 8th house' },
      ],
    });
    expect(titles).toEqual([
      'Moon Transits the 8th House',
      'Mars in 8th (Dispositor)',
      'Venus ruler of the 7th House in the 8th house',
    ]);
  });

  test('skips missing descriptions', () => {
    expect(titlesFromCareerResponse({
      aspects: [{ description: null }, {}],
      rulers: [],
    })).toEqual([]);
  });
});

describe('missingTitles', () => {
  test('returns empty when all expected titles are present (subset)', () => {
    const missing = missingTitles(
      ['Mars in 8th (Dispositor)', 'Moon aspect Venus in 8th house'],
      [
        'Moon aspect Venus in the 8th house',
        'Mars in 8th (Dispositor)',
        'Extra API title',
      ],
    );
    expect(missing).toEqual([]);
  });

  test('returns expected titles not found in actual', () => {
    const missing = missingTitles(
      ['Mars in 8th (Dispositor)', 'Venus ruler of the 7th House in the 8th house'],
      ['Mars in 8th (Dispositor)'],
    );
    expect(missing).toEqual(['Venus ruler of the 7th House in the 8th house']);
  });

  test('empty expected list never reports missing', () => {
    expect(missingTitles([], ['anything'])).toEqual([]);
  });
});
