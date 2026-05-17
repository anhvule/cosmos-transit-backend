/**
 * Shared Vedic-astrology rule sets for speculative gain / loss detection.
 *
 * Sourced from SuddenGainSigns.docx and SuddenLossesSigns.docx — these are
 * the same rule arrays previously defined inside getInvestmentGainDaysForMonth
 * and getInvestmentLossDaysForMonth in astrology_kerykeion_bridge.js. Extracted
 * so the market-signal aggregator can reuse them without re-implementing the
 * Vedic logic.
 *
 * Each rule has:
 *   - id:     stable identifier
 *   - label:  human-readable description
 *   - weight: (loss rules only) statistical weight from historical frequency
 *   - check(dayEvents, dayHouses): returns falsey or a description string when
 *                                  the day's transits trigger the rule
 *
 * Loss-rule weights are calibrated from a historical loss-date frequency
 * analysis: moon_node_aspect=9 (49%), mercury_sun_mars=8 (17%),
 * mars_mars=7 (13%), rahu_ketu_jup_ven=6 (10%), moon_12th=5 (10%),
 * moon_6th=4 (9%), mercury_jup_5th=3 (6%), moon_8th=2 (6%),
 * sun_rahu=1 (3%), saturn_8th=1.
 */

const BENEFIC_ASPECTS = new Set(['conjunction', 'trine', 'sextile']);

const LOSS_RULES = [
  {
    id: 'moon_node_aspect',
    weight: 9,
    label: 'Moon conjunction/opposition Rahu or Ketu (Grahan Yoga — panic trading, high-beta risk)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ev.transitPlanet === 'Moon' &&
        ['Rahu', 'Ketu'].includes(ev.natalPlanet) &&
        ['conjunction', 'opposition'].includes(ev.aspect),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'mercury_sun_mars_overtrading',
    weight: 8,
    label: 'Mercury or Sun aspecting natal Mars in 6th/8th/12th House (overtrading, impulsive decisions)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ['Mercury', 'Sun'].includes(ev.transitPlanet) &&
        ev.natalPlanet === 'Mars' &&
        [6, 8, 12].includes(ev.natalHouse),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'mars_mars_overtrading',
    weight: 7,
    label: 'Mars aspecting natal Mars in 6th/8th/12th House (over-aggressive trading, overtrading)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ev.transitPlanet === 'Mars' &&
        ev.natalPlanet === 'Mars' &&
        [6, 8, 12].includes(ev.natalHouse),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'rahu_ketu_on_jupiter_venus',
    weight: 6,
    label: 'Rahu/Ketu transiting natal Jupiter or Venus (high-risk investment period)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ['Rahu', 'Ketu'].includes(ev.transitPlanet) &&
        ['Jupiter', 'Venus'].includes(ev.natalPlanet),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'moon_12th_house',
    weight: 5,
    label: 'Moon in 12th House (losses, hidden expenses)',
    check: (_events, houses) => houses['Moon'] === 12 && 'Moon in 12th House',
  },
  {
    id: 'moon_6th_house',
    weight: 4,
    label: 'Moon in 6th House (disputes, conflict, obstacles)',
    check: (_events, houses) => houses['Moon'] === 6 && 'Moon in 6th House',
  },
  {
    id: 'mercury_jupiter_5th_overtrading',
    weight: 3,
    label: 'Mercury aspecting natal Jupiter in 5th House (overconfident speculation, overtrading)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ev.transitPlanet === 'Mercury' &&
        ev.natalPlanet === 'Jupiter' &&
        ev.natalHouse === 5,
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'moon_8th_house',
    weight: 2,
    label: 'Moon in 8th House (sudden events, unexpected losses)',
    check: (_events, houses) => houses['Moon'] === 8 && 'Moon in 8th House',
  },
  {
    id: 'sun_rahu_grahan',
    weight: 1,
    label: 'Sun aspecting natal Rahu/Ketu (Grahan Yoga — ego-driven wrong decisions)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ev.transitPlanet === 'Sun' &&
        ['Rahu', 'Ketu'].includes(ev.natalPlanet),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'saturn_8th_house',
    weight: 1,
    label: 'Saturn in 8th House (Ashtam Shani — unpredictable financial setbacks)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'transit_house' &&
        ev.planet === 'Saturn' &&
        ev.house === 8,
      );
      return e ? e.description : false;
    },
  },
];

