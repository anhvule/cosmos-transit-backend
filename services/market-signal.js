/**
 * Multi-investor speculative-market signal aggregator.
 *
 * For each transit date in a caller-supplied list, evaluate the bundled
 * famous-investor charts (Druckenmiller / Ackman / Soros — the same three
 * profiles used by /api/caution-dates) against the SuddenGainSigns and
 * SuddenLossesSigns rule sets. Each chart yields a per-date verdict
 * (favourable / cautious / normal), then the three are aggregated into a
 * single market signal.
 *
 * Rationale: these three traders represent distinct, empirically successful
 * speculative styles (long-term macro, activist, reflexivity-driven
 * contrarian). When the Vedic transit picture is *simultaneously* favourable
 * or cautious across all three contrarian charts, that signal is treated as
 * structurally stronger than any single chart on its own — the same premise
 * that drives the caution-dates union.
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
 * Rules:
 *   - 2+ favourable AND 0 cautious → favourable
 *   - 2+ cautious   AND 0 favourable → cautious
 *   - mixed signals (favourable + cautious on the same day) → normal,
 *     because disagreement across these three contrarian styles is a
 *     classic "no-edge" tape.
 *   - everything else → normal
 */
function aggregateVerdicts(perInvestor) {
  const fav = perInvestor.filter(p => p.verdict === 'favourable').length;
  const cau = perInvestor.filter(p => p.verdict === 'cautious').length;

  let verdict = 'normal';
  let confidence = 'low';
  if (fav >= 2 && cau === 0) {
    verdict = 'favourable';
    confidence = fav === 3 ? 'high' : 'medium';
  } else if (cau >= 2 && fav === 0) {
    verdict = 'cautious';
    confidence = cau === 3 ? 'high' : 'medium';
  } else if (fav === 1 && cau === 0) {
    verdict = 'normal';
    confidence = 'low';
  } else if (cau === 1 && fav === 0) {
    verdict = 'normal';
    confidence = 'low';
  } else {
    // Mixed — at least one favourable AND at least one cautious.
    verdict = 'normal';
    confidence = 'low';
  }
  return { verdict, confidence };
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
  const fav = perInvestor.filter(p => p.verdict === 'favourable').map(p => p.profileName);
  const cau = perInvestor.filter(p => p.verdict === 'cautious').map(p => p.profileName);
  if (verdict === 'favourable') {
    return `Speculative tape favours risk-on: ${fav.join(', ')} chart${fav.length === 1 ? '' : 's'} align${fav.length === 1 ? 's' : ''} with gain combinations.`;
  }
  if (verdict === 'cautious') {
    return `Speculative risk elevated: ${cau.join(', ')} chart${cau.length === 1 ? '' : 's'} fire${cau.length === 1 ? 's' : ''} loss combinations — size down, avoid F&O / leveraged entries.`;
  }
  if (fav.length && cau.length) {
    return `Mixed tape: ${fav.join(', ')} lean${fav.length === 1 ? 's' : ''} bullish while ${cau.join(', ')} flag${cau.length === 1 ? 's' : ''} caution — no edge.`;
  }
  if (fav.length) {
    return `Modest bullish lean from ${fav.join(', ')} only — insufficient confirmation across charts.`;
  }
  if (cau.length) {
    return `Modest caution from ${cau.join(', ')} only — not broad enough to act on.`;
  }
  return 'Neutral tape: no significant gain or loss triggers across the three speculative charts.';
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
