/**
 * Vimshottari Mahadasha / Antardasha calculator.
 *
 * Vedic (Lahiri) sidereal dasha system. Given the Moon's sidereal longitude at
 * birth, determines the active mahadasha (MD) and antardasha (AD) for any
 * given date.
 *
 * Algorithm:
 *   1. Determine the Moon's nakshatra (one of 27, each 13°20′ wide).
 *   2. Nakshatra lord = starting MD lord.
 *   3. Fraction of nakshatra already elapsed = fraction of starting MD already
 *      elapsed at birth. Subtract that elapsed portion from birth to get the
 *      hypothetical MD start date.
 *   4. Build the MD sequence from that start date, 9 planets × 120 years total.
 *   5. Within the active MD, build 9 ADs (proportional durations) and pick the
 *      one that contains the query date.
 *   6. Within the active AD, build 9 Pratyantardashas (PDs) the same way and
 *      pick the one that contains the query date.
 *   7. Within the active PD, build 9 Sookshmadashas (SDs) and pick the one
 *      that contains the query date.
 */

// Vimshottari order and period lengths (total = 120 years).
const VIMSHOTTARI_SEQUENCE = [
  { planet: 'Ketu',    years: 7 },
  { planet: 'Venus',   years: 20 },
  { planet: 'Sun',     years: 6 },
  { planet: 'Moon',    years: 10 },
  { planet: 'Mars',    years: 7 },
  { planet: 'Rahu',    years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn',  years: 19 },
  { planet: 'Mercury', years: 17 },
];

const TOTAL_YEARS = 120;
const DAYS_PER_YEAR = 365.25;
const NAKSHATRA_WIDTH = 360 / 27; // 13.3333…°

// 27 nakshatras with their Vimshottari lords (3 repeating cycles of 9 planets).
const NAKSHATRAS = [
  { name: 'Ashwini',          lord: 'Ketu' },
  { name: 'Bharani',          lord: 'Venus' },
  { name: 'Krittika',         lord: 'Sun' },
  { name: 'Rohini',           lord: 'Moon' },
  { name: 'Mrigashira',       lord: 'Mars' },
  { name: 'Ardra',            lord: 'Rahu' },
  { name: 'Punarvasu',        lord: 'Jupiter' },
  { name: 'Pushya',           lord: 'Saturn' },
  { name: 'Ashlesha',         lord: 'Mercury' },
  { name: 'Magha',            lord: 'Ketu' },
  { name: 'Purva Phalguni',   lord: 'Venus' },
  { name: 'Uttara Phalguni',  lord: 'Sun' },
  { name: 'Hasta',            lord: 'Moon' },
  { name: 'Chitra',           lord: 'Mars' },
  { name: 'Swati',            lord: 'Rahu' },
  { name: 'Vishakha',         lord: 'Jupiter' },
  { name: 'Anuradha',         lord: 'Saturn' },
  { name: 'Jyeshtha',         lord: 'Mercury' },
  { name: 'Mula',             lord: 'Ketu' },
  { name: 'Purva Ashadha',    lord: 'Venus' },
  { name: 'Uttara Ashadha',   lord: 'Sun' },
  { name: 'Shravana',         lord: 'Moon' },
  { name: 'Dhanishta',        lord: 'Mars' },
  { name: 'Shatabhisha',      lord: 'Rahu' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada',lord: 'Saturn' },
  { name: 'Revati',           lord: 'Mercury' },
];

function normalizeLongitude(lon) {
  return ((lon % 360) + 360) % 360;
}

function getNakshatra(siderealLongitude) {
  const lon = normalizeLongitude(siderealLongitude);
  const index = Math.min(Math.floor(lon / NAKSHATRA_WIDTH), 26);
  const within = lon - index * NAKSHATRA_WIDTH;
  const fractionElapsed = within / NAKSHATRA_WIDTH;
  return {
    index,
    name: NAKSHATRAS[index].name,
    lord: NAKSHATRAS[index].lord,
    fractionElapsed,
    pada: Math.min(Math.floor(fractionElapsed * 4) + 1, 4),
  };
}

function lordIndex(lord) {
  return VIMSHOTTARI_SEQUENCE.findIndex(d => d.planet === lord);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 86400000);
}

function yearsToDays(years) {
  return years * DAYS_PER_YEAR;
}

/**
 * Build the 9-period sequence starting at `startDate`, where each period i has
 * length (parentYears × VIMSHOTTARI_SEQUENCE[(parentIdx+i)%9].years) / 120.
 * Returns an array of { planet, years, startDate, endDate } in chronological
 * order. The same proportional-subdivision rule is used at every nesting level
 * (AD within MD, PD within AD, SD within PD).
 */
function buildSubperiods(parentPlanet, parentYears, parentStartDate) {
  const startIdx = lordIndex(parentPlanet);
  const periods = [];
  let cursor = new Date(parentStartDate);
  for (let i = 0; i < VIMSHOTTARI_SEQUENCE.length; i++) {
    const sub = VIMSHOTTARI_SEQUENCE[(startIdx + i) % VIMSHOTTARI_SEQUENCE.length];
    const subYears = (parentYears * sub.years) / TOTAL_YEARS;
    const end = addDays(cursor, yearsToDays(subYears));
    periods.push({
      planet: sub.planet,
      years: subYears,
      startDate: new Date(cursor),
      endDate: end,
    });
    cursor = end;
  }
  return periods;
}

/** Find the period in `periods` that contains `date`, or null. */
function findActivePeriod(periods, date) {
  for (const p of periods) {
    if (date >= p.startDate && date < p.endDate) return p;
  }
  return null;
}

/**
 * Compute the active MD/AD/PD/SD at queryDate, plus the full subperiod lists
 * that bracket it (all 9 ADs in the active MD, all 9 PDs in the active AD,
 * all 9 SDs in the active PD).
 *
 * @param {Date} birthMoment - Birth datetime (treated as an instant; local vs
 *                             UTC doesn't matter as long as queryDate uses the
 *                             same convention).
 * @param {number} moonSiderealLongitude - Moon's sidereal longitude at birth (degrees).
 * @param {Date} queryDate - Date to evaluate.
 * @returns {{ nakshatra, mahadasha, antardasha, pratyantardasha, sookshmadasha,
 *             antardashas, pratyantardashas, sookshmadashas }}
 */
function computeDashaAtDate(birthMoment, moonSiderealLongitude, queryDate) {
  const nak = getNakshatra(moonSiderealLongitude);
  const startIdx = lordIndex(nak.lord);
  const firstMdYears = VIMSHOTTARI_SEQUENCE[startIdx].years;

  // Back-shift to the hypothetical MD start (so subsequent MDs are full-length).
  const elapsedYearsAtBirth = nak.fractionElapsed * firstMdYears;
  const firstMdStart = addDays(birthMoment, -yearsToDays(elapsedYearsAtBirth));

  // Walk forward until the MD containing queryDate is found.
  let cursor = new Date(firstMdStart);
  let activeMd = null;
  for (let i = 0; i < VIMSHOTTARI_SEQUENCE.length * 3; i++) {
    const md = VIMSHOTTARI_SEQUENCE[(startIdx + i) % VIMSHOTTARI_SEQUENCE.length];
    const end = addDays(cursor, yearsToDays(md.years));
    if (queryDate >= cursor && queryDate < end) {
      activeMd = { planet: md.planet, years: md.years, startDate: new Date(cursor), endDate: end };
      break;
    }
    cursor = end;
  }
  if (!activeMd) {
    return {
      nakshatra: nak,
      mahadasha: null,
      antardasha: null,
      pratyantardasha: null,
      sookshmadasha: null,
      antardashas: [],
      pratyantardashas: [],
      sookshmadashas: [],
    };
  }

  // 9 ADs within the active MD, then locate the active one.
  const antardashas = buildSubperiods(activeMd.planet, activeMd.years, activeMd.startDate);
  const activeAd = findActivePeriod(antardashas, queryDate);
  if (!activeAd) {
    return {
      nakshatra: nak,
      mahadasha: activeMd,
      antardasha: null,
      pratyantardasha: null,
      sookshmadasha: null,
      antardashas,
      pratyantardashas: [],
      sookshmadashas: [],
    };
  }

  // 9 PDs within the active AD, then locate the active one.
  const pratyantardashas = buildSubperiods(activeAd.planet, activeAd.years, activeAd.startDate);
  const activePd = findActivePeriod(pratyantardashas, queryDate);
  if (!activePd) {
    return {
      nakshatra: nak,
      mahadasha: activeMd,
      antardasha: activeAd,
      pratyantardasha: null,
      sookshmadasha: null,
      antardashas,
      pratyantardashas,
      sookshmadashas: [],
    };
  }

  // 9 SDs within the active PD, then locate the active one.
  const sookshmadashas = buildSubperiods(activePd.planet, activePd.years, activePd.startDate);
  const activeSd = findActivePeriod(sookshmadashas, queryDate);

  return {
    nakshatra: nak,
    mahadasha: activeMd,
    antardasha: activeAd,
    pratyantardasha: activePd,
    sookshmadasha: activeSd,
    antardashas,
    pratyantardashas,
    sookshmadashas,
  };
}

module.exports = {
  computeDashaAtDate,
  getNakshatra,
  buildSubperiods,
  findActivePeriod,
  VIMSHOTTARI_SEQUENCE,
  NAKSHATRAS,
};
