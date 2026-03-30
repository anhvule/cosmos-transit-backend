const {
  calculateTransitReport,
  getAscendantSign,
  buildHouseSignMap,
  normalizeAngle,
  isSeparating,
  ordinal,
  SIGN_RULERS,
  SIGN_ORDER,
} = require('../services/astrology');

// --- Helper Tests ---

describe('ordinal', () => {
  it('returns correct ordinal suffixes', () => {
    expect(ordinal(1)).toBe('1st');
    expect(ordinal(2)).toBe('2nd');
    expect(ordinal(3)).toBe('3rd');
    expect(ordinal(4)).toBe('4th');
    expect(ordinal(5)).toBe('5th');
    expect(ordinal(8)).toBe('8th');
    expect(ordinal(11)).toBe('11th');
    expect(ordinal(12)).toBe('12th');
  });
});

describe('normalizeAngle', () => {
  it('normalizes angles to 0-180 range', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(90)).toBe(90);
    expect(normalizeAngle(180)).toBe(180);
    expect(normalizeAngle(270)).toBe(90);
    expect(normalizeAngle(360)).toBe(0);
    expect(normalizeAngle(-90)).toBe(90);
  });
});

describe('getAscendantSign', () => {
  it('extracts ascendant sign from planets array', () => {
    const planets = [
      { name: 'Sun', sign: 'Leo' },
      { name: 'Ascendant', sign: 'Aries', fullDegree: 12.65 },
    ];
    expect(getAscendantSign(planets)).toBe('Aries');
  });

  it('defaults to Aries if no ascendant found', () => {
    expect(getAscendantSign([])).toBe('Aries');
  });
});

describe('buildHouseSignMap', () => {
  it('maps Aries ascendant correctly', () => {
    const { houseToSign, signToHouse } = buildHouseSignMap('Aries');
    expect(houseToSign[1]).toBe('Aries');
    expect(houseToSign[2]).toBe('Taurus');
    expect(houseToSign[7]).toBe('Libra');
    expect(houseToSign[8]).toBe('Scorpio');
    expect(signToHouse['Scorpio']).toBe(8);
    expect(signToHouse['Leo']).toBe(5);
  });

  it('wraps around for late-zodiac ascendants', () => {
    const { houseToSign } = buildHouseSignMap('Pisces');
    expect(houseToSign[1]).toBe('Pisces');
    expect(houseToSign[2]).toBe('Aries');
    expect(houseToSign[3]).toBe('Taurus');
  });
});

describe('isSeparating', () => {
  it('returns true when transit moves away from aspect', () => {
    const transit = { fullDegree: 226, speed: 1 };
    const natal = { fullDegree: 225 };
    expect(isSeparating(transit, natal, 0)).toBe(true);
  });

  it('returns false when transit approaches exact aspect', () => {
    const transit = { fullDegree: 223, speed: 1 };
    const natal = { fullDegree: 225 };
    expect(isSeparating(transit, natal, 0)).toBe(false);
  });

  it('handles retrograde motion', () => {
    const transit = { fullDegree: 226, speed: -0.5 };
    const natal = { fullDegree: 225 };
    expect(isSeparating(transit, natal, 0)).toBe(false);
  });
});

// --- Transit Report Tests ---
// Mock data modeled on real API responses for Dec 29, 1991 birth in Ho Chi Minh City

// Sidereal natal: Aries ASC → whole-sign: 2=Taurus(Venus), 7=Libra(Venus), 8=Scorpio(Mars)
const siderealNatal = [
  { name: 'Ascendant', sign: 'Aries', fullDegree: 12.65, house: 1, speed: 0, signLord: 'Mars' },
  { name: 'Sun', sign: 'Sagittarius', fullDegree: 253.28, house: 9, speed: 1.02, signLord: 'Jupiter' },
  { name: 'Moon', sign: 'Virgo', fullDegree: 177.86, house: 6, speed: 13.05, signLord: 'Mercury' },
  { name: 'Venus', sign: 'Scorpio', fullDegree: 213.40, house: 8, speed: 1.20, signLord: 'Mars' },
  { name: 'Mars', sign: 'Scorpio', fullDegree: 238.03, house: 8, speed: 0.73, signLord: 'Mars' },
  { name: 'Mercury', sign: 'Scorpio', fullDegree: 231.17, house: 8, speed: 1.08, signLord: 'Mars' },
  { name: 'Jupiter', sign: 'Leo', fullDegree: 140.87, house: 5, speed: 0.005, signLord: 'Sun' },
  { name: 'Saturn', sign: 'Capricorn', fullDegree: 281.80, house: 10, speed: 0.11, signLord: 'Saturn' },
];

