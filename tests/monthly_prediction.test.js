const {
  predictionForPeriod,
  bandFor,
  CATEGORIES,
} = require('../services/monthly-prediction');

describe('bandFor (Sarvashtavarga point bands)', () => {
  test('≥30 bindus → high', () => {
    expect(bandFor(30)).toBe('high');
    expect(bandFor(38)).toBe('high');
  });
  test('25–29 bindus → neutral', () => {
    expect(bandFor(25)).toBe('neutral');
    expect(bandFor(29)).toBe('neutral');
  });
  test('<25 bindus → low', () => {
    expect(bandFor(20)).toBe('low');
    expect(bandFor(24)).toBe('low');
  });
});

describe('predictionForPeriod (structured 4-category output)', () => {
  // Reference period from the docx for Tajika year 34, Sun in Karkata
  // (h11 from natal Moon at Kanya), Sarvashtavarga 36, Jupiter in Mithuna
  // (h10 from Moon).
  const REF = {
    sunHouseFromMoon: 11,
    jupiterHouseFromMoon: 10,
    sarvashtavargaPoints: 36,
  };

  test('emits all four life-area categories', () => {
    const out = predictionForPeriod(REF);
    expect(Object.keys(out.prediction).sort()).toEqual(
      [...CATEGORIES].sort(),
    );
    for (const c of CATEGORIES) {
      expect(typeof out.prediction[c]).toBe('string');
      expect(out.prediction[c].length).toBeGreaterThan(0);
    }
  });

  test('selects the high-band Sun template when bindus ≥ 30', () => {
    const out = predictionForPeriod(REF);
    expect(out.band).toBe('high');
    // House 11 high-band investment line in the seed talks about ROI/venture capital.
    expect(out.prediction.investment).toMatch(/high ROI|venture capital/i);
  });

  test('selects the low-band Sun template when bindus < 25', () => {
    const out = predictionForPeriod({ ...REF, sarvashtavargaPoints: 20 });
    expect(out.band).toBe('low');
    // House 11 low-band work line warns about challenges/delays.
    expect(out.prediction.work).toMatch(/Challenges and delays/i);
  });

  test('selects the neutral template for mid-band bindus', () => {
    const out = predictionForPeriod({ ...REF, sarvashtavargaPoints: 27 });
    expect(out.band).toBe('neutral');
    expect(out.prediction.work).toMatch(/Steady progress/i);
  });

  test('appends Jupiter-from-Moon modifier text per category', () => {
    const out = predictionForPeriod(REF);
    // Jupiter h10 modifier work line mentions "Professional expansion".
    expect(out.prediction.work).toMatch(/Professional expansion/i);
    // Jupiter h10 health line mentions "knees/joints".
    expect(out.prediction.health).toMatch(/knees|joints/i);
  });

  test('returns empty per-category strings when sun-house-from-Moon is out of range', () => {
    const out = predictionForPeriod({ ...REF, sunHouseFromMoon: 99 });
    for (const c of CATEGORIES) {
      expect(out.prediction[c]).toBe('');
    }
  });

  test('still returns the band/theme even when the prediction is empty', () => {
    const out = predictionForPeriod({ ...REF, sunHouseFromMoon: 99 });
    expect(out.band).toBe('high'); // bindu band is independent of sun-house lookup
    expect(out.theme).toBe('');
  });
});
