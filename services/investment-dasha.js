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
 *   Conservative-mode tightening (vs the liberal early implementation):
 *     • 8L lordship counts as favorable ONLY when 8L is placed in 2nd or
 *       11th (strict SuddenGainSigns reading). 8L in own 8th or anywhere
 *       else surfaces as a "dual-edged" warning.
 *     • ANY planet placed in the 8th house downgrades to a CAUTION
 *       warning (was previously a positive for non-Saturn). Mars-in-own
 *       Scorpio in 8th is still cautious — Randhra is a dusthana.
 *     • Rahu / Ketu placement positives (in 2/5/9/11 and the
 *       King-of-Speculation kendra/trikona rule) require benefic
 *       restraint — Jupiter or Venus aspecting / sitting in the same
 *       house. Unrestrained shadow planets emit the explogalore
 *       "unbalanced Rahu" warning instead.
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

/** Sign that is `n` houses from `lagnaSign` (1-indexed; 1 = lagna sign). */
function signAtHouse(lagnaSign, n) {
  if (!lagnaSign) return null;
  const idx = signIndex(lagnaSign);
  if (idx < 0) return null;
  return SIGNS[(idx + (n - 1) + 12) % 12];
}

const MALEFICS = new Set(['Saturn', 'Mars', 'Rahu', 'Ketu']);

/**
 * Papakartari Yoga ("structural strangulation") for a given house —
 * fires when the immediately PRECEDING and FOLLOWING houses are both
 * occupied by malefics (Saturn / Mars / Rahu / Ketu). Classical Vedic
 * reading: the house's significations are "hemmed in" — the wealth
 * (h2) or gains (h11) flow gets choked even when the chart looks
 * otherwise favorable.
 *
 * Returns { prevMalefic, nextMalefic, prevHouse, nextHouse } describing
 * the trapping malefics, or null if the house is not papakartari.
 */
function papakartariFor(houseNum, natalMap, lagnaSign) {
  if (!lagnaSign || houseNum < 1 || houseNum > 12) return null;
  const prevHouseNum = houseNum === 1 ? 12 : houseNum - 1;
  const nextHouseNum = houseNum === 12 ? 1 : houseNum + 1;
  const prevSign = signAtHouse(lagnaSign, prevHouseNum);
  const nextSign = signAtHouse(lagnaSign, nextHouseNum);
  let prevMalefic = null;
  let nextMalefic = null;
  for (const name of MALEFICS) {
    const p = natalMap[name];
    if (!p?.sign) continue;
    if (p.sign === prevSign) prevMalefic = prevMalefic || name;
    if (p.sign === nextSign) nextMalefic = nextMalefic || name;
  }
  if (prevMalefic && nextMalefic) {
    return { prevMalefic, nextMalefic, prevHouse: prevHouseNum, nextHouse: nextHouseNum };
  }
  return null;
}

// ── Aspect helpers (Vedic graha drishti) ──────────────────────────────
// Each planet aspects the 7th from itself; Mars also 4th and 8th,
// Jupiter 5th and 9th, Saturn 3rd and 10th, and (per Brihat Parashara)
// Rahu/Ketu 5th/7th/9th. We use 1-indexed offsets where 1 = same sign
// (so the 7th aspect = offset 7, etc.).
const ASPECT_OFFSETS = {
  Mars:    [7, 4, 8],
  Jupiter: [7, 5, 9],
  Saturn:  [7, 3, 10],
  Rahu:    [7, 5, 9],
  Ketu:    [7, 5, 9],
};
function planetAspectsHouse(planet, planetHouse, targetHouse) {
  if (!planetHouse || !targetHouse) return false;
  const offsets = ASPECT_OFFSETS[planet] || [7];
  return offsets.some(off => (((planetHouse - 1 + (off - 1)) % 12) + 1) === targetHouse);
}

/**
 * Whether a benefic (Jupiter or Venus) is influencing `targetHouse` by
 * either sitting in it or aspecting it. Used to gate Rahu / Ketu
 * placements per the explogalore "unrestrained Rahu" warning.
 *
 * Mercury's beneficity flips with company (malefic if joining malefics)
 * so we treat it as neutral here for the conservative ruleset.
 */
