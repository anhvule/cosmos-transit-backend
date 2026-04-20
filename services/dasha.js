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
 * Compute the active MD and AD at queryDate.
 *
 * @param {Date} birthMoment - Birth datetime (treated as an instant; local vs
 *                             UTC doesn't matter as long as queryDate uses the
 *                             same convention).
 * @param {number} moonSiderealLongitude - Moon's sidereal longitude at birth (degrees).
 * @param {Date} queryDate - Date to evaluate.
 * @returns {{ nakshatra: Object, mahadasha: Object, antardasha: Object, pratyantardasha: Object }}
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
    return { nakshatra: nak, mahadasha: null, antardasha: null };
  }

  // Build 9 antardashas within the active MD (each proportional to AD/120 × MD).
  const mdIdx = lordIndex(activeMd.planet);
  let adCursor = new Date(activeMd.startDate);
  let activeAd = null;
  let activeAdYears = 0;
  for (let i = 0; i < VIMSHOTTARI_SEQUENCE.length; i++) {
    const ad = VIMSHOTTARI_SEQUENCE[(mdIdx + i) % VIMSHOTTARI_SEQUENCE.length];
    const adYears = (activeMd.years * ad.years) / TOTAL_YEARS;
    const end = addDays(adCursor, yearsToDays(adYears));
    if (queryDate >= adCursor && queryDate < end) {
      activeAd = { planet: ad.planet, startDate: new Date(adCursor), endDate: end };
      activeAdYears = adYears;
      break;
    }
    adCursor = end;
  }
  if (!activeAd) {
    return { nakshatra: nak, mahadasha: activeMd, antardasha: null, pratyantardasha: null };
  }

  // Build 9 pratyantardashas within the active AD (each proportional to PD/120 × AD).
  const adIdx = lordIndex(activeAd.planet);
  let pdCursor = new Date(activeAd.startDate);
  let activePd = null;
  for (let i = 0; i < VIMSHOTTARI_SEQUENCE.length; i++) {
    const pd = VIMSHOTTARI_SEQUENCE[(adIdx + i) % VIMSHOTTARI_SEQUENCE.length];
    const pdYears = (activeAdYears * pd.years) / TOTAL_YEARS;
    const end = addDays(pdCursor, yearsToDays(pdYears));
    if (queryDate >= pdCursor && queryDate < end) {
      activePd = { planet: pd.planet, startDate: new Date(pdCursor), endDate: end };
      break;
    }
    pdCursor = end;
  }

  return { nakshatra: nak, mahadasha: activeMd, antardasha: activeAd, pratyantardasha: activePd };
}

module.exports = {
  computeDashaAtDate,
  getNakshatra,
  VIMSHOTTARI_SEQUENCE,
  NAKSHATRAS,
};
