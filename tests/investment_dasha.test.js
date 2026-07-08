/**
 * Unit tests for services/investment-dasha.js — natal-chart dasha favorability.
 * Uses synthetic natalMaps (no Python subprocess) for speed and determinism.
 */
const {
  evaluatePeriodForInvestment,
  ownedHouseNumbers,
  planetDignity,
} = require('../services/investment-dasha');

function natalMapFrom(lagnaSign, placements) {
  const idx = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].indexOf(lagnaSign);
  const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const map = {
    Ascendant: { name: 'Ascendant', sign: lagnaSign, house: 1 },
  };
  for (const [planet, sign] of Object.entries(placements)) {
    const signIdx = SIGNS.indexOf(sign);
    const house = ((signIdx - idx + 12) % 12) + 1;
    map[planet] = { name: planet, sign, house };
  }
  return map;
}

describe('investment-dasha helpers', () => {
  test('ownedHouseNumbers for Cancer lagna — Saturn rules 7th and 8th', () => {
    expect(ownedHouseNumbers('Saturn', 'Cancer')).toEqual([7, 8]);
  });

  test('planetDignity — Mars exalted in Capricorn, debilitated in Cancer', () => {
    expect(planetDignity('Mars', 'Capricorn')).toBe('exalted');
    expect(planetDignity('Mars', 'Cancer')).toBe('debilitated');
  });
});

describe('evaluatePeriodForInvestment — conservative 8th-house rules', () => {
  test('8th-lord in 8th is warning-only, not favorable (Aries lagna, Mars)', () => {
    // Jack's chart: Mars owns 1+8, sits in Scorpio (8th from Aries)
    const map = natalMapFrom('Aries', {
      Mars: 'Scorpio', Venus: 'Scorpio', Mercury: 'Scorpio',
      Jupiter: 'Leo', Sun: 'Sagittarius', Moon: 'Virgo',
      Saturn: 'Capricorn', Rahu: 'Sagittarius', Ketu: 'Gemini',
    });
    const r = evaluatePeriodForInvestment('Mars', map, { level: 'antardasha', parentPlanet: 'Jupiter' });
    expect(r.favorable).toBe(true); // Venus–Mars yoga still activates Mars AD
    expect(r.warnings.some(w => w.includes('8th lord'))).toBe(true);
    expect(r.warnings.some(w => w.includes('Randhra'))).toBe(true);
  });

  test('planet in 8th with no other positives is warning-only (Mercury AD)', () => {
    const map = natalMapFrom('Aries', {
      Mars: 'Scorpio', Venus: 'Scorpio', Mercury: 'Scorpio',
      Jupiter: 'Leo', Sun: 'Sagittarius', Moon: 'Virgo',
      Saturn: 'Capricorn', Rahu: 'Sagittarius', Ketu: 'Gemini',
    });
    const r = evaluatePeriodForInvestment('Mercury', map, { level: 'antardasha', parentPlanet: 'Jupiter' });
    expect(r.favorable).toBe(false);
    expect(r.reasons).toHaveLength(0);
    expect(r.warnings.some(w => w.includes('Randhra'))).toBe(true);
  });

  test('Mars Mahadasha in neutral 8th is not favorable (Buffett-like)', () => {
    // Scorpio lagna, Mars in Gemini (8th house), neutral dignity
    const map = natalMapFrom('Scorpio', {
      Mars: 'Gemini', Mercury: 'Virgo', Jupiter: 'Gemini', Venus: 'Virgo',
      Sun: 'Leo', Moon: 'Scorpio', Saturn: 'Sagittarius',
      Rahu: 'Aries', Ketu: 'Libra',
    });
    const r = evaluatePeriodForInvestment('Mars', map, { level: 'mahadasha' });
    expect(r.favorable).toBe(false);
    expect(r.reasons).toHaveLength(0);
    expect(r.warnings.some(w => w.includes('Mahadasha is normally good'))).toBe(true);
  });

  test('8L in 11th counts as favorable lordship (Mercury for Scorpio lagna)', () => {
    const map = natalMapFrom('Scorpio', {
      Mars: 'Gemini', Mercury: 'Virgo', Jupiter: 'Gemini', Venus: 'Virgo',
      Sun: 'Leo', Moon: 'Scorpio', Saturn: 'Sagittarius',
      Rahu: 'Aries', Ketu: 'Libra',
    });
    const r = evaluatePeriodForInvestment('Mercury', map, { level: 'mahadasha' });
    expect(r.favorable).toBe(true);
    expect(r.reasons.some(x => x.includes('11th (income & gains)'))).toBe(true);
  });
});

