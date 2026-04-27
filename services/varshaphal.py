"""
Varshaphal (Tajika annual horoscope) engine — powers /api/yearly-summary
and /api/monthly-prediction.

Implements:
  - Solar return (Varshapravesh) moment finding by sidereal Sun longitude
  - Annual chart (whole-sign sidereal at Varshapravesh)
  - Muntha placement (advances 1 sign per year from birth Lagna)
  - Sarvashtavarga (Parashari Ashtakavarga) bindu totals per natal sign
  - Sun sidereal ingress dates for the year window (monthly periods)

JSON CLI modes:
  python services/varshaphal.py --varshaphal   < {birth, year}
  python services/varshaphal.py --monthly      < {birth, year}
"""

import json
import sys
from datetime import datetime, timedelta, timezone

from kerykeion import AstrologicalSubject

SIGN_ORDER = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

# Vedic sign names (Sanskrit) — what the Yearly.docx report uses.
VEDIC_SIGN = {
    'Aries': 'Mesha', 'Taurus': 'Vrishabha', 'Gemini': 'Mithuna',
    'Cancer': 'Karkata', 'Leo': 'Simha', 'Virgo': 'Kanya',
    'Libra': 'Tula', 'Scorpio': 'Vrischika', 'Sagittarius': 'Dhanu',
    'Capricorn': 'Makara', 'Aquarius': 'Kumbha', 'Pisces': 'Meena',
}

SIGN_RULERS = {
    'Aries': 'Mars',     'Taurus': 'Venus',     'Gemini': 'Mercury',
    'Cancer': 'Moon',    'Leo': 'Sun',          'Virgo': 'Mercury',
    'Libra': 'Venus',    'Scorpio': 'Mars',     'Sagittarius': 'Jupiter',
    'Capricorn': 'Saturn','Aquarius': 'Saturn', 'Pisces': 'Jupiter',
}

SIGN_ABBR = {
    'Ari': 'Aries', 'Tau': 'Taurus', 'Gem': 'Gemini', 'Can': 'Cancer',
    'Leo': 'Leo', 'Vir': 'Virgo', 'Lib': 'Libra', 'Sco': 'Scorpio',
    'Sag': 'Sagittarius', 'Cap': 'Capricorn', 'Aqu': 'Aquarius', 'Pis': 'Pisces',
}

PLANET_ATTRS = {
    'Sun': 'sun', 'Moon': 'moon', 'Mars': 'mars', 'Mercury': 'mercury',
    'Jupiter': 'jupiter', 'Venus': 'venus', 'Saturn': 'saturn',
}

# ─── Ashtakavarga rules (Parashari) ──────────────────────────────────────────
# For each contributing point (8 total: 7 planets + Lagna), the set of houses
# (counted inclusively from the contributor's sign, so 1 = the contributor's
# own sign) that receive a bindu in the BAV of the target planet.

