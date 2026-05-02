/**
 * Investment-favorable Dasha evaluator.
 *
 * For a given dasha-period planet (MD/AD/PD/SD lord) and the native's natal
 * chart, determines whether that period is auspicious for investment /
 * speculation per the SuddenGainSigns reference (Vedic astrology rules):
 *
 *   • Best timing: lord of 5th, 8th, or 11th house in MD/AD.
 *   • Key houses for sudden gains: 2 (wealth), 5 (speculation/intuition),
 *     8 (sudden/unearned), 9 (fortune), 11 (gains).
 *   • Crucial speculation planets: Rahu (king of speculation), Mercury
 *     (intellect/quick decisions), Jupiter (long-term wealth), Moon
 *     (intuition), Venus (financial abundance).
 *   • Strong yogas: 5L–11L connection; 2L–11L parivartana; Jupiter–Rahu in
 *     kendra (1/4/7/10) or trikona (1/5/9); 8L well-placed in 2nd or 11th.
 *   • Warning combos: Rahu in 2nd (volatile money in/out); 5L/9L/11L in 12th
 *     (heavy losses); Moon–Rahu or Moon–Ketu conjunction (panic selling);
 *     Ketu transit over natal Venus (speculation losses — handled in transit
 *     analysis, not here).
 *
 * Returned reasons are short, human-readable strings; the UI renders them as
 * a bulleted list under each favorable period.
 */

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// Classical sign rulership. Rahu/Ketu have no classical rulership — they
// don't appear here, so they never get "lord of Nth house" reasons (only
// placement-based reasons), matching how speculative astrology treats them.
const SIGN_RULERS = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury',
  Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
  Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter',
  Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

