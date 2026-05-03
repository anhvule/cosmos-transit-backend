/**
 * Investment-favorable Dasha evaluator.
 *
 * For a given dasha-period planet (MD/AD/PD/SD lord) and the native's natal
 * chart, determines whether that period is auspicious for speculative
 * investment per two reference docs:
 *
 *   SuddenGainSigns.docx — natal-chart placement / lordship rules:
 *     • Best timing: lord of 5th, 8th, or 11th house in MD/AD.
 *     • Key houses for sudden gains: 2 (wealth), 5 (speculation/intuition),
 *       8 (sudden/unearned), 9 (fortune), 11 (gains).
 *     • Crucial speculation planets: Rahu (king of speculation), Mercury
 *       (intellect/quick decisions), Jupiter (long-term wealth), Moon
 *       (intuition), Venus (financial abundance).
 *     • Strong yogas: 5L–11L connection; 2L–11L parivartana; Jupiter–Rahu
 *       in kendra (1/4/7/10) or trikona (1/5/9); 8L well-placed in 2nd
 *       or 11th.
 *     • Warning combos: Rahu in 2nd (volatile money in/out); 5L/9L/11L
 *       in 12th (heavy losses); Moon–Rahu or Moon–Ketu conjunction
 *       (panic selling); Ketu transit over natal Venus (speculation
 *       losses — handled in transit analysis, not here).
 *
 *   Dasha.docx — Mahadasha-level speculation rules:
 *     • Rahu / Mercury / Mars Mahadashas are the "best for speculation"
 *       provided the planet is well-placed (own sign, exalted, or in
 *       2/5/8/11). Debilitated → no positives, mark as caution.
 *     • Specific MD–AD speculation pairs: Mercury–Sun (high-paying deals),
 *       Jupiter–Venus (property appreciation), Venus–Mercury (high-tech /
 *       creative investments).
 *     • Dasha strength: results are positive only if the planet is
 *       well-placed; a debilitated planet kills the favorability.
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

// Mahadasha-level "best for speculation" planets per Dasha.docx — these
// are the dashas the doc explicitly calls out as speculation-friendly when
// the planet is well-placed.
const SPECULATION_MD_PLANETS = new Set(['Rahu', 'Mercury', 'Mars']);

// Classical dignity tables. `own` = planet's own signs (rulership),
// `exalt` = sign of exaltation (debilitation is the opposite sign).
// Rahu/Ketu have no classical dignity; some texts give Rahu→Aquarius,
// Ketu→Scorpio as quasi-rulerships, but we omit them here so the
// favorability logic stays conservative for the nodes (placement-based
// only).
const DIGNITY = {
  Sun:     { own: ['Leo'],            exalt: 'Aries',     debil: 'Libra' },
  Moon:    { own: ['Cancer'],         exalt: 'Taurus',    debil: 'Scorpio' },
  Mars:    { own: ['Aries', 'Scorpio'],     exalt: 'Capricorn', debil: 'Cancer' },
  Mercury: { own: ['Gemini', 'Virgo'],      exalt: 'Virgo',     debil: 'Pisces' },
  Jupiter: { own: ['Sagittarius', 'Pisces'],exalt: 'Cancer',    debil: 'Capricorn' },
  Venus:   { own: ['Taurus', 'Libra'],      exalt: 'Pisces',    debil: 'Virgo' },
  Saturn:  { own: ['Capricorn', 'Aquarius'],exalt: 'Libra',     debil: 'Aries' },
};

/**
 * Classify a planet's dignity from its natal sign:
 *   "exalted" | "own" | "debilitated" | "neutral" | null (no data).
 */
function planetDignity(planet, sign) {
  const d = DIGNITY[planet];
  if (!d || !sign) return null;
  if (d.exalt === sign) return 'exalted';
  if ((d.own || []).includes(sign)) return 'own';
  if (d.debil === sign) return 'debilitated';
  return 'neutral';
}

/**
 * Specific MD–AD speculation pairs called out in Dasha.docx. Map keys are
 * MD planet → list of { ad, label }.
 */
const FAVORABLE_MD_AD_PAIRS = {
  Mercury: [{ ad: 'Sun',     label: 'high-paying deals (per Dasha.docx)' }],
  Jupiter: [{ ad: 'Venus',   label: 'property appreciation (per Dasha.docx)' }],
  Venus:   [{ ad: 'Mercury', label: 'high-tech / creative investments (per Dasha.docx)' }],
};