BAV_RULES = {
    'Sun': {
        'Sun':     {1, 2, 4, 7, 8, 9, 10, 11},
        'Moon':    {3, 6, 10, 11},
        'Mars':    {1, 2, 4, 7, 8, 10, 11},
        'Mercury': {3, 5, 6, 9, 10, 11, 12},
        'Jupiter': {5, 6, 9, 11},
        'Venus':   {6, 7, 12},
        'Saturn':  {1, 2, 4, 7, 8, 9, 10, 11},
        'Lagna':   {3, 4, 6, 10, 11, 12},
    },
    'Moon': {
        'Sun':     {3, 6, 7, 8, 10, 11},
        'Moon':    {1, 3, 6, 7, 10, 11},
        'Mars':    {2, 3, 5, 6, 9, 10, 11},
        'Mercury': {1, 3, 4, 5, 7, 8, 10, 11},
        'Jupiter': {1, 4, 7, 8, 10, 11, 12},
        'Venus':   {3, 4, 5, 7, 9, 10, 11},
        'Saturn':  {3, 5, 6, 11},
        'Lagna':   {3, 6, 10, 11},
    },
    'Mars': {
        'Sun':     {3, 5, 6, 10, 11},
        'Moon':    {3, 6, 11},
        'Mars':    {1, 2, 4, 7, 8, 10, 11},
        'Mercury': {3, 5, 6, 11},
        'Jupiter': {6, 10, 11, 12},
        'Venus':   {6, 8, 11, 12},
        'Saturn':  {1, 4, 7, 8, 9, 10, 11},
        'Lagna':   {1, 3, 6, 10, 11},
    },
    'Mercury': {
        'Sun':     {5, 6, 9, 11, 12},
        'Moon':    {2, 4, 6, 8, 10, 11},
        'Mars':    {1, 2, 4, 7, 8, 9, 10, 11},
        'Mercury': {1, 3, 5, 6, 9, 10, 11, 12},
        'Jupiter': {6, 8, 11, 12},
        'Venus':   {1, 2, 3, 4, 5, 8, 9, 11},
        'Saturn':  {1, 2, 4, 7, 8, 9, 10, 11},
        'Lagna':   {1, 2, 4, 6, 8, 10, 11},
    },
    'Jupiter': {
        'Sun':     {1, 2, 3, 4, 7, 8, 9, 10, 11},
        'Moon':    {2, 5, 7, 9, 11},
        'Mars':    {1, 2, 4, 7, 8, 10, 11},
        'Mercury': {1, 2, 4, 5, 6, 9, 10, 11},
        'Jupiter': {1, 2, 3, 4, 7, 8, 10, 11},
        'Venus':   {2, 5, 6, 9, 10, 11},
        'Saturn':  {3, 5, 6, 12},
        'Lagna':   {1, 2, 4, 5, 6, 7, 9, 10, 11},
    },
    'Venus': {
        'Sun':     {8, 11, 12},
        'Moon':    {1, 2, 3, 4, 5, 8, 9, 11, 12},
        'Mars':    {3, 5, 6, 9, 11, 12},
        'Mercury': {3, 5, 6, 9, 11},
        'Jupiter': {5, 8, 9, 10, 11},
        'Venus':   {1, 2, 3, 4, 5, 8, 9, 10, 11},
        'Saturn':  {3, 4, 5, 8, 9, 10, 11},
        'Lagna':   {1, 2, 3, 4, 5, 8, 9, 11},
    },
    'Saturn': {
        'Sun':     {1, 2, 4, 7, 8, 10, 11},
        'Moon':    {3, 6, 11},
        'Mars':    {3, 5, 6, 10, 11, 12},
        'Mercury': {6, 8, 9, 10, 11, 12},
        'Jupiter': {5, 6, 11, 12},
        'Venus':   {6, 11, 12},
        'Saturn':  {3, 5, 6, 11},
        'Lagna':   {1, 3, 4, 6, 10, 11},
    },
}


def full_sign(abbr):
    return SIGN_ABBR.get(abbr, abbr)


def vedic(name):
    return VEDIC_SIGN.get(name, name)


def sign_index(name):
    """0-based index in SIGN_ORDER. Aries → 0."""
    return SIGN_ORDER.index(name)


def parse_birth(birth_data):
    bd = birth_data['birthDate'].split('-')
    bt = birth_data['birthTime'].split(':')
    return {
        'year': int(bd[0]), 'month': int(bd[1]), 'day': int(bd[2]),
        'hour': int(bt[0]), 'minute': int(bt[1]),
        'lat': birth_data['latitude'], 'lng': birth_data['longitude'],
        'tz': birth_data.get('timezone', 'Asia/Ho_Chi_Minh'),
    }


def make_subject(name, when, lat, lng, tz):
    """Build a sidereal-Lahiri whole-sign AstrologicalSubject at `when` (UTC datetime)."""
    return AstrologicalSubject(
        name=name,
        year=when.year, month=when.month, day=when.day,
        hour=when.hour, minute=when.minute,
        lat=lat, lng=lng, tz_str=tz, online=False,
        zodiac_type='Sidereal', sidereal_mode='LAHIRI',
        houses_system_identifier='W',
    )


