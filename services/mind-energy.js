/**
 * Daily "Mind & Energy" scores from a natal chart + that day's sidereal transits.
 *
 *   overthinking — mental restlessness (Moon / nodes / Saturn / Mercury driven)
 *   vitality     — mental stamina + physical energy (Sun / Mars / Moon driven)
 *
 * Both are 0–100, starting from BASE and moved by weighted rules. Every rule
 * that fires is reported as a driver so the app can explain each day. All
 * weights live in WEIGHTS so they can be tuned without touching the logic.
 *
 * Pure functions only — chart math (positions, dasha) is done by the caller.
 */

const { planetDignity } = require('./investment-dasha');

const BASE = 50;

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
const SIGN_RULERS = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};
const CLASSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const KENDRA_OFFSETS = new Set([0, 3, 6, 9]); // sign distance of houses 1/4/7/10

const WEIGHTS = {
  // ── overthinking ──
  moonWithNode: 16,            // transit Moon in the sign of Rahu/Ketu (Grahan yoga)
  moonWithSaturn: 10,          // Moon + Saturn (Vish yoga)
  moonHouse: { 6: 6, 8: 10, 12: 8 },
  moonNakLordMalefic: 6,       // Moon's nakshatra lord is Rahu/Ketu/Saturn
  mercuryRetrograde: 8,
  mercuryCombust: 6,
  nearAmavasya: 8,             // tithi 28–30
  nearPurnima: -6,             // tithi 13–15
  jupiterOnMoon: -10,          // Jupiter conjoins or aspects (5/7/9) the Moon
  dashaMoonNode: { antardasha: 6, mahadasha: 4 },
  // ── vitality ──
  goodHouse: 6,                // Sun/Mars in 3/6/10/11
  badHouse: -8,                // Sun/Mars in 8/12
  saturnOnNatalMoon: -8,
  saturnOnLagna: -6,
  moonWaxing: 5,
  moonWaning: -3,
  dashaLord: { antardasha: 5, mahadasha: 3 },     // sign for exalted/own
  dashaLordDebil: { antardasha: -6, mahadasha: -4 },
  // ── dignity (planet -> metric -> state -> delta) ──
  transitDignity: {
    Sun:  { vitality:     { debilitated: -18, exalted: 14, own: 8 } },
    Mars: { vitality:     { debilitated: -18, exalted: 14, own: 8 } },
    Moon: {
      vitality:     { debilitated: -4, exalted: 4, own: 2 },
      overthinking: { debilitated: 10, exalted: -6, own: -3 },
    },
  },
  natalDignity: {
    Sun:  { vitality:     { debilitated: -8, exalted: 8, own: 5 } },
    Mars: { vitality:     { debilitated: -8, exalted: 8, own: 5 } },
    Moon: {
      overthinking: { debilitated: 8, exalted: -6, own: -4 },
      vitality:     { debilitated: -3, exalted: 3, own: 2 },
    },
  },
  neechaBhangaFactor: 0.5,     // a cancelled debilitation keeps this share of its penalty
};

const NAKSHATRA_MALEFIC_LORDS = new Set(['Rahu', 'Ketu', 'Saturn']);
const GRAHA_DRISHTI = { Jupiter: [1, 5, 7, 9] }; // 1 = same sign (conjunction)

const signIdx = s => SIGNS.indexOf(s);
const signDist = (from, to) => (((signIdx(to) - signIdx(from)) % 12) + 12) % 12;

function tithiNumber(sunLon, moonLon) {
  const elong = (((moonLon - sunLon) % 360) + 360) % 360;
  return Math.floor(elong / 12) + 1; // 1..30
}

/**
 * Neecha bhanga: a debilitated planet's penalty is cancelled when its
 * dispositor, or the planet exalted in that sign, sits in a kendra from the
 * Lagna or from the Moon. `posOf(p)` returns { sign } for the frame the
 * debilitated planet lives in (natal chart or the day's transits).
 */
function neechaBhanga(sign, posOf, lagnaSign, moonSign) {
  const exaltLord = CLASSICAL.find(p => planetDignity(p, sign) === 'exalted');
  for (const cand of [SIGN_RULERS[sign], exaltLord]) {
    const pos = cand && posOf(cand);
    if (!pos || !pos.sign) continue;
    if (lagnaSign && KENDRA_OFFSETS.has(signDist(lagnaSign, pos.sign))) return cand;
    if (moonSign && KENDRA_OFFSETS.has(signDist(moonSign, pos.sign))) return cand;
  }
  return null;
}

/** Push a driver unless its delta is zero. */
function add(drivers, metric, label, delta) {
  if (delta) drivers.push({ metric, label, delta });
}

