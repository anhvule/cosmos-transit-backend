/**
 * Multi-investor speculative-market signal aggregator.
 *
 * For each transit date in a caller-supplied list, evaluate the bundled
 * famous-investor charts (Druckenmiller, Ackman, Soros, Buffett, Dalio,
 * Tudor Jones, Icahn, Simons) against the SuddenGainSigns and
 * SuddenLossesSigns rule sets. Each chart yields a per-date verdict
 * (favourable / cautious / normal), then the eight are aggregated into a
 * single market signal.
 *
 * Rationale: these traders span distinct, empirically successful speculative
 * styles — discretionary macro, activist, contrarian, value, risk parity,
 * trend, and quantitative. When the Vedic transit picture is *simultaneously*
 * favourable or cautious across a strong majority of these styles, that
 * cross-style agreement is treated as a structurally stronger signal than
 * any single chart on its own.
 *
 * Birth-time note: exact birth times for these traders are not in the public
 * record, so we use 12:00 local (the convention already used by
 * /api/caution-dates). This means house placements for slow-moving features
 * (Moon house, ascendant) carry meaningful uncertainty. The rule set is
 * chosen to lean on aspects (orb-driven, time-robust) more than on house
 * placement to keep the signal usable despite the noon assumption.
 */

const { getInvestmentSignsForDates } = require('./astrology_kerykeion_bridge');

const INVESTOR_PROFILES = [
  {
    key: 'druckenmiller',
    name: 'Stanley Druckenmiller',
    style: 'Top-down macro · momentum',
    birthDate: '1953-06-14',
    birthTime: '12:00',
    latitude: 40.4406,
    longitude: -79.9959,
    timezone: 'America/New_York',
  },
  {
    key: 'ackman',
    name: 'Bill Ackman',
    style: 'Activist · concentrated equity',
    birthDate: '1966-05-11',
    birthTime: '12:00',
    latitude: 41.1570,
    longitude: -73.7660,
    timezone: 'America/New_York',
  },
  {
    key: 'soros',
    name: 'George Soros',
    style: 'Reflexivity · contrarian macro',
    birthDate: '1930-08-12',
    birthTime: '12:00',
    latitude: 47.4979,
    longitude: 19.0402,
    timezone: 'Europe/Budapest',
  },
  {
    key: 'buffett',
    name: 'Warren Buffett',
    style: 'Value · long-horizon equity',
    birthDate: '1930-08-30',
    birthTime: '12:00',
    latitude: 41.2565,
    longitude: -95.9345,
    timezone: 'America/Chicago',
  },
  {
    key: 'dalio',
    name: 'Ray Dalio',
    style: 'Macro · All Weather risk parity',
    birthDate: '1949-08-08',
    birthTime: '12:00',
    latitude: 40.7557,
    longitude: -73.8831,
    timezone: 'America/New_York',
  },
  {
    key: 'tudor_jones',
    name: 'Paul Tudor Jones',
    style: 'Discretionary macro · trend-following',
    birthDate: '1954-09-28',
    birthTime: '12:00',
    latitude: 35.1495,
    longitude: -90.0490,
    timezone: 'America/Chicago',
  },
  {
    key: 'icahn',
    name: 'Carl Icahn',
    style: 'Activist · contrarian timing',
    birthDate: '1936-02-16',
    birthTime: '12:00',
    latitude: 40.6035,
    longitude: -73.7547,
    timezone: 'America/New_York',
  },
  {
    key: 'simons',
    name: 'Jim Simons',
    style: 'Quant · statistical arbitrage',
    birthDate: '1938-04-25',
    birthTime: '12:00',
    latitude: 42.3318,
    longitude: -71.1212,
    timezone: 'America/New_York',
  },
];

/**
 * Classify a single-chart per-date result. Thresholds are tuned for the
 * weight scales defined in services/investment-signs-rules.js:
 *   - GAIN weights run 2..5; total possible per day ~36
 *   - LOSS weights run 1..9; total possible per day ~46
 *
 * A clearly bullish day will have a gainScore well above 4 with little/no
 * loss score, and vice versa. The "normal" bucket absorbs ambiguous days
 * where both rule sets fire or neither fires meaningfully.
 */
function classifyPerInvestor({ gainScore, lossScore, gainTopWeight, lossTopWeight }) {
  const FAVOURABLE_FLOOR = 4;     // require a real gain trigger, not just Moon-in-house
  const CAUTIOUS_FLOOR = 4;       // matches LOSS_RULES top-tier weights (6+ at top, 4 floor)
  const DOMINANCE_MARGIN = 2;     // net score must clear the other side by this much

  const net = gainScore - lossScore;

  if (gainScore >= FAVOURABLE_FLOOR && net >= DOMINANCE_MARGIN && gainTopWeight >= 3) {
    return 'favourable';
  }
  if (lossScore >= CAUTIOUS_FLOOR && -net >= DOMINANCE_MARGIN && lossTopWeight >= 4) {
    return 'cautious';
  }
  return 'normal';
}

