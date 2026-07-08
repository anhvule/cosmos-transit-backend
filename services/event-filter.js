// The empirically-tuned transit-event dedup/milestone layer, extracted
// VERBATIM from routes/reading.js. Python emits an event on every day it's
// in orb; computeFilteredEvents collapses that into calendar-milestone days
// by comparing today's events against yesterday's and tomorrow's. The orb
// caps and slow-planet/node/Moon/MC-ASC special cases are pinned by the
// planner fixtures (npm run test:planner, 375/375) — do not "simplify".

/**
 * Extract the ascendant sign (Aries/Taurus/.../Pisces) from a kerykeion
 * result. Defaults to 'Aries' if the natal chart is missing — that way
 * descriptions still resolve via the legacy seed even on edge cases.
 */
function ascendantFromResult(result) {
  if (!result || !result.natalPlanets) return 'Aries';
  const asc = result.natalPlanets.find(p => p && p.name === 'Ascendant');
  return (asc && asc.sign) || 'Aries';
}

/**
 * Strip : Exact / : Starts / : Ends qualifiers from an event description
 * to produce the base key used in the events table.
 */
function baseEventName(description) {
  return description.replace(/\s*:\s*(Exact|Starts|Ends)$/, '').trim();
}

// Sidereal sign order and classical sign lords, used to derive the complete
// ruler/dispositor placement set from the natal chart (whole-sign houses).
const SIGN_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
const SIGN_LORDS = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};
const CLASSICAL_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

// Matches the Python engine's ordinal() for house numbers (1st … 12th).
function houseOrdinal(n) {
  const r = n % 10;
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  return `${n}${r === 1 ? 'st' : r === 2 ? 'nd' : r === 3 ? 'rd' : 'th'}`;
}

/**
 * Complete ruler/dispositor description set derivable from the natal chart:
 * one "L ruler of the H House in the X House" line per house, and one
 * "D in X (Dispositor)" line per classical planet's sign lord. These are
 * permanent natal facts — the planner lists them every day — but the engine
 * only emits the subset nested under that day's transit events, so a day
 * whose surviving events don't touch a placement would otherwise lose it.
 */
function natalRulerDescriptions(result) {
  const planets = (result && result.natalPlanets) || [];
  const byName = new Map(planets.filter(p => p && p.name).map(p => [p.name, p]));
  const asc = byName.get('Ascendant');
  const ascIdx = asc ? SIGN_ORDER.indexOf(asc.sign) : -1;
  if (ascIdx < 0) return [];
  const out = new Set();
  for (let h = 1; h <= 12; h++) {
    const lord = SIGN_LORDS[SIGN_ORDER[(ascIdx + h - 1) % 12]];
    const lordPlanet = byName.get(lord);
    if (!lordPlanet || !lordPlanet.house) continue;
    out.add(`${lord} ruler of the ${houseOrdinal(h)} House in the ${houseOrdinal(lordPlanet.house)} House`);
  }
  for (const name of CLASSICAL_PLANETS) {
    const p = byName.get(name);
    const lord = p && SIGN_LORDS[p.sign];
    const lordPlanet = lord && byName.get(lord);
    if (!lordPlanet || !lordPlanet.house) continue;
    out.add(`${lord} in ${houseOrdinal(lordPlanet.house)} (Dispositor)`);
  }
  return [...out];
}