// Tropical natal: same planets, tropical degrees for aspect comparison
const tropicalNatal = [
  { name: 'Ascendant', sign: 'Taurus', fullDegree: 36.40, house: 1, speed: 0 },
  { name: 'Sun', sign: 'Capricorn', fullDegree: 277.03, house: 9, speed: 1.02 },
  { name: 'Moon', sign: 'Libra', fullDegree: 201.61, house: 6, speed: 13.05 },
  { name: 'Venus', sign: 'Scorpio', fullDegree: 237.15, house: 7, speed: 1.20 },
  { name: 'Mars', sign: 'Sagittarius', fullDegree: 261.78, house: 8, speed: 0.73 },
  { name: 'Mercury', sign: 'Sagittarius', fullDegree: 254.92, house: 8, speed: 1.08 },
  { name: 'Jupiter', sign: 'Virgo', fullDegree: 164.62, house: 5, speed: 0.005 },
  { name: 'Saturn', sign: 'Aquarius', fullDegree: 305.55, house: 10, speed: 0.11 },
  { name: 'Uranus', sign: 'Capricorn', fullDegree: 283.52, house: 9, speed: 0.06 },
  { name: 'Neptune', sign: 'Capricorn', fullDegree: 286.11, house: 9, speed: 0.04 },
  { name: 'Pluto', sign: 'Scorpio', fullDegree: 232.01, house: 7, speed: 0.03 },
];