def sun_sidereal_longitude(when, lat, lng, tz):
    """Sidereal Sun longitude (degrees, 0-360) at the given moment."""
    s = make_subject('SunProbe', when, lat, lng, tz)
    return s.sun.abs_pos


def find_varshapravesh(birth, year):
    """Return UTC datetime in `year` when sidereal Sun matches the natal Sun
    longitude (Varshapravesh = solar return). Uses scan + bisect.
    """
    natal_when = datetime(birth['year'], birth['month'], birth['day'],
                          birth['hour'], birth['minute'])
    natal_sun = sun_sidereal_longitude(natal_when, birth['lat'], birth['lng'], birth['tz'])

    # Sun moves ~0.985°/day. The return falls within ±2 days of the same
    # calendar day in `year`. Scan a 5-day window, then bisect.
    base = datetime(year, birth['month'], birth['day'])
    samples = []
    for offset_hours in range(-72, 73, 6):  # 5 days, every 6 hours
        when = base + timedelta(hours=offset_hours)
        lon = sun_sidereal_longitude(when, birth['lat'], birth['lng'], birth['tz'])
        diff = ((lon - natal_sun + 540) % 360) - 180  # signed shortest arc
        samples.append((when, diff))

    # Find adjacent samples bracketing the zero-crossing.
    bracket = None
    for i in range(len(samples) - 1):
        a, b = samples[i], samples[i + 1]
        if a[1] == 0:
            return a[0]
        if a[1] * b[1] < 0:
            bracket = (a, b)
            break
    if bracket is None:
        # Fallback: pick the closest sample.
        return min(samples, key=lambda s: abs(s[1]))[0]

    # Bisect to within 1 minute.
    lo_t, lo_d = bracket[0]
    hi_t, hi_d = bracket[1]
    while (hi_t - lo_t) > timedelta(minutes=1):
        mid_t = lo_t + (hi_t - lo_t) / 2
        mid_d = ((sun_sidereal_longitude(mid_t, birth['lat'], birth['lng'], birth['tz'])
                  - natal_sun + 540) % 360) - 180
        if lo_d * mid_d <= 0:
            hi_t, hi_d = mid_t, mid_d
        else:
            lo_t, lo_d = mid_t, mid_d
    return lo_t + (hi_t - lo_t) / 2


def planet_data(subject, planet_name):
    """Sign + sidereal absolute longitude for a planet on a kerykeion subject."""
    obj = getattr(subject, PLANET_ATTRS[planet_name])
    return {'sign': full_sign(obj.sign), 'fullDegree': obj.abs_pos}


def lagna_sign(subject):
    return full_sign(subject.first_house.sign)


def house_of_sign(asc_sign, target_sign):
    """Whole-sign house number (1..12) of `target_sign` when Lagna = asc_sign."""
    return ((sign_index(target_sign) - sign_index(asc_sign)) % 12) + 1


def find_varshapravesh_for_forecast_year(birth, calendar_year):
    """Return the Varshapravesh whose Tajika year covers the majority of
    `calendar_year`. This matches how Tajika-derived reports (incl. the
    Yearly.docx reference) label their output: a "2025 yearly horoscope" for
    a Dec 29 birthday is the Tajika year that *starts* on Dec 29, 2024 — not
    the one that starts on Dec 29, 2025.

    Heuristic: a Tajika year always starts on the user's birthday. The Pravesh
    in (calendar_year - 1) covers the early part of `calendar_year`; the
    Pravesh in `calendar_year` covers the later part. Whichever fraction is
    larger picks the Pravesh; the cutoff is the birthday's day-of-year vs
    midyear (~day 183).
    """
    bd_doy = (datetime(birth['year'], birth['month'], birth['day'])
              - datetime(birth['year'], 1, 1)).days + 1
    # If birthday is in the second half of the year, the Pravesh in
    # (calendar_year - 1) covers more days of `calendar_year`.
    pravesh_year = calendar_year - 1 if bd_doy > 183 else calendar_year
    return find_varshapravesh(birth, pravesh_year)