function dignityDrivers(drivers, planet, sign, table, frame, posOf, lagnaSign, moonSign) {
  const state = planetDignity(planet, sign);
  if (!state || state === 'neutral') return;
  const label = state === 'own' ? 'in own sign' : state;
  for (const [metric, deltas] of Object.entries(table[planet] || {})) {
    let delta = deltas[state];
    if (!delta) continue;
    let suffix = '';
    if (state === 'debilitated') {
      const saver = neechaBhanga(sign, posOf, lagnaSign, moonSign);
      if (saver) {
        delta = Math.round(delta * WEIGHTS.neechaBhangaFactor);
        suffix = ` (cancelled by ${saver} in a kendra, neecha bhanga)`;
      }
    }
    add(drivers, metric, `${frame} ${planet} ${label} in ${sign}${suffix}`, delta);
  }
}

/**
 * @param {Object} ctx
 * @param {Object} ctx.natal    { [planet]: { sign, house } } incl. 'Ascendant'
 * @param {Object} ctx.transit  { [planet]: { sign, house, siderealLon, speed } }
 * @param {Object} [ctx.dasha]  { mahadasha: {planet}|null, antardasha: {planet}|null }
 * @param {Object} [ctx.nakshatraLord] lord of the transit Moon's nakshatra
 * @returns {{ overthinking: number, vitality: number, drivers: Array }}
 *   drivers: { metric, label, delta }, sorted by |delta| descending.
 */
function scoreDay({ natal, transit, dasha = {}, nakshatraLord = null }) {
  const drivers = [];
  const lagnaSign = natal.Ascendant && natal.Ascendant.sign;
  const natalMoonSign = natal.Moon && natal.Moon.sign;
  const t = transit || {};
  const moon = t.Moon;

  // ── natal dignity: a fixed baseline shift every day ──
  for (const planet of Object.keys(WEIGHTS.natalDignity)) {
    const n = natal[planet];
    if (!n) continue;
    dignityDrivers(drivers, planet, n.sign, WEIGHTS.natalDignity, 'Natal',
      p => natal[p], lagnaSign, natalMoonSign);
  }

  // ── transit dignity of Sun / Mars / Moon ──
  for (const planet of Object.keys(WEIGHTS.transitDignity)) {
    if (!t[planet]) continue;
    dignityDrivers(drivers, planet, t[planet].sign, WEIGHTS.transitDignity, 'Transit',
      p => t[p], lagnaSign, natalMoonSign);
  }

  if (moon) {
    const nodeSigns = [t.Rahu, t.Ketu].filter(Boolean).map(p => p.sign);
    if (nodeSigns.includes(moon.sign)) {
      add(drivers, 'overthinking', 'Moon conjunct Rahu/Ketu (Grahan yoga)', WEIGHTS.moonWithNode);
    }
    if (t.Saturn && t.Saturn.sign === moon.sign) {
      add(drivers, 'overthinking', 'Moon conjunct Saturn (Vish yoga)', WEIGHTS.moonWithSaturn);
    }
    add(drivers, 'overthinking', `Moon in house ${moon.house}`, WEIGHTS.moonHouse[moon.house]);
    if (nakshatraLord && NAKSHATRA_MALEFIC_LORDS.has(nakshatraLord)) {
      add(drivers, 'overthinking', `Moon in a ${nakshatraLord}-ruled nakshatra`, WEIGHTS.moonNakLordMalefic);
    }
    if (t.Jupiter) {
      const moonFromJupiter = signDist(t.Jupiter.sign, moon.sign) + 1; // 1 = same sign
      if (GRAHA_DRISHTI.Jupiter.includes(moonFromJupiter)) {
        add(drivers, 'overthinking', 'Jupiter aspects the Moon', WEIGHTS.jupiterOnMoon);
      }
    }
    if (t.Sun && moon.siderealLon != null && t.Sun.siderealLon != null) {
      const tithi = tithiNumber(t.Sun.siderealLon, moon.siderealLon);
      if (tithi >= 28) add(drivers, 'overthinking', 'Moon near Amavasya (new moon)', WEIGHTS.nearAmavasya);
      if (tithi >= 13 && tithi <= 15) add(drivers, 'overthinking', 'Moon near Purnima (full moon)', WEIGHTS.nearPurnima);
      const waxing = tithi <= 15;
      add(drivers, 'vitality', waxing ? 'Waxing Moon' : 'Waning Moon',
        waxing ? WEIGHTS.moonWaxing : WEIGHTS.moonWaning);
    }
  }

  if (t.Mercury) {
    if (t.Mercury.speed < 0) add(drivers, 'overthinking', 'Mercury retrograde', WEIGHTS.mercuryRetrograde);
    if (t.Sun && t.Mercury.siderealLon != null && t.Sun.siderealLon != null) {
      const sep = Math.abs(((t.Mercury.siderealLon - t.Sun.siderealLon + 540) % 360) - 180);
      if (sep <= 12) add(drivers, 'overthinking', 'Mercury combust', WEIGHTS.mercuryCombust);
    }
  }

  for (const planet of ['Sun', 'Mars']) {
    const p = t[planet];
    if (!p) continue;
    if ([3, 6, 10, 11].includes(p.house)) {
      add(drivers, 'vitality', `Transit ${planet} in house ${p.house}`, WEIGHTS.goodHouse);
    } else if ([8, 12].includes(p.house)) {
      add(drivers, 'vitality', `Transit ${planet} in house ${p.house}`, WEIGHTS.badHouse);
    }
  }

  if (t.Saturn) {
    if (natalMoonSign && t.Saturn.sign === natalMoonSign) {
      add(drivers, 'vitality', 'Saturn transiting your natal Moon sign', WEIGHTS.saturnOnNatalMoon);
    }
    if (lagnaSign && t.Saturn.sign === lagnaSign) {
      add(drivers, 'vitality', 'Saturn transiting your Lagna sign', WEIGHTS.saturnOnLagna);
    }
  }

  // ── dasha lords ──
  for (const level of ['antardasha', 'mahadasha']) {
    const lord = dasha[level] && dasha[level].planet;
    if (!lord) continue;
    if (['Moon', 'Rahu', 'Ketu'].includes(lord)) {
      add(drivers, 'overthinking', `${level === 'antardasha' ? 'Antardasha' : 'Mahadasha'} of ${lord}`,
        WEIGHTS.dashaMoonNode[level]);
    }
    const n = natal[lord];
    const state = n && planetDignity(lord, n.sign);
    if (state === 'exalted' || state === 'own') {
      add(drivers, 'vitality', `${level === 'antardasha' ? 'Antardasha' : 'Mahadasha'} lord ${lord} ${state === 'own' ? 'in own sign' : 'exalted'}`,
        WEIGHTS.dashaLord[level]);
    } else if (state === 'debilitated') {
      add(drivers, 'vitality', `${level === 'antardasha' ? 'Antardasha' : 'Mahadasha'} lord ${lord} debilitated`,
        WEIGHTS.dashaLordDebil[level]);
    }
  }

  const total = metric => Math.max(0, Math.min(100, Math.round(
    BASE + drivers.filter(d => d.metric === metric).reduce((s, d) => s + d.delta, 0),
  )));
  drivers.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  return { overthinking: total('overthinking'), vitality: total('vitality'), drivers };
}

