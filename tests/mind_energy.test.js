const { scoreDay, tithiNumber, WEIGHTS, BASE } = require('../services/mind-energy');

// Neutral natal chart: Aries Lagna, Moon in Gemini, Sun/Mars in neutral signs,
// Venus in Capricorn (10th, a kendra from Lagna) for the neecha-bhanga case.
const NATAL = {
  Ascendant: { sign: 'Aries', house: 1 },
  Sun:     { sign: 'Gemini', house: 3 },
  Moon:    { sign: 'Gemini', house: 3 },
  Mars:    { sign: 'Gemini', house: 3 },
  Mercury: { sign: 'Gemini', house: 3 },
  Jupiter: { sign: 'Gemini', house: 3 },
  Venus:   { sign: 'Capricorn', house: 10 },
  Saturn:  { sign: 'Gemini', house: 3 },
};

// Quiet transit day: nothing triggers a rule.
function quietTransit(overrides = {}) {
  const pos = (sign, house, lon, speed = 1) => ({ sign, house, siderealLon: lon, speed });
  return {
    Sun:     pos('Taurus', 2, 45),
    Moon:    pos('Virgo', 6 + 0, 165, 13),
    Mercury: pos('Cancer', 4, 100),
    Mars:    pos('Taurus', 2, 50),
    Venus:   pos('Taurus', 2, 55),
    Jupiter: pos('Sagittarius', 9, 250),
    Saturn:  pos('Pisces', 12, 340, 0.1),
    Rahu:    pos('Aquarius', 11, 310, -0.05),
    Ketu:    pos('Leo', 5, 130, -0.05),
    ...overrides,
  };
}

// Dispositor/exaltation-lord positions that give no neecha bhanga for Sun (Libra) or
// Mars (Cancer) against NATAL: Saturn & Jupiter in Taurus, Moon in Leo, Venus natal in Taurus.
const NO_SAVE_NATAL = { ...NATAL, Venus: { sign: 'Taurus', house: 2 }, Saturn: { sign: 'Taurus', house: 2 } };
const noSaveTransit = (overrides = {}) => quietTransit({
  Saturn:  { sign: 'Taurus', house: 2, siderealLon: 40, speed: 0.1 },
  Jupiter: { sign: 'Taurus', house: 2, siderealLon: 35, speed: 0.1 },
  Moon:    { sign: 'Leo', house: 5, siderealLon: 130, speed: 13 },
  ...overrides,
});

const score = (transit, extra = {}) => scoreDay({ natal: NATAL, transit, ...extra });
const delta = (r, metric, re) =>
  r.drivers.filter(d => d.metric === metric && re.test(d.label)).reduce((s, d) => s + d.delta, 0);