def compute_age_at_pravesh(birth, pravesh_dt):
    """Tajika age = whole years elapsed from birth to Varshapravesh (year 1 = 0th
    birthday solar return). Doc shows year 34 for someone born 1991-12-29
    with pravesh on 2024-12-29 → age = 33. We map this to a 1-based "Tajika year"
    label of 34, so callers can render it as "Year : 34"."""
    nb = datetime(birth['year'], birth['month'], birth['day'])
    elapsed = pravesh_dt.year - nb.year
    if (pravesh_dt.month, pravesh_dt.day) < (nb.month, nb.day):
        elapsed -= 1
    return elapsed  # completed years (0-based age); Tajika year label = elapsed + 1


def muntha_sign(birth_lagna, age_completed):
    """Muntha advances by one sign per year starting at birth Lagna in year 1
    (age_completed = 0). For age N, Muntha sign index = (lagna + N) % 12."""
    return SIGN_ORDER[(sign_index(birth_lagna) + age_completed) % 12]


# ─── Ashtakavarga ─────────────────────────────────────────────────────────────

def bav_for_planet(target_planet, contributor_signs):
    """Return [bindus per sign] (length 12) for the BAV of `target_planet`.
    `contributor_signs` is a dict mapping each contributor name (Sun, Moon,
    Mars, Mercury, Jupiter, Venus, Saturn, Lagna) to its sign name."""
    rules = BAV_RULES[target_planet]
    bindus = [0] * 12
    for contributor, good_houses in rules.items():
        contrib_sign = contributor_signs[contributor]
        contrib_idx = sign_index(contrib_sign)
        for house in good_houses:
            target_idx = (contrib_idx + (house - 1)) % 12
            bindus[target_idx] += 1
    return bindus


def sarvashtavarga(contributor_signs):
    """Sum of BAV for the 7 planets across each sign. Returns dict
    {sign_name: total_bindus} with total summing to 337."""
    totals = [0] * 12
    per_planet = {}
    for planet in BAV_RULES:
        bav = bav_for_planet(planet, contributor_signs)
        per_planet[planet] = {SIGN_ORDER[i]: bav[i] for i in range(12)}
        for i in range(12):
            totals[i] += bav[i]
    return {
        'sarvashtavarga': {SIGN_ORDER[i]: totals[i] for i in range(12)},
        'bav': per_planet,
    }


# ─── Annual chart + factors ───────────────────────────────────────────────────

def build_annual_chart(birth, pravesh_dt):
    """Build the annual chart (sidereal whole-sign at Varshapravesh).
    Returns dict with annualLagna, planets (with house), birthLagna sign."""
    natal = make_subject(
        'Natal',
        datetime(birth['year'], birth['month'], birth['day'],
                 birth['hour'], birth['minute']),
        birth['lat'], birth['lng'], birth['tz'],
    )
    annual = make_subject('Annual', pravesh_dt, birth['lat'], birth['lng'], birth['tz'])

    annual_lagna = lagna_sign(annual)
    birth_lagna = lagna_sign(natal)

    planets = []
    for pname in PLANET_ATTRS:
        pd = planet_data(annual, pname)
        planets.append({
            'name': pname,
            'sign': pd['sign'],
            'house': house_of_sign(annual_lagna, pd['sign']),
            'longitude': pd['fullDegree'],
        })

    # Lunar nodes for context (Rahu only — Ketu is opposite).
    rahu_attr = 'true_north_lunar_node' if hasattr(annual, 'true_north_lunar_node') else 'true_node'
    rahu_obj = getattr(annual, rahu_attr)
    rahu_sign = full_sign(rahu_obj.sign)
    planets.append({
        'name': 'Rahu',
        'sign': rahu_sign,
        'house': house_of_sign(annual_lagna, rahu_sign),
        'longitude': rahu_obj.abs_pos,
    })
    ketu_sign = SIGN_ORDER[(sign_index(rahu_sign) + 6) % 12]
    planets.append({
        'name': 'Ketu',
        'sign': ketu_sign,
        'house': house_of_sign(annual_lagna, ketu_sign),
        'longitude': (rahu_obj.abs_pos + 180) % 360,
    })

    return {
        'annualLagna': annual_lagna,
        'birthLagna': birth_lagna,
        'planets': planets,
    }