const MAX_DRIVERS_PER_DAY = 5;

function datesOfMonth(month) {
  const [year, mon] = month.split('-').map(Number);
  const days = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  return Array.from({ length: days }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
}

/**
 * Score every day of `month` ("YYYY-MM") for one natal chart.
 * One Python batch call yields the natal chart and each day's sidereal
 * transit positions; dasha and nakshatra are computed locally per day.
 *
 * @param {Object} birthData { birthDate, birthTime, latitude, longitude, timezone (IANA) }
 * @param {string} month
 * @param {Object} [deps]   { callBatch } — injectable for tests
 */
async function computeMonth(birthData, month, deps = {}) {
  const callBatch = deps.callBatch || require('./astrology_kerykeion_bridge').callPythonBatch;
  const { computeDashaAtDate, getNakshatra } = require('./dasha');
  const { planetMap } = require('./investment-dasha');

  const dates = datesOfMonth(month);
  const { transitPositions, natalPlanets } = await callBatch({
    birthDate: birthData.birthDate,
    birthTime: birthData.birthTime,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: birthData.timezone,
    transitDates: dates,
  });

  const natal = planetMap(natalPlanets);
  const natalMoon = natal.Moon;
  const natalMoonLon = natalMoon && natalMoon.fullDegree;
  if (natalMoonLon == null) throw new Error('Could not determine natal Moon longitude');
  const birthMoment = new Date(`${birthData.birthDate}T${birthData.birthTime}:00Z`);

  const days = dates.map(date => {
    const transit = (transitPositions || {})[date];
    if (!transit || !transit.Moon) return { date, overthinking: null, vitality: null, drivers: [] };
    const dasha = computeDashaAtDate(birthMoment, natalMoonLon, new Date(`${date}T12:00:00Z`));
    const nakshatraLord = transit.Moon.siderealLon != null ? getNakshatra(transit.Moon.siderealLon).lord : null;
    const r = scoreDay({ natal, transit, dasha, nakshatraLord });
    return {
      date,
      overthinking: r.overthinking,
      vitality: r.vitality,
      drivers: r.drivers.slice(0, MAX_DRIVERS_PER_DAY),
    };
  });

  return { month, days };
}

module.exports = { scoreDay, computeMonth, datesOfMonth, tithiNumber, neechaBhanga, WEIGHTS, BASE };