describe('calculateTransitReport', () => {
  describe('Scenario 1: March 9 — Moon in 8th house, aspecting Venus', () => {
    // Tropical transit for March 9, 2026
    const transitPlanets = [
      { name: 'Sun', fullDegree: 348.63, sign: 'Pisces', speed: 1.00 },
      { name: 'Moon', fullDegree: 234.72, sign: 'Scorpio', speed: 11.96 },
      { name: 'Mercury', fullDegree: 345.11, sign: 'Pisces', speed: -1.00 },
      { name: 'Venus', fullDegree: 3.43, sign: 'Aries', speed: 1.24 },
      { name: 'Mars', fullDegree: 335.21, sign: 'Pisces', speed: 0.79 },
      { name: 'Jupiter', fullDegree: 105.09, sign: 'Cancer', speed: -0.006 },
      { name: 'Saturn', fullDegree: 2.72, sign: 'Aries', speed: 0.12 },
      { name: 'Uranus', fullDegree: 57.94, sign: 'Taurus', speed: 0.028 },
      { name: 'Neptune', fullDegree: 1.34, sign: 'Aries', speed: 0.037 },
      { name: 'Pluto', fullDegree: 304.75, sign: 'Aquarius', speed: 0.025 },
    ];

    let events;
    beforeAll(() => {
      events = calculateTransitReport(siderealNatal, tropicalNatal, transitPlanets);
    });

    it('shows Moon Transits the 8th House first', () => {
      expect(events[0].type).toBe('transit_house');
      expect(events[0].house).toBe(8);
      expect(events[0].description).toBe('Moon Transits the 8th House');
    });

    it('shows Moon conjunction Venus in 8th House', () => {
      const moonVenus = events.find(
        e => e.type === 'aspect' && e.transitPlanet === 'Moon' && e.natalPlanet === 'Venus'
      );
      expect(moonVenus).toBeDefined();
      expect(moonVenus.aspect).toBe('conjunction');
      expect(moonVenus.natalHouse).toBe(8);
      expect(moonVenus.description).toContain('Venus');
      expect(moonVenus.description).toContain('8th');
    });

    it('shows Venus ruler of 2nd House in 8th House', () => {
      const ruler2 = events.find(e => e.type === 'ruler' && e.rulesHouse === 2);
      expect(ruler2).toBeDefined();
      expect(ruler2.planet).toBe('Venus');
      expect(ruler2.inHouse).toBe(8);
      expect(ruler2.description).toBe('Venus ruler of the 2nd House in the 8th House');
    });

    it('shows Venus ruler of 7th House in 8th House', () => {
      const ruler7 = events.find(e => e.type === 'ruler' && e.rulesHouse === 7);
      expect(ruler7).toBeDefined();
      expect(ruler7.planet).toBe('Venus');
      expect(ruler7.inHouse).toBe(8);
      expect(ruler7.description).toBe('Venus ruler of the 7th House in the 8th House');
    });

    it('shows Mars in 8th (Dispositor)', () => {
      const dispositor = events.find(e => e.type === 'dispositor');
      expect(dispositor).toBeDefined();
      expect(dispositor.planet).toBe('Mars');
      expect(dispositor.house).toBe(8);
      expect(dispositor.description).toBe('Mars in 8th (Dispositor)');
    });
  });

  describe('Scenario 2: March 29 — Uranus opposition Venus ends, Moon in 5th', () => {
    // Tropical transit for March 29, 2026
    const transitPlanets = [
      { name: 'Sun', fullDegree: 8.52, sign: 'Aries', speed: 0.99 },
      { name: 'Moon', fullDegree: 141.92, sign: 'Leo', speed: 13.38 },
      { name: 'Mercury', fullDegree: 341.56, sign: 'Pisces', speed: 0.68 },
      { name: 'Venus', fullDegree: 28.20, sign: 'Aries', speed: 1.23 },
      { name: 'Mars', fullDegree: 350.93, sign: 'Pisces', speed: 0.78 },
      { name: 'Jupiter', fullDegree: 105.61, sign: 'Cancer', speed: 0.057 },
      { name: 'Saturn', fullDegree: 5.20, sign: 'Aries', speed: 0.12 },
      { name: 'Uranus', fullDegree: 58.64, sign: 'Taurus', speed: 0.042 },
      { name: 'Neptune', fullDegree: 2.10, sign: 'Aries', speed: 0.038 },
      { name: 'Pluto', fullDegree: 305.17, sign: 'Aquarius', speed: 0.017 },
    ];

    let events;
    beforeAll(() => {
      events = calculateTransitReport(siderealNatal, tropicalNatal, transitPlanets);
    });

    it('shows Uranus opposition Venus : Ends as first aspect', () => {
      const uranusVenus = events.find(
        e => e.type === 'aspect' && e.transitPlanet === 'Uranus'
      );
      expect(uranusVenus).toBeDefined();
      expect(uranusVenus.natalPlanet).toBe('Venus');
      expect(uranusVenus.aspect).toBe('opposition');
      expect(uranusVenus.isEnding).toBe(true);
      expect(uranusVenus.description).toBe('Uranus opposition Venus : Ends');
    });

    it('shows Venus ruler of 2nd and 7th House in 8th House', () => {
      const rulers = events.filter(e => e.type === 'ruler' && e.planet === 'Venus');
      expect(rulers.length).toBe(2);
      const houses = rulers.map(r => r.rulesHouse).sort();
      expect(houses).toEqual([2, 7]);
      rulers.forEach(r => expect(r.inHouse).toBe(8));
    });

    it('shows Mars in 8th (Dispositor)', () => {
      const dispositor = events.find(e => e.type === 'dispositor');
      expect(dispositor).toBeDefined();
      expect(dispositor.planet).toBe('Mars');
      expect(dispositor.house).toBe(8);
      expect(dispositor.description).toBe('Mars in 8th (Dispositor)');
    });

    it('shows Moon Transits the 5th House last', () => {
      const moonTransit = events.find(e => e.type === 'transit_house');
      expect(moonTransit).toBeDefined();
      expect(moonTransit.house).toBe(5);
      expect(moonTransit.description).toBe('Moon Transits the 5th House');
      // Moon should be last when outer planet story leads
      const lastEvent = events[events.length - 1];
      expect(lastEvent.type).toBe('transit_house');
    });
  });

  describe('Event ordering', () => {
    it('Moon transit house comes first when Moon aspects natal planets in its house', () => {
      const transit = [
        { name: 'Moon', fullDegree: 234.72, sign: 'Scorpio', speed: 13.0 },
      ];
      const events = calculateTransitReport(siderealNatal, tropicalNatal, transit);
      expect(events[0].type).toBe('transit_house');
      expect(events[0].planet).toBe('Moon');
    });

    it('outer planet aspect comes first when Moon has no house aspects', () => {
      const transit = [
        { name: 'Moon', fullDegree: 141.92, sign: 'Leo', speed: 13.38 },
        { name: 'Uranus', fullDegree: 58.64, sign: 'Taurus', speed: 0.042 },
      ];
      const events = calculateTransitReport(siderealNatal, tropicalNatal, transit);
      expect(events[0].type).toBe('aspect');
      expect(events[0].transitPlanet).toBe('Uranus');
    });

    it('ruler events come after aspects', () => {
      const transit = [
        { name: 'Moon', fullDegree: 234.72, sign: 'Scorpio', speed: 13.0 },
      ];
      const events = calculateTransitReport(siderealNatal, tropicalNatal, transit);
      const lastAspect = events.reduce((max, e, i) => e.type === 'aspect' ? i : max, -1);
      const firstRuler = events.findIndex(e => e.type === 'ruler');
      if (lastAspect !== -1 && firstRuler !== -1) {
        expect(firstRuler).toBeGreaterThan(lastAspect);
      }
    });
  });

  describe('Edge cases', () => {
    it('handles no aspects gracefully', () => {
      const minimalNatal = [
        { name: 'Ascendant', sign: 'Aries', fullDegree: 0, house: 1, speed: 0, signLord: 'Mars' },
      ];
      const minimalTropical = [
        { name: 'Ascendant', sign: 'Taurus', fullDegree: 30, house: 1, speed: 0 },
      ];
      const transit = [
        { name: 'Moon', fullDegree: 141, sign: 'Leo', speed: 13.0 },
      ];
      const events = calculateTransitReport(minimalNatal, minimalTropical, transit);
      expect(Array.isArray(events)).toBe(true);
      const moonTransit = events.find(e => e.type === 'transit_house');
      expect(moonTransit).toBeDefined();
      expect(moonTransit.house).toBe(5);
    });

    it('does not produce duplicate ruler entries', () => {
      const transit = [
        { name: 'Moon', fullDegree: 234.72, sign: 'Scorpio', speed: 13.0 },
        { name: 'Uranus', fullDegree: 237.0, sign: 'Scorpio', speed: 0.01 },
      ];
      const events = calculateTransitReport(siderealNatal, tropicalNatal, transit);
      const rulerKeys = events
        .filter(e => e.type === 'ruler')
        .map(e => `${e.planet}-${e.rulesHouse}-${e.inHouse}`);
      const uniqueKeys = [...new Set(rulerKeys)];
      expect(rulerKeys.length).toBe(uniqueKeys.length);
    });

    it('prioritizes outer aspects to personal planets over social planets', () => {
      // Uranus aspects Venus (personal) AND Pluto aspects Saturn (social)
      const transit = [
        { name: 'Moon', fullDegree: 141.92, sign: 'Leo', speed: 13.38 },
        { name: 'Uranus', fullDegree: 58.64, sign: 'Taurus', speed: 0.042 },
        { name: 'Pluto', fullDegree: 305.17, sign: 'Aquarius', speed: 0.017 },
      ];
      const events = calculateTransitReport(siderealNatal, tropicalNatal, transit);
      const aspect = events.find(e => e.type === 'aspect');
      expect(aspect).toBeDefined();
      // Venus (personal) should be chosen over Saturn (social)
      expect(aspect.natalPlanet).toBe('Venus');
    });
  });

  describe('SIGN_RULERS mapping', () => {
    it('Venus rules Taurus and Libra', () => {
      expect(SIGN_RULERS['Taurus']).toBe('Venus');
      expect(SIGN_RULERS['Libra']).toBe('Venus');
    });

    it('Mars rules Aries and Scorpio', () => {
      expect(SIGN_RULERS['Aries']).toBe('Mars');
      expect(SIGN_RULERS['Scorpio']).toBe('Mars');
    });

    it('all 12 signs have rulers', () => {
      for (const sign of SIGN_ORDER) {
        expect(SIGN_RULERS[sign]).toBeDefined();
      }
    });
  });

  describe('Dispositor logic', () => {
    it('identifies natal dispositor in same house', () => {
      // Venus signLord=Mars, both in house 8
      const transit = [
        { name: 'Moon', fullDegree: 234.72, sign: 'Scorpio', speed: 13.0 },
      ];
      const events = calculateTransitReport(siderealNatal, tropicalNatal, transit);
      const dispositor = events.find(e => e.type === 'dispositor');
      expect(dispositor).toBeDefined();
      expect(dispositor.planet).toBe('Mars');
      expect(dispositor.forPlanet).toBe('Venus');
      expect(dispositor.house).toBe(8);
    });

    it('does not include dispositor when sign lord is the planet itself', () => {
      const natal = [
        { name: 'Ascendant', sign: 'Aries', fullDegree: 0, house: 1, speed: 0, signLord: 'Mars' },
        { name: 'Mars', sign: 'Aries', fullDegree: 15, house: 1, speed: 0.7, signLord: 'Mars' },
      ];
      const trop = [
        { name: 'Ascendant', sign: 'Taurus', fullDegree: 30, house: 1, speed: 0 },
        { name: 'Mars', sign: 'Taurus', fullDegree: 39, house: 1, speed: 0.7 },
      ];
      const transit = [
        { name: 'Sun', fullDegree: 39, sign: 'Taurus', speed: 1.0 },
        { name: 'Moon', fullDegree: 200, sign: 'Libra', speed: 13.0 },
      ];
      const events = calculateTransitReport(natal, trop, transit);
      const selfDispositor = events.find(
        e => e.type === 'dispositor' && e.forPlanet === 'Mars' && e.planet === 'Mars'
      );
      expect(selfDispositor).toBeUndefined();
    });
  });
});