def natal_signs(birth):
    """Return the dict needed by sarvashtavarga(): each contributor → sign."""
    natal = make_subject(
        'Natal',
        datetime(birth['year'], birth['month'], birth['day'],
                 birth['hour'], birth['minute']),
        birth['lat'], birth['lng'], birth['tz'],
    )
    out = {'Lagna': lagna_sign(natal)}
    for pname in PLANET_ATTRS:
        out[pname] = planet_data(natal, pname)['sign']
    return out


# ─── JSON entry points ────────────────────────────────────────────────────────

def _serialize_dt(dt):
    return dt.strftime('%Y-%m-%dT%H:%M:%S')


def _run_varshaphal():
    """stdin: { birthDate, birthTime, latitude, longitude, timezone, year }
    stdout: { varshapravesh, annualChart, muntha, sarvashtavarga, ... }"""
    payload = json.loads(sys.stdin.read())
    birth = parse_birth(payload)
    forecast_year = int(payload['year'])

    pravesh_dt = find_varshapravesh_for_forecast_year(birth, forecast_year)
    chart = build_annual_chart(birth, pravesh_dt)

    age_completed = compute_age_at_pravesh(birth, pravesh_dt)
    tajika_year = age_completed + 1

    m_sign = muntha_sign(chart['birthLagna'], age_completed)
    m_house = house_of_sign(chart['annualLagna'], m_sign)
    m_lord = SIGN_RULERS[m_sign]
    m_lord_planet = next((p for p in chart['planets'] if p['name'] == m_lord), None)

    birth_lagna_house = house_of_sign(chart['annualLagna'], chart['birthLagna'])

    sav = sarvashtavarga(natal_signs(birth))

    out = {
        'varshapravesh': {
            'datetime': _serialize_dt(pravesh_dt),
            'tajikaYear': tajika_year,
            'ageCompleted': age_completed,
        },
        'annualChart': {
            'lagna': chart['annualLagna'],
            'lagnaVedic': vedic(chart['annualLagna']),
            'lagnaLord': SIGN_RULERS[chart['annualLagna']],
            'birthLagna': chart['birthLagna'],
            'birthLagnaVedic': vedic(chart['birthLagna']),
            'birthLagnaLord': SIGN_RULERS[chart['birthLagna']],
            'birthLagnaHouseInAnnual': birth_lagna_house,
            'planets': [
                {**p, 'signVedic': vedic(p['sign'])} for p in chart['planets']
            ],
        },
        'muntha': {
            'sign': m_sign,
            'signVedic': vedic(m_sign),
            'house': m_house,
            'lord': m_lord,
            'lordHouseInAnnual': m_lord_planet['house'] if m_lord_planet else None,
            'lordSign': m_lord_planet['sign'] if m_lord_planet else None,
        },
        'sarvashtavarga': {
            **{vedic(s): v for s, v in sav['sarvashtavarga'].items()},
            '_western': sav['sarvashtavarga'],
        },
    }
    print(json.dumps(out))