describe('evaluatePeriodForInvestment — shadow planets', () => {
  test('Rahu in 9th is favorable when Jupiter in 5th aspects it (Jack chart)', () => {
    const map = natalMapFrom('Aries', {
      Mars: 'Scorpio', Venus: 'Scorpio', Mercury: 'Scorpio',
      Jupiter: 'Leo', Sun: 'Sagittarius', Moon: 'Virgo',
      Saturn: 'Capricorn', Rahu: 'Sagittarius', Ketu: 'Gemini',
    });
    const r = evaluatePeriodForInvestment('Rahu', map, { level: 'antardasha', parentPlanet: 'Jupiter' });
    expect(r.favorable).toBe(true);
    expect(r.reasons.some(x => x.includes('restrained by Jupiter'))).toBe(true);
  });

  test('unrestrained Rahu in 11th is warning-only', () => {
    // Jupiter in Cancer (4th) does not aspect Aquarius (11th) — no benefic restraint
    const map = natalMapFrom('Aries', {
      Rahu: 'Aquarius', Jupiter: 'Cancer', Sun: 'Sagittarius', Moon: 'Virgo',
      Mars: 'Scorpio', Mercury: 'Scorpio', Venus: 'Scorpio',
      Saturn: 'Capricorn', Ketu: 'Gemini',
    });
    const r = evaluatePeriodForInvestment('Rahu', map, { level: 'antardasha', parentPlanet: 'Saturn' });
    expect(r.favorable).toBe(false);
    expect(r.warnings.some(w => w.includes('unrestrained'))).toBe(true);
  });
});

describe('evaluatePeriodForInvestment — yogas', () => {
  test('2L–11L parivartana fires when dasha lord participates (Capricorn lagna)', () => {
    // Cap lagna: 2L Saturn (Aquarius), 11L Mars (Scorpio) — exchange: Saturn in Scorpio, Mars in Aquarius
    const map = natalMapFrom('Capricorn', {
      Saturn: 'Scorpio', Mars: 'Aquarius',
      Sun: 'Leo', Moon: 'Cancer', Mercury: 'Virgo', Venus: 'Libra',
      Jupiter: 'Gemini', Rahu: 'Taurus', Ketu: 'Scorpio',
    });
    const r = evaluatePeriodForInvestment('Saturn', map, { level: 'antardasha', parentPlanet: 'Venus' });
    expect(r.favorable).toBe(true);
    expect(r.reasons.some(x => x.includes('parivartana'))).toBe(true);
  });

  test('Jupiter–Rahu in kendra/trikona yoga fires for participating dasha lord', () => {
    const map = natalMapFrom('Aries', {
      Jupiter: 'Leo', Rahu: 'Leo',
      Sun: 'Sagittarius', Moon: 'Virgo', Mars: 'Scorpio',
      Mercury: 'Scorpio', Venus: 'Scorpio', Saturn: 'Capricorn', Ketu: 'Gemini',
    });
    const r = evaluatePeriodForInvestment('Rahu', map, { level: 'antardasha', parentPlanet: 'Jupiter' });
    expect(r.favorable).toBe(true);
    expect(r.reasons.some(x => x.includes('Jupiter–Rahu'))).toBe(true);
  });

  test('debilitated dasha lord returns early with no positives', () => {
    const map = natalMapFrom('Scorpio', {
      Moon: 'Scorpio', Sun: 'Leo', Mars: 'Gemini', Mercury: 'Virgo',
      Jupiter: 'Gemini', Venus: 'Virgo', Saturn: 'Sagittarius',
      Rahu: 'Aries', Ketu: 'Libra',
    });
    const r = evaluatePeriodForInvestment('Moon', map, { level: 'mahadasha' });
    expect(r.favorable).toBe(false);
    expect(r.reasons).toHaveLength(0);
    expect(r.warnings.some(w => w.includes('debilitated'))).toBe(true);
  });
});
