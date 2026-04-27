const {
  combinedEffect,
  planetEffect,
  munthaEffect,
  munthaLordEffect,
  birthLagnaEffect,
  pickVarsheshwara,
} = require('../services/varshaphal');

// Reference fixture: Yearly.docx for birth 1991-12-29 13:30 +07:00
// (Ho Chi Minh City), year 2024 / Tajika year 34. Replays the chart that the
// docx renders so the rule layer can be tested without spawning Python.
const REF_RAW = {
  varshapravesh: { datetime: '2024-12-29T00:39:01', tajikaYear: 34 },
  annualChart: {
    lagna: 'Virgo',
    lagnaVedic: 'Kanya',
    birthLagna: 'Aries',
    birthLagnaVedic: 'Mesha',
    birthLagnaHouseInAnnual: 8,
    planets: [
      { name: 'Sun',     sign: 'Sagittarius', house: 4 },
      { name: 'Moon',    sign: 'Scorpio',     house: 3 },
      { name: 'Mars',    sign: 'Cancer',      house: 11 },
      { name: 'Mercury', sign: 'Scorpio',     house: 3 },
      { name: 'Jupiter', sign: 'Taurus',      house: 9 },
      { name: 'Venus',   sign: 'Capricorn',   house: 5 },
      { name: 'Saturn',  sign: 'Aquarius',    house: 6 },
      { name: 'Rahu',    sign: 'Pisces',      house: 7 },
      { name: 'Ketu',    sign: 'Virgo',       house: 1 },
    ],
  },
  muntha: {
    sign: 'Capricorn', signVedic: 'Makara',
    house: 5, lord: 'Saturn', lordHouseInAnnual: 6, lordSign: 'Aquarius',
  },
};

describe('planetEffect (Tajika annual-chart house rules)', () => {
  test.each([
    // Reproduces every row in the docx Summary-of-effects table.
    ['Moon',    3,  'Favourable'],
    ['Sun',     4,  'Unfavourable'],
    ['Mercury', 3,  'Favourable'],
    ['Venus',   5,  'Favourable'],
    ['Mars',    11, 'Favourable'],
    ['Jupiter', 9,  'Favourable'],
    ['Saturn',  6,  'Favourable'],
    ['Rahu',    7,  'Unfavourable'],
    ['Ketu',    1,  'Unfavourable'],
  ])('%s in %dth house → %s', (planet, house, expected) => {
    expect(planetEffect(planet, house)).toBe(expected);
  });
});

describe('Muntha & Muntha Lord rules', () => {
  // Muntha favourable houses: 1,2,3,5,9,10,11.
  test.each([
    [5, 'Favourable'], [9, 'Favourable'], [10, 'Favourable'],
    [4, 'Unfavourable'], [6, 'Unfavourable'], [8, 'Unfavourable'], [12, 'Unfavourable'],
  ])('Muntha in %dth → %s', (house, expected) => {
    expect(munthaEffect(house)).toBe(expected);
    expect(munthaLordEffect(house)).toBe(expected);
  });
});

describe('Birth Lagna in annual chart', () => {
  // Birth Lagna favourable houses: 1,2,4,5,7,9,10,11.
  test('1st in annual chart is favourable', () => {
    expect(birthLagnaEffect(1)).toBe('Favourable');
  });
  test('8th in annual chart (the docx case) is unfavourable', () => {
    expect(birthLagnaEffect(8)).toBe('Unfavourable');
  });
  test('6th and 12th are unfavourable', () => {
    expect(birthLagnaEffect(6)).toBe('Unfavourable');
    expect(birthLagnaEffect(12)).toBe('Unfavourable');
  });
});

describe('pickVarsheshwara', () => {
  test('selects Mercury (Varsha Lagna Lord) for the docx fixture', () => {
    const v = pickVarsheshwara(REF_RAW.annualChart, REF_RAW.muntha);
    expect(v.planet).toBe('Mercury');
    expect(v.role).toBe('Varsha Lagna Lord');
    expect(v.house).toBe(3);
    expect(v.effect).toBe('Favourable');
  });

  test('breaks ties in favour of Varsha Lagna Lord over Birth Lagna Lord', () => {
    // Construct a chart where Varsha Lagnesh and Birth Lagnesh share the same
    // house score. Varsha Lagnesh must win because it appears first in the
    // candidate list (deterministic tiebreaker).
    const annual = {
      lagna: 'Leo',          // Lord = Sun
      birthLagna: 'Aries',   // Lord = Mars
      planets: [
        { name: 'Sun',  house: 11 }, // score 5
        { name: 'Mars', house: 11 }, // score 5
        { name: 'Saturn', house: 1 },
      ],
    };
    const muntha = { lord: 'Saturn', lordHouseInAnnual: 1 }; // score 5
    const v = pickVarsheshwara(annual, muntha);
    expect(v.role).toBe('Varsha Lagna Lord');
    expect(v.planet).toBe('Sun');
  });
});

describe('combinedEffect (full reference replay)', () => {
  const out = combinedEffect(REF_RAW);

  test('returns 5 factors in the docx order', () => {
    expect(out.factors.map(f => f.factor)).toEqual([
      'Muntha', 'Muntha Lord', 'Varsheshwara', 'Birth Lagna', 'Planets in Houses',
    ]);
  });

  test.each([
    ['Muntha',            'Favourable'],
    ['Muntha Lord',       'Unfavourable'],
    ['Varsheshwara',      'Favourable'],
    ['Birth Lagna',       'Unfavourable'],
    ['Planets in Houses', 'Favourable'],
  ])('%s effect = %s (matches docx)', (factor, expected) => {
    expect(out.factors.find(f => f.factor === factor).effect).toBe(expected);
  });

  test('overall effect is Favourable (3 of 5 factors favourable)', () => {
    expect(out.overallEffect).toBe('Favourable');
  });

  test('Planets-in-Houses row carries the per-planet breakdown', () => {
    const planets = out.factors.find(f => f.factor === 'Planets in Houses');
    expect(planets.rows).toHaveLength(9);
    expect(planets.rows.find(r => r.planet === 'Sun').effect).toBe('Unfavourable');
    expect(planets.rows.find(r => r.planet === 'Saturn').effect).toBe('Favourable');
  });

  test('exposes the picked Varsheshwara planet/role', () => {
    expect(out.varsheshwara.planet).toBe('Mercury');
    expect(out.varsheshwara.role).toBe('Varsha Lagna Lord');
  });
});