def _run_monthly():
    """stdin: { birthDate, birthTime, latitude, longitude, timezone, year }
    stdout: { periods: [{ fromDate, toDate, sunSign, sunSignVedic,
                          sarvashtavargaPoints, jupiterSign, jupiterSignVedic,
                          sunHouseFromMoon, jupiterHouseFromMoon }] }"""
    payload = json.loads(sys.stdin.read())
    birth = parse_birth(payload)
    forecast_year = int(payload['year'])

    # Period start = Varshapravesh date. Period end = next Varshapravesh.
    # Forecast-year semantics: pick the Pravesh whose Tajika year covers most
    # of `forecast_year`, matching the reference Yearly.docx labelling.
    pravesh = find_varshapravesh_for_forecast_year(birth, forecast_year)
    # Next Pravesh is exactly one Tajika year later — its calendar year is
    # +1 from the Pravesh's actual calendar year (not forecast_year+1).
    next_pravesh = find_varshapravesh(birth, pravesh.year + 1)

    # Find Sun sidereal sign ingresses inside [pravesh, next_pravesh].
    # Sun moves ~1°/day; sample daily and bisect crossings.
    def sun_sign_at(dt):
        lon = sun_sidereal_longitude(dt, birth['lat'], birth['lng'], birth['tz'])
        return SIGN_ORDER[int(lon // 30)]

    def find_ingress(after_dt, before_dt):
        """Bisect for the moment Sun enters a new sidereal sign in (after, before]."""
        a, b = after_dt, before_dt
        sign_a = sun_sign_at(a)
        # Linear scan day-by-day to bracket.
        cursor = a
        prev_sign = sign_a
        while cursor < b:
            cursor = cursor + timedelta(days=1)
            cur_sign = sun_sign_at(cursor)
            if cur_sign != prev_sign:
                # Bisect (a..cursor) for the change.
                lo, hi = cursor - timedelta(days=1), cursor
                lo_sign = prev_sign
                while (hi - lo) > timedelta(minutes=15):
                    mid = lo + (hi - lo) / 2
                    mid_sign = sun_sign_at(mid)
                    if mid_sign == lo_sign:
                        lo = mid
                    else:
                        hi = mid
                return hi, cur_sign
            prev_sign = cur_sign
        return None, sign_a

    # Compute natal Moon house (used to map Sun/Jupiter transit house from Moon).
    natal_when = datetime(birth['year'], birth['month'], birth['day'],
                          birth['hour'], birth['minute'])
    natal = make_subject('Natal', natal_when, birth['lat'], birth['lng'], birth['tz'])
    moon_sign = full_sign(natal.moon.sign)

    sav = sarvashtavarga(natal_signs(birth))['sarvashtavarga']

    # Build periods.
    periods = []
    period_start = pravesh
    while period_start < next_pravesh:
        # The period ends at the next Sun-sign ingress (or the next Varshapravesh,
        # whichever is sooner).
        next_ingress, _ = find_ingress(period_start, next_pravesh)
        period_end = next_ingress if next_ingress and next_ingress < next_pravesh else next_pravesh

        sun_sign = sun_sign_at(period_start + timedelta(hours=1))
        # Jupiter sign at period start (sidereal).
        jup_subj = make_subject('JupProbe', period_start, birth['lat'], birth['lng'], birth['tz'])
        jup_sign = full_sign(jup_subj.jupiter.sign)

        sun_house_from_moon = house_of_sign(moon_sign, sun_sign)
        jup_house_from_moon = house_of_sign(moon_sign, jup_sign)

        periods.append({
            'fromDate': period_start.strftime('%Y-%m-%d'),
            'toDate': period_end.strftime('%Y-%m-%d'),
            'sunSign': sun_sign,
            'sunSignVedic': vedic(sun_sign),
            'jupiterSign': jup_sign,
            'jupiterSignVedic': vedic(jup_sign),
            'sarvashtavargaPoints': sav[sun_sign],
            'sunHouseFromMoon': sun_house_from_moon,
            'jupiterHouseFromMoon': jup_house_from_moon,
        })

        if period_end == next_pravesh:
            break
        period_start = period_end

    out = {
        'varshapravesh': _serialize_dt(pravesh),
        'nextVarshapravesh': _serialize_dt(next_pravesh),
        'natalMoonSign': moon_sign,
        'natalMoonSignVedic': vedic(moon_sign),
        'periods': periods,
    }
    print(json.dumps(out))


if __name__ == '__main__':
    try:
        if '--varshaphal' in sys.argv:
            _run_varshaphal()
        elif '--monthly' in sys.argv:
            _run_monthly()
        else:
            print(json.dumps({'error': 'mode not specified (--varshaphal or --monthly)'}),
                  file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        import traceback
        sys.stderr.write(traceback.format_exc())
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