describe('scoreDay', () => {
  test('clamps scores to 0–100 and sorts drivers by |delta|', () => {
    const worst = quietTransit({
      Sun:  { sign: 'Libra', house: 12, siderealLon: 190, speed: 1 },
      Mars: { sign: 'Cancer', house: 4, siderealLon: 100, speed: 1 },
    });
    const r = score(worst);
    expect(r.vitality).toBeGreaterThanOrEqual(0);
    expect(r.vitality).toBeLessThanOrEqual(100);
    const mags = r.drivers.map(d => Math.abs(d.delta));
    expect(mags).toEqual([...mags].sort((a, b) => b - a));
  });

  test('Moon conjunct Rahu raises overthinking by the node weight', () => {
    const r = score(quietTransit({ Moon: { sign: 'Aquarius', house: 11, siderealLon: 310, speed: 13 } }));
    expect(delta(r, 'overthinking', /Grahan/)).toBe(WEIGHTS.moonWithNode);
  });

  test('Mercury retrograde raises overthinking', () => {
    const r = score(quietTransit({ Mercury: { sign: 'Cancer', house: 4, siderealLon: 100, speed: -0.5 } }));
    expect(delta(r, 'overthinking', /retrograde/)).toBe(WEIGHTS.mercuryRetrograde);
  });

  test('Jupiter aspecting the Moon lowers overthinking', () => {
    // Jupiter in Sagittarius aspects Gemini (7th) — put the Moon there.
    const r = score(quietTransit({ Moon: { sign: 'Gemini', house: 3, siderealLon: 75, speed: 13 } }));
    expect(delta(r, 'overthinking', /Jupiter aspects/)).toBe(WEIGHTS.jupiterOnMoon);
  });

  test('Moon in Scorpio (debilitated) raises overthinking and lowers vitality', () => {
    const r = score(quietTransit({ Moon: { sign: 'Scorpio', house: 8, siderealLon: 225, speed: 13 } }));
    expect(delta(r, 'overthinking', /Transit Moon debilitated/)).toBe(10);
    expect(delta(r, 'vitality', /Transit Moon debilitated/)).toBe(-4);
  });

  test('Sun in Libra lowers vitality', () => {
    const base = score(noSaveTransit());
    const r = score(noSaveTransit({ Sun: { sign: 'Libra', house: 7, siderealLon: 190, speed: 1 } }));
    expect(r.vitality).toBeLessThan(base.vitality);
  });

  test('Sun + Mars both debilitated penalise more than either alone', () => {
    const run = t => scoreDay({ natal: NO_SAVE_NATAL, transit: t }).vitality;
    const sun = { sign: 'Libra', house: 7, siderealLon: 190, speed: 1 };
    const mars = { sign: 'Cancer', house: 4, siderealLon: 100, speed: 1 };
    const quiet = run(noSaveTransit());
    const sunOnly = run(noSaveTransit({ Sun: sun }));
    const marsOnly = run(noSaveTransit({ Mars: mars }));
    const both = run(noSaveTransit({ Sun: sun, Mars: mars }));
    expect(quiet - sunOnly).toBeGreaterThan(0);
    expect(quiet - marsOnly).toBeGreaterThan(0);
    expect(quiet - both).toBeGreaterThan(quiet - sunOnly);
    expect(quiet - both).toBeGreaterThan(quiet - marsOnly);
    expect(quiet - both).toBe((quiet - sunOnly) + (quiet - marsOnly));
  });

  test('neecha bhanga halves a debilitated Sun penalty and says so', () => {
    const sun = { sign: 'Libra', house: 7, siderealLon: 190, speed: 1 };
    // Transit Venus (Libra's dispositor) in Capricorn = 10th from Aries Lagna -> cancelled.
    const venusInKendra = { sign: 'Capricorn', house: 10, siderealLon: 290, speed: 1 };
    const cancelled = scoreDay({ natal: NO_SAVE_NATAL, transit: noSaveTransit({ Sun: sun, Venus: venusInKendra }) });
    const raw = scoreDay({ natal: NO_SAVE_NATAL, transit: noSaveTransit({ Sun: sun }) });
    expect(delta(cancelled, 'vitality', /Transit Sun debilitated/)).toBe(-9);
    expect(cancelled.drivers.some(d => /neecha bhanga/.test(d.label))).toBe(true);
    expect(delta(raw, 'vitality', /Transit Sun debilitated/)).toBe(-18);
    expect(raw.drivers.some(d => /neecha bhanga/.test(d.label))).toBe(false);
  });

  test('natal debilitated Sun lowers the baseline on every day', () => {
    const weak = { ...NO_SAVE_NATAL, Sun: { sign: 'Libra', house: 7 } };
    const a = scoreDay({ natal: weak, transit: noSaveTransit() });
    const b = scoreDay({ natal: NO_SAVE_NATAL, transit: noSaveTransit() });
    expect(b.vitality - a.vitality).toBe(8);
    expect(a.drivers.some(d => /Natal Sun debilitated/.test(d.label))).toBe(true);
  });

  test('natal debilitated Mars (Moon is its dispositor, so cancelled) is halved', () => {
    const weak = { ...NATAL, Mars: { sign: 'Cancer', house: 4 } };
    const a = scoreDay({ natal: weak, transit: quietTransit() });
    const b = scoreDay({ natal: NATAL, transit: quietTransit() });
    expect(b.vitality - a.vitality).toBe(4);
    expect(a.drivers.some(d => /Natal Mars debilitated.*neecha bhanga/.test(d.label))).toBe(true);
  });

  test('antardasha of Rahu raises overthinking', () => {
    const r = score(quietTransit(), { dasha: { antardasha: { planet: 'Rahu' }, mahadasha: { planet: 'Venus' } } });
    expect(delta(r, 'overthinking', /Antardasha of Rahu/)).toBe(WEIGHTS.dashaMoonNode.antardasha);
  });

  test('quiet day stays at the base score', () => {
    const r = score(quietTransit());
    expect(Math.abs(r.overthinking - BASE)).toBeLessThanOrEqual(12);
  });
});

describe('tithiNumber', () => {
  test('new moon is tithi 1, full moon 16, just before conjunction 30', () => {
    expect(tithiNumber(100, 100)).toBe(1);
    expect(tithiNumber(100, 280)).toBe(16);
    expect(tithiNumber(100, 99)).toBe(30);
  });
});