/**
 * Two natal planets share the same sign (i.e. natal conjunction). Used by
 * the Budh-Aditya / Venus-Mars / Sun-Saturn / Moon-Rahu / 5L-10L / 5L-11L
 * combination rules pulled from the jyotishlight + explogalore articles.
 *
 * Returns false (not throws) on any missing data so a partially-resolved
 * natal chart can't take down the evaluator.
 */
function sameSign(natalMap, planetA, planetB) {
  const a = natalMap[planetA];
  const b = natalMap[planetB];
  return !!(a && b && a.sign && a.sign === b.sign);
}

/**
 * The native's nth-house lord (planet ruling the sign N houses from
 * lagna). Returns null if natalMap doesn't carry a usable lagna sign.
 */
function houseLord(lagnaSign, n) {
  if (!lagnaSign) return null;
  const idx = signIndex(lagnaSign);
  if (idx < 0) return null;
  const sign = SIGNS[(idx + (n - 1) + 12) % 12];
  return SIGN_RULERS[sign] || null;
}

/**
 * Evaluate whether the given dasha-period lord is favorable for investment,
 * given the native's natal chart.
 *
 * @param {string} planet - The dasha lord ('Sun', 'Moon', ..., 'Rahu', 'Ketu').
 * @param {Object} natalMap - { [planetName]: { sign, house, ... } } indexed
 *                            from natalPlanets; must include 'Ascendant'.
 * @param {Object} [opts]
 * @param {string} [opts.parentPlanet] - The parent dasha lord one level up
 *   (e.g. the MD planet when evaluating an AD). Lets us fire MD–AD pair
 *   rules from Dasha.docx (Mercury–Sun, Jupiter–Venus, Venus–Mercury).
 * @param {string} [opts.level] - 'mahadasha' | 'antardasha' | 'pratyantardasha' |
 *   'sookshmadasha'. The Mahadasha-level speculation rule (Rahu/Mercury/
 *   Mars MD) fires for level==='mahadasha' only — sub-periods are still
 *   evaluated by placement / lordship rules.
 * @returns {{ favorable: boolean, reasons: string[], warnings: string[] }}
 */