const GAIN_RULES = [
  {
    id: 'moon_5th_house',
    weight: 3,
    label: 'Moon in 5th House (speculation, intuition, past-life merits)',
    check: (_events, houses) => houses['Moon'] === 5 && 'Moon in 5th House',
  },
  {
    id: 'moon_11th_house',
    weight: 3,
    label: 'Moon in 11th House (gains, income, fulfilled desires)',
    check: (_events, houses) => houses['Moon'] === 11 && 'Moon in 11th House',
  },
  {
    id: 'moon_2nd_house',
    weight: 2,
    label: 'Moon in 2nd House (wealth accumulation)',
    check: (_events, houses) => houses['Moon'] === 2 && 'Moon in 2nd House',
  },
  {
    id: 'moon_9th_house',
    weight: 2,
    label: 'Moon in 9th House (fortune, divine luck)',
    check: (_events, houses) => houses['Moon'] === 9 && 'Moon in 9th House',
  },
  {
    id: 'chandra_mangal',
    weight: 4,
    label: 'Moon conjunct/trine/sextile natal Mars (Chandra-Mangal Yoga — aggressive, successful trading)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ev.transitPlanet === 'Moon' &&
        ev.natalPlanet === 'Mars' &&
        BENEFIC_ASPECTS.has(ev.aspect),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'moon_jupiter',
    weight: 4,
    label: 'Moon conjunct/trine/sextile natal Jupiter (expansion, good intuition, luck)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ev.transitPlanet === 'Moon' &&
        ev.natalPlanet === 'Jupiter' &&
        BENEFIC_ASPECTS.has(ev.aspect),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'moon_venus',
    weight: 3,
    label: 'Moon conjunct/trine/sextile natal Venus (financial abundance, material comfort)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ev.transitPlanet === 'Moon' &&
        ev.natalPlanet === 'Venus' &&
        BENEFIC_ASPECTS.has(ev.aspect),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'jupiter_gain_house',
    weight: 5,
    label: 'Jupiter transiting 5th or 11th House (expansion in speculation/gains)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'transit_house' &&
        ev.planet === 'Jupiter' &&
        [5, 11].includes(ev.house),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'venus_jupiter_gain',
    weight: 4,
    label: 'Venus aspecting natal Jupiter in 5th/11th House (abundance in speculation)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ev.transitPlanet === 'Venus' &&
        ev.natalPlanet === 'Jupiter' &&
        [5, 11].includes(ev.natalHouse) &&
        BENEFIC_ASPECTS.has(ev.aspect),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'sun_jupiter_5th',
    weight: 3,
    label: 'Sun aspecting natal Jupiter in 5th House (luck and success in speculation)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ev.transitPlanet === 'Sun' &&
        ev.natalPlanet === 'Jupiter' &&
        ev.natalHouse === 5 &&
        BENEFIC_ASPECTS.has(ev.aspect),
      );
      return e ? e.description : false;
    },
  },
  {
    id: 'mercury_venus_gain',
    weight: 3,
    label: 'Mercury aspecting natal Venus in 2nd/5th/9th/11th House (quick, profitable trading decisions)',
    check: (events) => {
      const e = events.find(ev =>
        ev.type === 'aspect' &&
        ev.transitPlanet === 'Mercury' &&
        ev.natalPlanet === 'Venus' &&
        [2, 5, 9, 11].includes(ev.natalHouse) &&
        BENEFIC_ASPECTS.has(ev.aspect),
      );
      return e ? e.description : false;
    },
  },
];

/**
 * Evaluate one day's events against a rule set.
 * Returns { signs: [{ id, label, weight, description }], topWeight }.
 */
function evaluateRules(rules, dayEvents, dayHouses) {
  const signs = [];
  let topWeight = 0;
  for (const rule of rules) {
    const result = rule.check(dayEvents, dayHouses);
    if (result) {
      signs.push({
        id: rule.id,
        label: rule.label,
        weight: rule.weight,
        description: typeof result === 'string' ? result : null,
      });
      if (rule.weight > topWeight) topWeight = rule.weight;
    }
  }
  return { signs, topWeight };
}

module.exports = {
  LOSS_RULES,
  GAIN_RULES,
  evaluateRules,
};