const ORDINAL_SUFFIX = { 1: 'st', 2: 'nd', 3: 'rd' };
function ordinal(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${ORDINAL_SUFFIX[n % 10] || 'th'}`;
}

function signIndex(sign) {
  return SIGNS.indexOf(sign);
}

/** 1-indexed whole-sign house count from `fromSign` to `toSign` (1..12). */
function houseFromSign(fromSign, toSign) {
  return ((signIndex(toSign) - signIndex(fromSign) + 12) % 12) + 1;
}

/**
 * House numbers (1..12) that this planet rules for the given lagna sign.
 * E.g. for a Cancer lagna native, Saturn rules Capricorn (7th) and Aquarius
 * (8th) — so ownedHouses('Saturn', 'Cancer') === [7, 8].
 *
 * Rahu/Ketu return [] — no classical rulership.
 */
function ownedHouseNumbers(planet, lagnaSign) {
  if (!lagnaSign) return [];
  const out = [];
  for (const sign of SIGNS) {
    if (SIGN_RULERS[sign] === planet) {
      out.push(houseFromSign(lagnaSign, sign));
    }
  }
  return out.sort((a, b) => a - b);
}

const KENDRA_HOUSES = [1, 4, 7, 10];
const TRIKONA_HOUSES = [1, 5, 9];
const WEALTH_HOUSES = [2, 5, 8, 9, 11]; // 2 dhana, 5 speculation, 8 sudden, 9 fortune, 11 gains
const KEY_LORDSHIPS = [5, 8, 11];       // best for investment per SuddenGainSigns
const DUSTHANA_HOUSES = [6, 8, 12];

const SPECULATION_PLANETS = new Set(['Rahu', 'Jupiter', 'Mercury', 'Moon', 'Venus']);

/**
 * Evaluate whether the given dasha-period lord is favorable for investment,
 * given the native's natal chart.
 *
 * @param {string} planet - The dasha lord ('Sun', 'Moon', ..., 'Rahu', 'Ketu').
 * @param {Object} natalMap - { [planetName]: { sign, house, ... } } indexed
 *                            from natalPlanets; must include 'Ascendant'.
 * @returns {{ favorable: boolean, reasons: string[], warnings: string[] }}
 */
function evaluatePeriodForInvestment(planet, natalMap) {
  const reasons = [];
  const warnings = [];

  const planetData = natalMap[planet];
  const ascendant = natalMap.Ascendant;
  if (!planetData || !ascendant) {
    return { favorable: false, reasons, warnings };
  }

  const planetHouse = planetData.house;
  const lagnaSign = ascendant.sign;
  const owned = ownedHouseNumbers(planet, lagnaSign);

  // Rule 1 — Best timing: lord of 5th, 8th, or 11th house (the
  // "5L/8L/11L Mahadasha/Antardasha" rule from SuddenGainSigns).
  const ownedKey = owned.filter(h => KEY_LORDSHIPS.includes(h));
  if (ownedKey.length > 0) {
    const labels = ownedKey.map(h => `${ordinal(h)} (${HOUSE_KEY_LABEL[h]})`);
    reasons.push(
      `${planet} is lord of the ${labels.join(' and ')} house — the classical "best-timing" lordship for investment / speculation.`,
    );
  }

  // Rule 2 — Placement in wealth/gain houses (2/5/8/9/11). Listed
  // individually so the UI can show the most relevant rationale.
  if (planetHouse === 5) {
    reasons.push(
      `${planet} sits in the 5th house — Suta Bhava, the primary house of speculation, intelligence, and Purva Punya (lottery / windfalls).`,
    );
  }
  if (planetHouse === 11) {
    reasons.push(
      `${planet} sits in the 11th house — Labha Bhava, the house of gains, income, and fulfillment of desires.`,
    );
  }
  if (planetHouse === 2) {
    reasons.push(
      `${planet} sits in the 2nd house — Dhana Bhava, controlling wealth accumulation and savings.`,
    );
  }
  if (planetHouse === 9) {
    reasons.push(
      `${planet} sits in the 9th house — Bhagya Bhava, fortune and divine luck.`,
    );
  }
  if (planetHouse === 8 && planet !== 'Saturn') {
    // 8th gives sudden/unearned wealth; flag as favorable but
    // contextualized — Saturn-in-8 is more cautious.
    reasons.push(
      `${planet} sits in the 8th house — Randhra Bhava, governing sudden, unearned, or hidden wealth (windfalls, inheritance).`,
    );
  }

  // Rule 3 — Saturn in 10th (user-specified example): disciplined,
  // career-driven long-term gains. 10th is a kendra; Saturn there in
  // its own / friendly element rewards patience.
  if (planet === 'Saturn' && planetHouse === 10) {
    reasons.push(
      `Saturn in the 10th house — disciplined, long-term gains through career and steady investment (Saturn's kendra placement at its directional strength).`,
    );
  }

  // Rule 4 — Jupiter in 5th (user-specified example) and other
  // benefic kendra/trikona placements: speculative wealth + expansion.
  if (planet === 'Jupiter') {
    if (planetHouse === 5) {
      reasons.push(
        `Jupiter in the 5th house — Guru in Suta Bhava is the textbook "wisdom in speculation" placement (intuitive trading, profitable long-term picks).`,
      );
    } else if (KENDRA_HOUSES.includes(planetHouse) || TRIKONA_HOUSES.includes(planetHouse)) {
      reasons.push(
        `Jupiter in the ${ordinal(planetHouse)} house (${kendraTrikonaLabel(planetHouse)}) — Guru's wealth-expanding placement.`,
      );
    }
  }

  // Rule 5 — Rahu, the "King of Speculation": well-placed in
  // kendra/trikona/11 = fast and immense speculative gains.
  if (planet === 'Rahu') {
    if ([...KENDRA_HOUSES, ...TRIKONA_HOUSES, 11].includes(planetHouse)) {
      reasons.push(
        `Rahu in the ${ordinal(planetHouse)} house (${kendraTrikonaLabel(planetHouse) || '11th — gains'}) — the "King of Speculation" well-placed gives fast, unexpected gains in volatile markets.`,
      );
    }
  }

  // Rule 6 — Mercury rules technical analysis and quick decisions —
  // strong in 2/5/9/10/11.
  if (planet === 'Mercury') {
    if ([2, 5, 9, 10, 11].includes(planetHouse)) {
      reasons.push(
        `Mercury in the ${ordinal(planetHouse)} house — sharp intellect for technical analysis and quick decision-making.`,
      );
    }
  }

  // Rule 7 — Venus brings financial abundance and luxury — strong in
  // benefic placements.
  if (planet === 'Venus') {
    if ([1, 2, 4, 5, 7, 9, 10, 11].includes(planetHouse)) {
      reasons.push(
        `Venus in the ${ordinal(planetHouse)} house — Shukra brings financial abundance, luxury, and material comfort.`,
      );
    }
  }

  // Rule 8 — Moon governs intuition. Strong Moon = good investor
  // psychology. 11th, 2nd, 9th, 5th are favorable.
  if (planet === 'Moon') {
    if ([2, 5, 9, 11].includes(planetHouse)) {
      reasons.push(
        `Moon in the ${ordinal(planetHouse)} house — strong investor intuition and emotional stability under volatility.`,
      );
    }
  }

  // ── Warning combos (still flag the period but warn the user) ────────
  // Rahu in 2nd — money comes quickly but leaves faster.
  if (planet === 'Rahu' && planetHouse === 2) {
    warnings.push(
      `Rahu in the 2nd house — money may arrive fast but leaves faster (high volatility / over-leverage risk).`,
    );
  }
  // 5L / 9L / 11L in 12th — heavy losses risk.
  if (planetHouse === 12) {
    const offendingLordships = owned.filter(h => [5, 9, 11].includes(h));
    if (offendingLordships.length > 0) {
      const lordList = offendingLordships.map(h => `${ordinal(h)} lord`).join(' / ');
      warnings.push(
        `${planet} (${lordList}) in the 12th house — classical loss combination; cap position sizes.`,
      );
    }
  }
  // Moon-Rahu / Moon-Ketu conjunction (panic selling). Detect via same-sign
  // placement of Moon and Rahu/Ketu; only fires when the dasha lord is one
  // of them.
  if (planet === 'Moon' || planet === 'Rahu' || planet === 'Ketu') {
    const moon = natalMap.Moon;
    const rahu = natalMap.Rahu;
    const ketu = natalMap.Ketu;
    if (moon && rahu && moon.sign === rahu.sign && (planet === 'Moon' || planet === 'Rahu')) {
      warnings.push(
        `Moon–Rahu conjunction in the natal chart — emotional impulsivity / panic selling risk.`,
      );
    }
    if (moon && ketu && moon.sign === ketu.sign && (planet === 'Moon' || planet === 'Ketu')) {
      warnings.push(
        `Moon–Ketu conjunction in the natal chart — detachment-driven exits / panic selling risk.`,
      );
    }
  }

  // Period is "favorable" if at least one positive reason fired. Warnings
  // alone (without any positives) keep favorable=false so the UI doesn't
  // green-light a clearly cautious period.
  return {
    favorable: reasons.length > 0,
    reasons,
    warnings,
  };
}