function evaluatePeriodForInvestment(planet, natalMap, opts = {}) {
  const { parentPlanet, level } = opts;
  const reasons = [];
  const warnings = [];

  const planetData = natalMap[planet];
  const ascendant = natalMap.Ascendant;
  if (!planetData || !ascendant) {
    return { favorable: false, reasons, warnings };
  }

  const planetHouse = planetData.house;
  const planetSign = planetData.sign;
  const lagnaSign = ascendant.sign;
  const owned = ownedHouseNumbers(planet, lagnaSign);
  const dignity = planetDignity(planet, planetSign);

  // ── Hard-stop rule from Dasha.docx ──────────────────────────────────
  // Debilitated dasha lord — kills positive favorability. Doc states the
  // results are positive ONLY if the planet is well-placed; debilitation
  // = no positives, surface as a warning instead.
  if (dignity === 'debilitated') {
    warnings.push(
      `${planet} is debilitated in ${planetSign} — Dasha.docx: dasha results require a well-placed planet, debilitation negates speculation gains.`,
    );
    return { favorable: false, reasons, warnings };
  }

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
  // ── Article-sourced combination rules (jyotishlight + explogalore) ──
  // These fire for any dasha level; the planet under evaluation must be
  // one of the two participants (otherwise an unrelated dasha would
  // inherit a yoga it doesn't actually trigger).

  // Mars in 2nd — impulsive trading / snap-decision losses.
  if (planet === 'Mars' && planetHouse === 2) {
    warnings.push(
      `Mars in the 2nd house — impulsive energy in money matters can cause snap-decision losses; trade with discipline (explogalore).`,
    );
  }

  // Budh-Aditya Yoga: Sun + Mercury same sign in 2/5/9/11 — wise market
  // analysis, recognizing lucrative opportunities.
  if ((planet === 'Sun' || planet === 'Mercury') &&
      sameSign(natalMap, 'Sun', 'Mercury')) {
    const yogaHouse = natalMap.Sun?.house;
    if ([2, 5, 9, 11].includes(yogaHouse)) {
      reasons.push(
        `Budh–Aditya Yoga in the ${ordinal(yogaHouse)} house (Sun + Mercury) — sharp analytical edge for recognizing lucrative trades (explogalore).`,
      );
    }
  }

  // Venus-Mars conjunction — Mars's courage tempered by Venus's
  // judgment, optimal entry/exit timing.
  if ((planet === 'Venus' || planet === 'Mars') &&
      sameSign(natalMap, 'Venus', 'Mars')) {
    reasons.push(
      `Venus–Mars conjunction in the natal chart — Mars's courage balanced by Venus's judgment, sharp entry/exit timing (explogalore).`,
    );
  }

  // Sun-Saturn combination — methodical, disciplined long-term approach.
  if ((planet === 'Sun' || planet === 'Saturn') &&
      sameSign(natalMap, 'Sun', 'Saturn')) {
    reasons.push(
      `Sun–Saturn combination in the natal chart — methodical, disciplined approach; resistance to irrational trades and steady wealth compounding (explogalore).`,
    );
  }

  // Moon-Rahu in 5th — emotional intelligence + bold innovation, success
  // in high-risk speculation (crypto, derivatives). Note: in any OTHER
  // house this conjunction is the panic-selling warning below.
  const moonRahuConj = sameSign(natalMap, 'Moon', 'Rahu');
  if (moonRahuConj && natalMap.Moon?.house === 5 &&
      (planet === 'Moon' || planet === 'Rahu')) {
    reasons.push(
      `Moon–Rahu conjunction in the 5th house — emotional intelligence fused with bold innovation, success in high-risk speculation like crypto / derivatives (explogalore).`,
    );
  }

  // Jupiter in 11th — attracts unexpected profits / windfalls.
  if (planet === 'Jupiter' && planetHouse === 11) {
    reasons.push(
      `Jupiter in the 11th house — Guru in Labha Bhava attracts unexpected profits and amplifies networking-driven gains (explogalore).`,
    );
  }
  // Mercury in 11th — multiple revenue streams.
  if (planet === 'Mercury' && planetHouse === 11) {
    reasons.push(
      `Mercury in the 11th house — Budh in Labha Bhava builds multiple revenue streams and analytical income channels (explogalore).`,
    );
  }

  // Strong 5L (own / exalted) — natural speculation timing.
  if (owned.includes(5) && (dignity === 'exalted' || dignity === 'own')) {
    reasons.push(
      `${planet} (5th lord) is ${dignity === 'exalted' ? 'exalted' : 'in own sign'} — direct timing advantage for natural profitable speculation (explogalore).`,
    );
  }

  // 5L + 10L conjunction — professional investment career.
  // 5L + 11L conjunction — strong 5-11 axis (large speculative profits).
  const fifthLord  = houseLord(lagnaSign, 5);
  const tenthLord  = houseLord(lagnaSign, 10);
  const elevenLord = houseLord(lagnaSign, 11);
  if (fifthLord && tenthLord && fifthLord !== tenthLord &&
      (planet === fifthLord || planet === tenthLord) &&
      sameSign(natalMap, fifthLord, tenthLord)) {
    reasons.push(
      `5th lord (${fifthLord}) + 10th lord (${tenthLord}) conjunction — professional investment career indication (jyotishlight).`,
    );
  }
  if (fifthLord && elevenLord && fifthLord !== elevenLord &&
      (planet === fifthLord || planet === elevenLord) &&
      sameSign(natalMap, fifthLord, elevenLord)) {
    reasons.push(
      `5th lord (${fifthLord}) + 11th lord (${elevenLord}) conjunction — strong 5-11 axis activation, large speculative profits (jyotishlight + SuddenGainSigns).`,
    );
  }

  // Moon-Rahu / Moon-Ketu conjunction (panic selling). Detect via same-sign
  // placement of Moon and Rahu/Ketu; only fires when the dasha lord is one
  // of them. Skipped when the conjunction is in the 5th house (handled as
  // a positive reason above).
  if (planet === 'Moon' || planet === 'Rahu' || planet === 'Ketu') {
    const moon = natalMap.Moon;
    const rahu = natalMap.Rahu;
    const ketu = natalMap.Ketu;
    if (moonRahuConj && moon?.house !== 5 &&
        (planet === 'Moon' || planet === 'Rahu')) {
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

  // ── Dasha.docx rules ────────────────────────────────────────────────
  // Rule D1 — Mahadasha-level speculation friendly planets (Rahu, Mercury,
  // Mars). Only fires for the actual Mahadasha; sub-periods inherit the
  // generic placement/lordship logic above. Requires the planet to be
  // well-placed (own / exalted / in 2/5/8/11) — a debilitated MD already
  // returned early at the top of this function.
  if (level === 'mahadasha' && SPECULATION_MD_PLANETS.has(planet)) {
    const wellPlaced =
      dignity === 'exalted' ||
      dignity === 'own' ||
      [2, 5, 8, 11].includes(planetHouse);
    if (wellPlaced) {
      const placeNote = dignity === 'exalted'
        ? `exalted in ${planetSign}`
        : dignity === 'own'
        ? `in own sign ${planetSign}`
        : `in the ${ordinal(planetHouse)} house`;
      const planetNote = {
        Rahu:    'sudden gains and unexpected windfalls (high risk; manage greed)',
        Mercury: 'trading, business acumen, and short-term speculative profits',
        Mars:    'risk-taking and aggressive investments (caution: can also trigger losses)',
      }[planet];
      reasons.push(
        `${planet} Mahadasha (${placeNote}) — Dasha.docx flags it as one of the best mahadashas for speculation: ${planetNote}.`,
      );
    } else if (dignity !== 'debilitated') {
      // Speculation-friendly MD planet but not well-placed → don't promote
      // but note why we didn't.
      warnings.push(
        `${planet} Mahadasha is normally good for speculation, but here ${planet} is in the ${ordinal(planetHouse)} house and not in own / exalted / 2-5-8-11 — Dasha.docx requires "well-placed" for the period to deliver.`,
      );
    }
  }

  // Rule D2 — Specific MD–AD speculation pairs (Mercury–Sun,
  // Jupiter–Venus, Venus–Mercury). Only fires when we know the parent
  // (i.e. when evaluating an AD inside a known MD).
  if (parentPlanet && level === 'antardasha') {
    const pairs = FAVORABLE_MD_AD_PAIRS[parentPlanet] || [];
    for (const pair of pairs) {
      if (pair.ad === planet) {
        reasons.push(
          `${parentPlanet}–${planet} antardasha — Dasha.docx flags this pair as favorable for ${pair.label}.`,
        );
      }
    }
  }

  // Rule D3 — Dignity bonus. Exalted / own-sign placement gets an extra
  // confidence reason (only attached when other positives have already
  // fired, so a generic exaltation alone doesn't auto-favor an otherwise
  // unrelated period).
  if (reasons.length > 0) {
    if (dignity === 'exalted') {
      reasons.push(
        `Bonus: ${planet} is exalted in ${planetSign} — peak strength amplifies the dasha's results (Dasha.docx: "well-placed" planet rule).`,
      );
    } else if (dignity === 'own') {
      reasons.push(
        `Bonus: ${planet} is in its own sign ${planetSign} — strong, stable expression (Dasha.docx: "well-placed" planet rule).`,
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
 *
 * @param {Array} periods - List of { planet, startDate, endDate }.
 * @param {Object} natalMap - From `planetMap(natalPlanets)`.
 * @param {Object} [opts]
 * @param {string} [opts.parentPlanet] - Dasha lord one level up (MD when
 *   annotating ADs, AD when annotating PDs, PD when annotating SDs). Lets
 *   the MD–AD pair rule fire on AD lists.
 * @param {string} [opts.level] - 'mahadasha' | 'antardasha' | 'pratyantardasha'
 *   | 'sookshmadasha'. Drives level-specific rules (Mahadasha speculation
 *   list, MD–AD pairs).
 */
function annotatePeriods(periods, natalMap, opts = {}) {
  const { parentPlanet, level } = opts;
  return (periods || []).map(p => {
    const evalResult = evaluatePeriodForInvestment(p.planet, natalMap, {
      parentPlanet,
      level,
    });
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

/**
 * Annotate a single period (e.g. the active MD / AD / PD / SD) — same
 * shape as annotatePeriods entries. Returns null when `period` is null.
 */
function annotatePeriod(period, natalMap, opts = {}) {
  if (!period) return null;
  const evalResult = evaluatePeriodForInvestment(period.planet, natalMap, opts);
  return {
    planet: period.planet,
    startDate: period.startDate instanceof Date
      ? period.startDate.toISOString()
      : period.startDate,
    endDate: period.endDate instanceof Date
      ? period.endDate.toISOString()
      : period.endDate,
    favorable: evalResult.favorable,
    reasons: evalResult.reasons,
    warnings: evalResult.warnings,
  };
}

module.exports = {
  evaluatePeriodForInvestment,
  annotatePeriods,
  annotatePeriod,
  ownedHouseNumbers,
  planetDignity,
  planetMap,
};