/**
 * Aggregate per-investor verdicts into the overall market signal.
 *
 * Scales to any panel size. Thresholds:
 *   - strongMajority = ceil(N * 0.6) — minimum count to fire a signal
 *   - superMajority  = ceil(N * 0.75) — count required for "high" confidence
 *   - tolerance      = 0 for N ≤ 3, else 1 — at small N we demand unanimity
 *                      on the losing side; with more charts, a single
 *                      dissenter is allowed without collapsing to "normal"
 *
 * For N=3 (the original panel) this resolves to: ≥2 fav AND 0 cau → medium,
 * 3 fav AND 0 cau → high — preserving the previous semantics. For N=8 it
 * becomes: ≥5 fav AND ≤1 cau → medium, ≥6 fav AND ≤1 cau → high.
 */
function aggregateVerdicts(perInvestor) {
  const fav = perInvestor.filter(p => p.verdict === 'favourable').length;
  const cau = perInvestor.filter(p => p.verdict === 'cautious').length;
  const n = perInvestor.length;
  if (n === 0) return { verdict: 'normal', confidence: 'low' };

  const strongMajority = Math.ceil(n * 0.6);
  const superMajority = Math.ceil(n * 0.75);
  const tolerance = n <= 3 ? 0 : 1;

  if (fav >= strongMajority && cau <= tolerance) {
    return {
      verdict: 'favourable',
      confidence: fav >= superMajority ? 'high' : 'medium',
    };
  }
  if (cau >= strongMajority && fav <= tolerance) {
    return {
      verdict: 'cautious',
      confidence: cau >= superMajority ? 'high' : 'medium',
    };
  }
  return { verdict: 'normal', confidence: 'low' };
}

/**
 * Compute the multi-investor market signal for a list of transit dates.
 *
 * @param {string[]} dates - Array of YYYY-MM-DD strings.
 * @returns {Promise<{ investors: object[], days: object[] }>}
 *   investors: bundled profile metadata (key/name/style)
 *   days:      one entry per requested date with the aggregated verdict,
 *              the per-investor breakdowns, and the triggering signs
 */
async function computeMarketSignal(dates) {
  if (!Array.isArray(dates) || dates.length === 0) {
    return { investors: INVESTOR_PROFILES.map(stripProfile), days: [] };
  }
  const uniqueDates = Array.from(new Set(dates)).sort();

  // Fire all three Python batches in parallel — each profile is independent.
  const perProfileResults = await Promise.all(
    INVESTOR_PROFILES.map(async profile => {
      const days = await getInvestmentSignsForDates(profile, uniqueDates);
      return { profile, days };
    }),
  );

  // Pivot: dateKey → [{profileKey, ...dayResult}]
  const byDate = new Map(uniqueDates.map(d => [d, []]));
  for (const { profile, days } of perProfileResults) {
    for (const day of days) {
      const verdict = classifyPerInvestor(day);
      byDate.get(day.date).push({
        profileKey: profile.key,
        profileName: profile.name,
        verdict,
        gainScore: day.gainScore,
        lossScore: day.lossScore,
        netScore: day.netScore,
        gainSigns: day.gainSigns,
        lossSigns: day.lossSigns,
      });
    }
  }

  const days = uniqueDates.map(date => {
    const perInvestor = byDate.get(date);
    const { verdict, confidence } = aggregateVerdicts(perInvestor);
    return {
      date,
      verdict,
      confidence,
      summary: summariseDay(verdict, perInvestor),
      perInvestor,
    };
  });

  return {
    investors: INVESTOR_PROFILES.map(stripProfile),
    days,
  };
}

function stripProfile(p) {
  return { key: p.key, name: p.name, style: p.style };
}

function summariseDay(verdict, perInvestor) {
  const favNames = perInvestor.filter(p => p.verdict === 'favourable').map(p => p.profileName);
  const cauNames = perInvestor.filter(p => p.verdict === 'cautious').map(p => p.profileName);
  const n = perInvestor.length;
  const fav = favNames.length;
  const cau = cauNames.length;
  const norm = n - fav - cau;

  // Show up to 3 names then "+N more" for readability with larger panels.
  const fmtNames = (arr) => arr.length <= 3
    ? arr.join(', ')
    : `${arr.slice(0, 3).join(', ')} +${arr.length - 3} more`;

  if (verdict === 'favourable') {
    return `Speculative tape favours risk-on (${fav}/${n}): ${fmtNames(favNames)} align with gain combinations.`;
  }
  if (verdict === 'cautious') {
    return `Speculative risk elevated (${cau}/${n}): ${fmtNames(cauNames)} fire loss combinations — size down, avoid F&O / leveraged entries.`;
  }
  if (fav > 0 && cau > 0) {
    return `Mixed tape: ${fav} bullish (${fmtNames(favNames)}) vs ${cau} cautious (${fmtNames(cauNames)}) — no edge.`;
  }
  if (fav > 0) {
    return `Modest bullish lean from ${fav}/${n} (${fmtNames(favNames)}) — insufficient confirmation across the panel.`;
  }
  if (cau > 0) {
    return `Modest caution from ${cau}/${n} (${fmtNames(cauNames)}) — not broad enough to act on.`;
  }
  return `Neutral tape: no significant gain or loss triggers across the ${n}-chart panel.`;
}

/**
 * Build the list of YYYY-MM-DD dates covered by [weekStart, weekStart+6].
 */
function weekDates(weekStart) {
  const out = [];
  const d = new Date(`${weekStart}T00:00:00Z`);
  for (let i = 0; i < 7; i++) {
    out.push(d.toISOString().substring(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

module.exports = {
  INVESTOR_PROFILES,
  computeMarketSignal,
  weekDates,
};