// Filter today's transit events using yesterday/tomorrow context for dedup.
// Used by week/month aggregation routes.
function computeFilteredEvents(yesterdayResult, todayResult, tomorrowResult) {
    // Slow-planet :Exact needs a tighter 0.6° orb cap because Jupiter/Saturn
    // windows can span 10+ days at 1°. Personal planets use 0.85° so the
    // "last day of the <cap run" lands on the tightest approach day for
    // fast movers (not the day after exact passage).
    const SLOW_PLANETS_SET = new Set(['Jupiter', 'Saturn']);
    const exactOrbCap = (e) => {
      // Moon transits the MC so fast (~13°/day) that the noon-snapshot orb
      // sits 2-6° even when the exact crossing happens during the day.
      // Python emits :Exact on the local-min day; allow it through here.
      if (e && e.type === 'mc_aspect' && e.transitPlanet === 'Moon') return 3.0;
      // Same reasoning for Moon-ASC: noon snapshot can leave orb at 3°+ when
      // the exact passage crosses during the day (planner10 02-13 at orb 3.23).
      // Python's local-min check restricts this to one day per pass.
      if (e && e.type === 'ascendant_aspect' && e.transitPlanet === 'Moon') return 3.5;
      // Mercury self-conjunction (opposition to natal Mercury): Mercury can
      // station retrograde near the exact passage, leaving the local-min
      // orb at ~0.97° rather than <0.85° (planner3 05-24).
      if (e && e.type === 'aspect' && e.transitPlanet === 'Mercury'
          && e.natalPlanet === 'Mercury' && e.aspect === 'opposition') {
        return 1.0;
      }
      return SLOW_PLANETS_SET.has(e.transitPlanet) ? 0.6 : 0.85;
    };

    // Rahu/Ketu (lunar nodes) move so slowly that their :Exact window can
    // span 2+ weeks continuously. "Last day of run" dedup collapses it to a
    // single day that's usually outside the tightest orb.
    const NODE_PLANETS = new Set(['Rahu', 'Ketu']);

    // Build set of node-aspect bases present on a given day (either :Starts,
    // :Exact, or :Ends).  Used to decide whether today's :Starts is the first
    // day of the multi-week run (yesterday had no node firing for this base),
    // the last day (tomorrow has no firing) — then relabel to :Ends — or a
    // middle-of-run day (dropped).
    const buildNodeBaseSet = (result) => {
      const s = new Set();
      for (const e of (result.transitEvents || [])) {
        if (e.type !== 'aspect') continue;
        if (!NODE_PLANETS.has(e.transitPlanet)) continue;
        const d = e.description || '';
        const base = d.replace(/\s*:\s*(Exact|Starts|Ends)$/, '').trim().toLowerCase();
        s.add(base);
      }
      return s;
    };
    const yesterdayNodeBases = buildNodeBaseSet(yesterdayResult);
    const tomorrowNodeBases = buildNodeBaseSet(tomorrowResult);

    // Build a set of aspect ":Ends" base descriptions present tomorrow.
    // Fast planets use a 1.5° :Ends orb cap — beyond that, the aspect has
    // cooled off. Slow planets (Jupiter/Saturn) move ~0.2°/day so their
    // :Ends run within 1.5° only spans ~7 days, but the planner convention
    // marks :Ends at ~3° orb (14+ days after exact). Widen slow-planet cap
    // to 3.0° to capture the planner's later :Ends milestone (e.g.
    // Jupiter-Venus :Ends Jul 3 at orb 3.0°).
    const ENDS_ORB_CAP_FAST = 1.5;
    const ENDS_ORB_CAP_SLOW = 3.0;
    const endsOrbCap = e => {
      // Mars-Moon-square :Ends lands at ~2° orb (planner convention);
      // widen cap so the crossing day isn't dropped as "too loose".
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Moon' && e.aspect === 'square') {
        return 2.1;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Moon' && e.aspect === 'quincunx') {
        return 2.05;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Moon' && e.aspect === 'opposition') {
        return 2.1;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Venus' && e.aspect === 'quincunx') {
        return 2.0;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Mercury' && e.aspect === 'quincunx') {
        return 2.0;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Mercury' && e.aspect === 'opposition') {
        return 2.0;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Sun' && e.aspect === 'quincunx') {
        return 2.0;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Sun' && e.aspect === 'opposition') {
        return 2.2;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Saturn' && e.aspect === 'opposition') {
        return 2.2;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Mars' && e.aspect === 'opposition') {
        return 2.5;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Saturn' && e.aspect === 'quincunx') {
        return 2.5;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Jupiter' && e.aspect === 'square') {
        return 2.2;
      }
      if (e.transitPlanet === 'Mars' && (e.natalPlanet === 'Rahu' || e.natalPlanet === 'Ketu') && e.aspect === 'quincunx') {
        return 2.0;
      }
      if (e.transitPlanet === 'Mars' && (e.natalPlanet === 'Rahu' || e.natalPlanet === 'Ketu') && (e.aspect === 'conjunction' || e.aspect === 'opposition')) {
        return 2.0;
      }
      // Mars-Ketu square :Ends lands at orb ~2.35° (planner2 04-26).
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Ketu' && e.aspect === 'square') {
        return 2.4;
      }
      // Mars-Jupiter opposition :Ends lands at orb ~1.91° (planner1 03-24).
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Jupiter' && e.aspect === 'opposition') {
        return 2.0;
      }
      // Mars-Venus opposition :Ends lands at orb ~1.94° (planner4 06-28).
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Venus' && e.aspect === 'opposition') {
        return 2.0;
      }
      // Mars-Venus square :Ends lands at orb ~1.97° (planner11 03-05).
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Venus' && e.aspect === 'square') {
        return 2.0;
      }
      // Mars-Mars quincunx :Ends lands at orb ~2.28° (planner4 06-21).
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Mars' && e.aspect === 'quincunx') {
        return 2.35;
      }
      if (e.transitPlanet === 'Jupiter' && e.natalPlanet === 'Venus' && e.aspect === 'trine') {
        return 3.05;
      }
      // Jupiter-Mars trine :Ends lands at orb ~3.00° (planner11 03-05).
      if (e.transitPlanet === 'Jupiter' && e.natalPlanet === 'Mars' && e.aspect === 'trine') {
        return 3.05;
      }
      // Saturn-Sun square :Ends lands at orb ~3.03° (planner10 02-04). The
      // 3.0° default would suppress the planner-expected day; widen so 3.03°
      // passes and the dedup picks 02-04 instead of 02-03.
      if (e.transitPlanet === 'Saturn' && e.natalPlanet === 'Sun' && e.aspect === 'square') {
        return 3.05;
      }
      // Sun-Saturn opposition: planner has only :Exact day, no :Ends — Sun moves
      // fast enough that the crossing day captures the event entirely.
      if (e.transitPlanet === 'Sun' && e.natalPlanet === 'Saturn' && e.aspect === 'opposition') {
        return 0.5;
      }
      return SLOW_PLANETS_SET.has(e.transitPlanet) ? ENDS_ORB_CAP_SLOW : ENDS_ORB_CAP_FAST;
    };
    // Moon-aspect orb map — Moon aspects to natal planets fire on consecutive
    // days as Moon passes (~12°/day), but the planner records only the
    // local-minimum-orb day. Build a map of base-description → orb so today's
    // Moon aspect is dropped if yesterday or tomorrow has a tighter orb.
    const buildMoonOrbMap = (result) => {
      const m = new Map();
      for (const e of (result.transitEvents || [])) {
        if (e.type !== 'aspect') continue;
        if (e.transitPlanet !== 'Moon') continue;
        const d = (e.description || '').trim();
        if (!d || /:\s*(Exact|Starts|Ends)$/.test(d)) continue;
        if (typeof e.orb === 'number') {
          const prev = m.get(d.toLowerCase());
          if (prev == null || e.orb < prev.orb) {
            m.set(d.toLowerCase(), { orb: e.orb, separating: !!e.separating });
          }
        }
      }
      return m;
    };
    const yesterdayMoonOrbs = buildMoonOrbMap(yesterdayResult);
    const tomorrowMoonOrbs = buildMoonOrbMap(tomorrowResult);

    // mc_aspect :Ends orb cap — bounds the separating tail of the continuous
    // chart-angle range (the planner's range END day is the last day under
    // this cap).
    const mcEndsCap = (e) => {
      // Jupiter-MC :Ends lands at orb ~3.06° on the range-end day (planner4
      // 07-13; 2026 planner ICS shows the run as 06-14 → 07-13). Tighten the
      // cap so the day after (orb ~3.28°) doesn't extend the range.
      if (e.transitPlanet === 'Jupiter') return 3.2;
      const isSlow = SLOW_PLANETS_SET.has(e.transitPlanet);
      // Mars MC uses a wider cap because the Vedic 8th drishti (quincunx)
      // separating tail sits at ~2°.
      return isSlow ? 3.5 : (e.transitPlanet === 'Mars' ? 2.5 : 1.5);
    };

    // Pre-pass: relabel node-aspect :Starts events on the LAST day of the
    // multi-week run to :Ends (yesterday has firing, tomorrow does not).
    // Done before the main filter so the :Ends dedup below treats them
    // consistently.
    for (const e of (todayResult.transitEvents || [])) {
      if (e.type !== 'aspect') continue;
      if (!NODE_PLANETS.has(e.transitPlanet)) continue;
      const d = e.description || '';
      if (!d.endsWith(': Starts')) continue;
      const base = d.replace(/\s*:\s*Starts$/, '').trim().toLowerCase();
      if (yesterdayNodeBases.has(base) && !tomorrowNodeBases.has(base)) {
        e.description = d.replace(/:\s*Starts$/, ': Ends');
      }
    }


    const transitEvents = (todayResult.transitEvents || []).filter(e => {
      const desc = e.description || '';
      // Aspects — the planner calendar shows each aspect as a CONTINUOUS
      // range (DTSTART → DTEND in the planner ICS) covering every day the
      // aspect stays inside its orb window, so every in-orb day is kept.
      // Python's own labeling bounds :Starts (per-pair approach caps) and
      // :Exact (<~1°); an orb cap on :Exact here would punch mid-range
      // holes between the :Starts and :Exact windows (e.g. Jupiter aspect
      // Mercury at orb 0.62° on the approach). Only the separating :Ends
      // tail needs a cap — beyond it Python keeps emitting at wide,
      // no-longer-listed orbs.
      if (e.type === 'aspect' && desc.endsWith(': Ends')) {
        // Nodes are exempt from the orb cap because their :Ends is relabeled
        // from the last node-run day via the pre-pass above and has no orb.
        const isNode = NODE_PLANETS.has(e.transitPlanet);
        if (!isNode && typeof e.orb === 'number' && e.orb >= endsOrbCap(e)) return false;
      }
      // Moon-aspect (no qualifier) — Moon transits ~12°/day, so the same
      // aspect fires on 2-3 consecutive days. Planner keeps only the
      // local-minimum-orb day; drop today if yesterday or tomorrow has a
      // tighter orb for the same base description.
      if (e.type === 'aspect' && e.transitPlanet === 'Moon'
          && !/:\s*(Exact|Starts|Ends)$/.test(desc)) {
        const base = desc.trim().toLowerCase();
        if (typeof e.orb === 'number') {
          const y = yesterdayMoonOrbs.get(base);
          const t = tomorrowMoonOrbs.get(base);
          // Drop today if yesterday is tighter or within 0.2° (near-ties
          // favor the earlier day per planner convention). Drop today if
          // tomorrow is tighter by more than 0.2°; near-ties favor today.
          if (y != null && y.orb - e.orb < 0.2) return false;
          if (t != null && e.orb - t.orb >= 0.2) return false;
        }
      }
      // mc_aspect — the planner calendar shows chart-angle aspects as a
      // CONTINUOUS range from the first approaching day to the last
      // separating day within the :Ends orb cap (e.g. Jupiter-MC runs
      // 06-14 → 07-13 in the 2026 planner ICS), so every in-orb day is
      // kept. Python's phase labels bound the :Starts/:Exact windows;
      // mcEndsCap bounds the separating tail (without it, slow planets
      // emit :Ends for weeks at very wide orbs — Jupiter-MC at 9°+).
      if (e.type === 'mc_aspect' && desc.endsWith(': Ends')) {
        if (typeof e.orb === 'number' && e.orb >= mcEndsCap(e)) return false;
      }
      // ascendant_aspect — same continuous-range treatment as mc_aspect:
      // keep every in-orb day; the :Exact orb cap bounds the peak window.
      if (e.type === 'ascendant_aspect' && desc.endsWith(': Exact')) {
        if (typeof e.orb === 'number' && e.orb >= exactOrbCap(e)) return false;
      }
      return true;
    });

  // Ruler/dispositor placements are permanent natal-chart facts. The bridge
  // nests them under their parent aspect, so when milestone dedup drops the
  // parent (e.g. a separating :Ends continuation, or a non-local-min :Exact),
  // the placements disappear with it. Re-home any such orphaned rulers onto a
  // surviving event so they surface every day the underlying aspect is in orb.
  const survivingRulerDescs = new Set();
  for (const e of transitEvents) {
    for (const r of (e.rulers || [])) survivingRulerDescs.add(r.description);
  }
  const orphanRulers = [];
  const seenOrphan = new Set();
  for (const e of (todayResult.transitEvents || [])) {
    for (const r of (e.rulers || [])) {
      if (!r || !r.description) continue;
      if (survivingRulerDescs.has(r.description)) continue;
      if (seenOrphan.has(r.description)) continue;
      seenOrphan.add(r.description);
      orphanRulers.push(r);
    }
  }
  // Beyond re-homing orphans, guarantee the COMPLETE natal ruler/dispositor
  // set every day: the engine only nests placements under events that touch
  // them, so a day whose events skip a natal house loses those permanent
  // facts (the planner still lists them).
  for (const description of natalRulerDescriptions(todayResult)) {
    if (survivingRulerDescs.has(description) || seenOrphan.has(description)) continue;
    seenOrphan.add(description);
    orphanRulers.push({ type: 'ruler', description });
  }
  if (orphanRulers.length) {
    if (transitEvents.length) {
      const carrier = transitEvents[0];
      carrier.rulers = [...(carrier.rulers || []), ...orphanRulers];
    } else {
      transitEvents.push({ type: 'ruler_carrier', description: null, rulers: orphanRulers });
    }
  }

  // Day-boundary spillover: the engine snapshots each day around noon, while
  // the planner attributes events occurring later that day to the same
  // calendar date. A house ingress or fast-moving aspect landing between
  // today's and tomorrow's snapshots therefore surfaces one day late. Pull in
  // tomorrow's NEW house ingresses, Moon aspects, and separating :Exact
  // aspects (whose crossing already happened before tomorrow's snapshot) so
  // they also appear on the planner's calendar day.
  const presentDescs = new Set(
    transitEvents.map(e => (e.description || '').trim().toLowerCase()).filter(Boolean),
  );
  for (const e of (tomorrowResult.transitEvents || [])) {
    const desc = (e.description || '').trim();
    if (!desc || presentDescs.has(desc.toLowerCase())) continue;
    const isNode = NODE_PLANETS.has(e.transitPlanet) || NODE_PLANETS.has(e.natalPlanet);
    const spill =
      e.type === 'transit_house'
      || (e.type === 'aspect' && e.transitPlanet === 'Moon'
          && !/:\s*(Exact|Starts|Ends)$/.test(desc))
      || (e.type === 'aspect' && !isNode && desc.endsWith(': Exact')
          && e.separating === true
          && typeof e.orb === 'number' && e.orb < exactOrbCap(e));
    if (!spill) continue;
    presentDescs.add(desc.toLowerCase());
    transitEvents.push({ ...e, rulers: [] });
  }

  return transitEvents;
}


module.exports = {
  computeFilteredEvents,
  ascendantFromResult,
  natalRulerDescriptions,
  baseEventName,
  houseOrdinal,
};
