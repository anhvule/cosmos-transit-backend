/**
 * Multi-investor speculative-market signal aggregator.
 *
 * For each transit date in a caller-supplied list, evaluate the bundled
 * famous-investor charts against the SuddenGainSigns and SuddenLossesSigns
 * rule sets. Each chart yields a per-date verdict (favourable / cautious /
 * normal), then the panel is aggregated into a single market signal.
 *
 * The panel is intentionally narrow — only investors whose birth times are
 * publicly attested (Rodden rating A or better, or a comparable sourced
 * journalistic citation) are included. Birth-time accuracy matters: the
 * gain/loss rule set leans heavily on Moon house placement, which shifts a
 * full house every ~2 hours and is meaningless on a "noon chart" when the
 * real time is unknown. Famous-but-unattested investors (Soros, Druckenmiller,
 * Dalio, Tudor Jones, Icahn, Simons) were considered and dropped — no public
 * birth time exists for them, and astrologer rectifications are speculation.
 *
 * Current panel:
 *   - Warren Buffett   (1930-08-30 15:00 Omaha; Rodden A — Hewitt collection)
 *   - Bill Ackman      (1966-05-11 00:30 Chappaqua; Bloomberg, Amanda Gordon)
 *   - Michael Bloomberg(1942-02-14 15:40 EWT Brighton MA; Rodden AA)
 *
 * When the transit picture *simultaneously* favours risk-on or risk-off
 * across the majority of this panel, the agreement is treated as a stronger
 * cross-trader signal than any single chart alone. New investors can be
 * added to INVESTOR_PROFILES below — keep the bar at verified-time only.
 */

const { getInvestmentSignsForDates } = require('./astrology_kerykeion_bridge');

const INVESTOR_PROFILES = [
  {
    key: 'buffett',
    name: 'Warren Buffett',
    style: 'Value · long-horizon equity',
    birthDate: '1930-08-30',
    birthTime: '15:00',
    birthTimeKnown: true,
    birthTimeSource: 'AstroDatabank Rodden rating A — Hewitt collection',
    latitude: 41.2565,
    longitude: -95.9345,
    timezone: 'America/Chicago',
  },
  {
    key: 'ackman',
    name: 'Bill Ackman',
    style: 'Activist · concentrated equity',
    birthDate: '1966-05-11',
    birthTime: '00:30',
    birthTimeKnown: true,
    birthTimeSource: 'Bloomberg / Amanda Gordon (May 13, 2013)',
    latitude: 41.1570,
    longitude: -73.7660,
    timezone: 'America/New_York',
  },
  {
    key: 'bloomberg',
    name: 'Michael Bloomberg',
    style: 'Salomon equity trader · Bloomberg LP founder',
    birthDate: '1942-02-14',
    birthTime: '15:40',
    birthTimeKnown: true,
    birthTimeSource: 'AstroDatabank Rodden rating AA — birth record',
    // Brighton neighborhood of Boston. Eastern War Time was in effect on
    // 1942-02-14 (EWT instituted Feb 9, 1942) — the IANA America/New_York
    // zone resolves "15:40" on this date to EWT (UTC-4) automatically.
    latitude: 42.3496,
    longitude: -71.1565,
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
  return {
    key: p.key,
    name: p.name,
    style: p.style,
    birthTimeKnown: p.birthTimeKnown === true,
    birthTimeSource: p.birthTimeSource || 'unknown',
  };
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
