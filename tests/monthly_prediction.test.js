const { predictionForPeriod, bandFor } = require('../services/monthly-prediction');

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

describe('predictionForPeriod', () => {
  // Reference period from the docx for Tajika year 34, Sun in Karkata
  // (h11 from natal Moon at Kanya), Sarvashtavarga 36, Jupiter in Mithuna
  // (h10 from Moon).
  const REF = {
    sunHouseFromMoon: 11,
    jupiterHouseFromMoon: 10,
    sarvashtavargaPoints: 36,
  };

  test('selects the high-band template when bindus ≥ 30', () => {
    const out = predictionForPeriod(REF);
    expect(out.band).toBe('high');
    expect(out.theme).toBe('Gains / network / fulfilment');
    expect(out.text).toMatch(/strong points/);
    // Jupiter modifier appended.
    expect(out.text).toMatch(/Jupiter in the 10th from Moon/);
  });

  test('selects the low-band template when bindus < 25', () => {
    const out = predictionForPeriod({ ...REF, sarvashtavargaPoints: 20 });
    expect(out.band).toBe('low');
    expect(out.text).toMatch(/even a malefic-friendly house cannot fully overcome weak/);
  });

  test('selects the neutral template for mid-band bindus', () => {
    const out = predictionForPeriod({ ...REF, sarvashtavargaPoints: 27 });
    expect(out.band).toBe('neutral');
  });

  test('returns empty text when sun-house-from-Moon is out of range', () => {
    const out = predictionForPeriod({ ...REF, sunHouseFromMoon: 99 });
    expect(out.text).toBe('');
  });
});