const HOUSE_KEY_LABEL = {
  5: 'speculation',
  8: 'sudden gains',
  11: 'income & gains',
};

function kendraTrikonaLabel(house) {
  if (KENDRA_HOUSES.includes(house) && TRIKONA_HOUSES.includes(house)) {
    return 'kendra & trikona';
  }
  if (KENDRA_HOUSES.includes(house)) return 'kendra';
  if (TRIKONA_HOUSES.includes(house)) return 'trikona';
  return '';
}

/**
 * Build a natalMap (planet name → planet object) from the natalPlanets
 * array returned by the kerykeion bridge. Includes the Ascendant entry.
 */
function planetMap(natalPlanets) {
  return Object.fromEntries((natalPlanets || []).map(p => [p.name, p]));
}

/**
 * Annotate a list of dasha periods with investment favorability. Each
 * input period must carry { planet, startDate, endDate }. Returns a new
 * array — does not mutate the inputs.
 */
function annotatePeriods(periods, natalMap) {
  return (periods || []).map(p => {
    const evalResult = evaluatePeriodForInvestment(p.planet, natalMap);
    return {
      planet: p.planet,
      startDate: p.startDate instanceof Date ? p.startDate.toISOString() : p.startDate,
      endDate: p.endDate instanceof Date ? p.endDate.toISOString() : p.endDate,
      favorable: evalResult.favorable,
      reasons: evalResult.reasons,
      warnings: evalResult.warnings,
    };
  });
}

module.exports = {
  evaluatePeriodForInvestment,
  annotatePeriods,
  ownedHouseNumbers,
  planetMap,
};