function hasBeneficInfluence(natalMap, targetHouse) {
  for (const beneficName of ['Jupiter', 'Venus']) {
    const b = natalMap[beneficName];
    if (!b || !b.house) continue;
    if (b.house === targetHouse) return { source: beneficName, kind: 'conjunction' };
    if (planetAspectsHouse(beneficName, b.house, targetHouse)) {
      return { source: beneficName, kind: 'aspect' };
    }
  }
  return null;
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

  // ── Debilitation: soft penalty (per AMZN backtest feedback) ────────
  // Previously a hard-stop that auto-failed every dasha of a debilitated
  // planet — too binary. Many real charts have a debilitated benefic
  // (e.g. Amazon's Jupiter in Capricorn) and still show positive
  // outcomes during those periods. Treat debilitation as a warning that
  // suppresses the dignity-bonus reason but does not cancel other
  // positives outright.
  if (dignity === 'debilitated') {
    warnings.push(
      `${planet} is debilitated in ${planetSign} — Dasha.docx: results are weakened; positives need to outweigh this caveat.`,
    );
  }

  // ── Conservative-mode flags ─────────────────────────────────────────
  // Shadow planets (Rahu / Ketu) need benefic restraint to count their
  // wealth-house placements as favorable (per explogalore "unbalanced
  // Rahu" rule). Without Jupiter or Venus aspecting / sitting in the
  // shadow's house, the placement is downgraded to a warning.
  const isShadow = (planet === 'Rahu' || planet === 'Ketu');
  const beneficInf = isShadow ? hasBeneficInfluence(natalMap, planetHouse) : null;
  const shadowUnrestrained = isShadow && !beneficInf;
  const restraintNote = beneficInf
    ? ` (${beneficInf.source}'s ${beneficInf.kind} restrains the shadow planet's volatility)`
    : '';

  // Rule 1 — Best timing: lord of 5th or 11th house always counts.
  // 8L lordship is gated to the strict SuddenGainSigns reading (only
  // when 8L is placed in 2nd or 11th house).
  //
  // CRITICAL OVERRIDE: when the lord of 5/9/11 sits in the 12th house,
  // the lordship positive is CANCELLED — classical "lord-in-12" is a
  // wealth-loss combination, not "favorable with caveat". This is the
  // AMZN-backtest fix: Amazon's Venus is 5L in own Taurus (12th); the
  // old code rated it favorable due to 3 positives. With cancellation,
  // Venus dashas during Amazon's first decade now read as cautious.
  const inTwelfth = planetHouse === 12;
  const blockedByTwelfth = owned.filter(h => [5, 9, 11].includes(h));
  const lordIn12 = inTwelfth && blockedByTwelfth.length > 0;

  const ownedKey = owned.filter(h => {
    if (lordIn12 && [5, 11].includes(h)) return false; // suppress when in 12
    if (h === 8) return [2, 11].includes(planetHouse);
    return [5, 11].includes(h);
  });
  if (ownedKey.length > 0) {
    const labels = ownedKey.map(h => `${ordinal(h)} (${HOUSE_KEY_LABEL[h]})`);
    reasons.push(
      `${planet} is lord of the ${labels.join(' and ')} house — the classical "best-timing" lordship for investment / speculation.`,
    );
  }
  if (lordIn12) {
    const lordList = blockedByTwelfth.map(h => `${ordinal(h)} lord`).join(' / ');
    warnings.push(
      `${planet} (${lordList}) in the 12th house — classical wealth-loss combination; OVERRIDES the lordship positive.`,
    );
  }
  // Surface 8L's location explicitly when not in 2/11 so the user knows
  // why the 8L rule didn't fire green.
  if (owned.includes(8) && ![2, 11].includes(planetHouse)) {
    warnings.push(
      `${planet} is the 8th lord placed in the ${ordinal(planetHouse)} house — SuddenGainSigns flags 8L as auspicious only when in 2nd or 11th; here it remains dual-edged.`,
    );
  }

  // Rule 2 — Placement in wealth/gain houses (2/5/9/11). Conservative
  // version: shadow planets (Rahu/Ketu) need benefic restraint to score
  // these as positives; otherwise a single "unrestrained" warning fires.
  // The 8th house (Randhra) is now treated as cautious for ALL planets.
  if (shadowUnrestrained && [2, 5, 9, 11].includes(planetHouse)) {
    warnings.push(
      `${planet} in the ${ordinal(planetHouse)} house but unrestrained — no Jupiter or Venus aspecting / joining it. Per explogalore, an unrestrained ${planet} in a speculation house risks overconfidence and large losses.`,
    );
  } else {
    if (planetHouse === 5) {
      reasons.push(
        `${planet} sits in the 5th house — Suta Bhava, the primary house of speculation, intelligence, and Purva Punya (lottery / windfalls)${isShadow ? restraintNote : ''}.`,
      );
    }
    if (planetHouse === 11) {
      reasons.push(
        `${planet} sits in the 11th house — Labha Bhava, the house of gains, income, and fulfillment of desires${isShadow ? restraintNote : ''}.`,
      );
    }
    if (planetHouse === 2) {
      reasons.push(
        `${planet} sits in the 2nd house — Dhana Bhava, controlling wealth accumulation and savings${isShadow ? restraintNote : ''}.`,
      );
    }
    if (planetHouse === 9) {
      reasons.push(
        `${planet} sits in the 9th house — Bhagya Bhava, fortune and divine luck${isShadow ? restraintNote : ''}.`,
      );
    }
  }
  if (planetHouse === 8) {
    // Conservative reading: the 8th gives windfalls but is also a
    // dusthana. Flag for ALL planets (including Mars in own Scorpio)
    // as a caution rather than a green-light.
    warnings.push(
      `${planet} sits in the 8th house — Randhra Bhava is dual-edged: potential for sudden / unearned wealth but high-risk. Treat any gains here as windfalls and size positions cautiously.`,
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
  // kendra/trikona/11 = fast and immense speculative gains. Conservative
  // version requires benefic restraint (Jupiter or Venus aspecting /
  // co-located) — without it, "unbalanced Rahu" risks overconfidence
  // (explogalore). The shadowUnrestrained warning above already covers
  // 5/9/11 placements, so we only emit the trikona-specific positive
  // here when benefic-influenced; otherwise stay silent (warning was
  // already raised).
  if (planet === 'Rahu' &&
      [...KENDRA_HOUSES, ...TRIKONA_HOUSES, 11].includes(planetHouse)) {
    if (beneficInf) {
      reasons.push(
        `Rahu in the ${ordinal(planetHouse)} house (${kendraTrikonaLabel(planetHouse) || 'gains'}), restrained by ${beneficInf.source}'s ${beneficInf.kind} — King of Speculation well-channeled, fast unexpected gains in volatile markets.`,
      );
    } else if (![2, 5, 9, 11].includes(planetHouse)) {
      // Kendra-but-not-trikona-or-11 placements (4, 7, 10): emit the
      // unrestrained warning since the wealth-house path didn't.
      warnings.push(
        `Rahu in the ${ordinal(planetHouse)} house but unrestrained by Jupiter / Venus — explogalore "unbalanced Rahu" warning: overconfidence and large losses.`,
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
  // (5L / 9L / 11L in 12th warning is emitted up at the lordship rule —
  // see the lordIn12 branch — so it can also cancel the lordship
  // positive. We don't re-emit here.)

  // ── Papakartari Yoga (structural strangulation) ────────────────────
  // Fires when h2 (wealth) or h11 (gains) is hemmed in by malefics in
  // the houses immediately on either side. We gate the warning to
  // dasha lords whose period would amplify the strangulation:
  //   • 2L / 11L periods (the lord's own period activates its house)
  //   • A planet placed in h2 or h11 (its dasha activates the house
  //     where it sits)
  // Outside those, papakartari is structural drag but not specifically
  // active right now, so we stay silent to avoid noise.
  for (const targetHouse of [2, 11]) {
    const yoga = papakartariFor(targetHouse, natalMap, lagnaSign);
    if (!yoga) continue;
    const isLordOfTarget = owned.includes(targetHouse);
    const isPlacedInTarget = planetHouse === targetHouse;
    if (!isLordOfTarget && !isPlacedInTarget) continue;
    const houseLabel = targetHouse === 2 ? '2nd house (wealth)' : '11th house (gains)';
    const role = isLordOfTarget && isPlacedInTarget
      ? `lord of, and placed in, the ${houseLabel}`
      : isLordOfTarget
        ? `lord of the ${houseLabel}`
        : `placed in the ${houseLabel}`;
    warnings.push(
      `Papakartari Yoga on the ${houseLabel} — hemmed in by ${yoga.prevMalefic} (${ordinal(yoga.prevHouse)}) and ${yoga.nextMalefic} (${ordinal(yoga.nextHouse)}). ${planet} is ${role}, so this period feels the strangulation: profits delayed or eaten by friction (taxes, fees, slippage).`,
    );
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
 * Transit overlay: given the native's natal chart and current transit
 * planet positions, returns extra reasons / warnings that depend on
 * where slow malefics (Saturn, Rahu, Ketu) and Jupiter are *right now*.
 * The dasha-only model is fixed at birth and cannot distinguish bull
 * from bear regimes — this layer is the missing transit dimension.
 *
 * Rules implemented:
 *   • Saturn transiting natal 4th / 8th / 12th — Sade-Sati / Ashtam
 *     Shani style affliction → warning.
 *   • Saturn transiting natal 3rd / 6th / 11th (upachayas) — favorable
 *     for steady, disciplined gains → reason.
 *   • Jupiter transiting natal 2nd / 5th / 9th / 11th — Guru's grace
 *     on wealth/speculation/fortune houses → reason.
 *   • Rahu transiting over natal Moon (same sign) — emotional impulse,
 *     panic-trading risk → warning.
 *   • Ketu transiting over natal Venus (same sign) — SuddenGainSigns
 *     "speculation losses" rule → warning.
 *
 * Caller passes the array of transit planets returned by the kerykeion
 * bridge (each carrying `name` + `sign`). Lagna sign is read from the
 * natalMap. Returns { reasons: [], warnings: [] } — empty when transit
 * data is missing rather than throwing.
 */
function evaluateTransitOverlay(natalMap, transitPlanets) {
  const reasons = [];
  const warnings = [];
  if (!Array.isArray(transitPlanets) || transitPlanets.length === 0) {
    return { reasons, warnings };
  }
  const lagnaSign = natalMap?.Ascendant?.sign;
  if (!lagnaSign) return { reasons, warnings };

  const transitMap = Object.fromEntries(
    transitPlanets.filter(p => p && p.name).map(p => [p.name, p]),
  );
  const lagnaIdx = signIndex(lagnaSign);
  const transitHouse = (sign) => {
    const idx = signIndex(sign);
    if (idx < 0 || lagnaIdx < 0) return null;
    return ((idx - lagnaIdx + 12) % 12) + 1;
  };

  // Saturn transit
  const tSat = transitMap.Saturn;
  if (tSat?.sign) {
    const h = transitHouse(tSat.sign);
    if ([4, 8, 12].includes(h)) {
      warnings.push(
        `TRANSIT: Saturn currently in the ${ordinal(h)} house from natal lagna — Sade-Sati / Ashtam-Shani style affliction; expect contractions and reduced speculation gains during this window.`,
      );
    } else if ([3, 6, 11].includes(h)) {
      reasons.push(
        `TRANSIT: Saturn currently in the ${ordinal(h)} house (upachaya) — favorable for steady, disciplined gains.`,
      );
    }
  }

  // Jupiter transit
  const tJup = transitMap.Jupiter;
  if (tJup?.sign) {
    const h = transitHouse(tJup.sign);
    if ([2, 5, 9, 11].includes(h)) {
      reasons.push(
        `TRANSIT: Jupiter currently in the ${ordinal(h)} house — Guru blesses the wealth/speculation/fortune axis; expansion phase.`,
      );
    }
  }

  // Rahu over natal Moon — panic / impulsivity
  const tRahu = transitMap.Rahu;
  const nMoon = natalMap.Moon;
  if (tRahu?.sign && nMoon?.sign && tRahu.sign === nMoon.sign) {
    warnings.push(
      `TRANSIT: Rahu currently transiting over natal Moon — emotional impulsivity / panic-trading risk; reduce position sizes.`,
    );
  }

  // Ketu over natal Venus — SuddenGainSigns rule
  const tKetu = transitMap.Ketu;
  const nVenus = natalMap.Venus;
  if (tKetu?.sign && nVenus?.sign && tKetu.sign === nVenus.sign) {
    warnings.push(
      `TRANSIT: Ketu currently transiting over natal Venus — SuddenGainSigns: speculation losses risk in this window.`,
    );
  }

  return { reasons, warnings };
}

/**
 * Detect Ashtama Shani — the surgical version of Saturn-transit
 * malefic-house warnings. Classical reading: when transit Saturn sits
 * in the 8th house FROM THE NATAL MOON, it generates intense pressure,
 * hidden obstacles, and "right on direction but wrong on timing"
 * outcomes for trades. Far more specific than the previous "Saturn in
 * 4/8/12 from lagna" overlay (which fired too often and was reverted).
 *
 * Saturn spends ~2.5 years per sign so this rule activates roughly
 * once per ~30-year orbit. Returns a warning string or null.
 */
function detectAshtamaShani(natalMap, transitPlanets) {
  if (!Array.isArray(transitPlanets)) return null;
  const tSat = transitPlanets.find(p => p && p.name === 'Saturn');
  const moon = natalMap?.Moon;
  if (!tSat?.sign || !moon?.sign) return null;
  const moonIdx = signIndex(moon.sign);
  const satIdx = signIndex(tSat.sign);
  if (moonIdx < 0 || satIdx < 0) return null;
  const houseFromMoon = ((satIdx - moonIdx + 12) % 12) + 1;
  if (houseFromMoon !== 8) return null;
  return (
    `TRANSIT: Saturn currently in the 8th house from natal Moon (Ashtama Shani / Chandra-Ashtama) — ` +
    `intense pressure, hidden obstacles, and "right on direction but wrong on timing" risk. ` +
    `Stops are likely to get hit just before the trade goes your way; size cautiously and avoid leverage.`
  );
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
  evaluateTransitOverlay,
  detectAshtamaShani,
  papakartariFor,
  ownedHouseNumbers,
  planetDignity,
  planetMap,
};
