"""
Transit report engine powered by kerykeion (Swiss Ephemeris).

Replaces the external AstrologyAPI dependency with local Swiss Ephemeris
calculations via kerykeion. Uses a hybrid sidereal-tropical approach:
  - Sidereal (Lahiri) natal chart → whole-sign houses, Ascendant
  - Tropical natal chart → degree positions for aspect comparison
  - Tropical transit chart → current planet positions

Output: grouped transit stories with aspects, house rulers, dispositors,
and transit house positions.

Usage:
    from astrology_kerykeion import get_natal_transits, calculate_transit_report

    natal, natal_tropical, transit = get_natal_transits(birth_data, transit_date)
    events = calculate_transit_report(natal, natal_tropical, transit)
"""

from kerykeion import AstrologicalSubject

# ─── Constants ───────────────────────────────────────────────────────────────

SIGN_RULERS = {
    'Aries': 'Mars',      'Taurus': 'Venus',     'Gemini': 'Mercury',
    'Cancer': 'Moon',      'Leo': 'Sun',          'Virgo': 'Mercury',
    'Libra': 'Venus',      'Scorpio': 'Mars',     'Sagittarius': 'Jupiter',
    'Capricorn': 'Saturn', 'Aquarius': 'Saturn',  'Pisces': 'Jupiter',
}

SIGN_ORDER = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

# Kerykeion uses abbreviated sign names — map to full names
SIGN_ABBR_MAP = {
    'Ari': 'Aries',   'Tau': 'Taurus',      'Gem': 'Gemini',
    'Can': 'Cancer',   'Leo': 'Leo',         'Vir': 'Virgo',
    'Lib': 'Libra',    'Sco': 'Scorpio',     'Sag': 'Sagittarius',
    'Cap': 'Capricorn','Aqu': 'Aquarius',    'Pis': 'Pisces',
}

PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
SLOW_PLANETS = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
PERSONAL_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']

# Aspect types including quincunx (inconjunct) for minor aspect detection
ASPECT_TYPES = [
    {'name': 'conjunction', 'angle': 0,   'orb': 8},
    {'name': 'sextile',     'angle': 60,  'orb': 6},
    {'name': 'square',      'angle': 90,  'orb': 7},
    {'name': 'trine',       'angle': 120, 'orb': 8},
    {'name': 'quincunx',    'angle': 150, 'orb': 3},
    {'name': 'opposition',  'angle': 180, 'orb': 8},
]

# Kerykeion house attribute names → house numbers
HOUSE_ATTR_TO_NUM = {
    'First_House': 1, 'Second_House': 2, 'Third_House': 3,
    'Fourth_House': 4, 'Fifth_House': 5, 'Sixth_House': 6,
    'Seventh_House': 7, 'Eighth_House': 8, 'Ninth_House': 9,
    'Tenth_House': 10, 'Eleventh_House': 11, 'Twelfth_House': 12,
}

# Maximum number of transit stories to include in the report
MAX_STORIES = 2


# ─── Helpers ─────────────────────────────────────────────────────────────────

def full_sign(abbr):
    """Convert kerykeion abbreviated sign name to full name."""
    return SIGN_ABBR_MAP.get(abbr, abbr)


def house_num(house_str):
    """Convert kerykeion house string (e.g. 'Eighth_House') to integer."""
    return HOUSE_ATTR_TO_NUM.get(house_str, 1)


def ordinal(n):
    """Return ordinal string for a number (1st, 2nd, 3rd, 4th … 11th, 12th, 13th …)."""
    v = n % 100
    if 11 <= v <= 13:
        return f'{n}th'
    remainder = v % 10
    if remainder == 1:
        return f'{n}st'
    elif remainder == 2:
        return f'{n}nd'
    elif remainder == 3:
        return f'{n}rd'
    return f'{n}th'


def build_house_sign_map(asc_sign):
    """Build whole-sign house↔sign mappings from the Ascendant sign."""
    asc_index = SIGN_ORDER.index(asc_sign)
    house_to_sign = {}
    sign_to_house = {}
    for i in range(12):
        sign = SIGN_ORDER[(asc_index + i) % 12]
        house_to_sign[i + 1] = sign
        sign_to_house[sign] = i + 1
    return house_to_sign, sign_to_house


def normalize_angle(diff):
    """Normalize angular difference to 0–180 range."""
    d = abs(diff) % 360
    return 360 - d if d > 180 else d


def is_separating(transit_planet, natal_planet, aspect_angle):
    """Determine if the transit planet is separating from the aspect."""
    speed = transit_planet.get('speed', 0)
    current_diff = normalize_angle(transit_planet['fullDegree'] - natal_planet['fullDegree'])
    future_diff = normalize_angle((transit_planet['fullDegree'] + speed) - natal_planet['fullDegree'])
    current_orb = abs(current_diff - aspect_angle)
    future_orb = abs(future_diff - aspect_angle)
    return future_orb > current_orb


# ─── Data extraction from kerykeion subjects ─────────────────────────────────

def _extract_planet(subject, planet_name):
    """Extract a planet dict from a kerykeion AstrologicalSubject."""
    attr = planet_name.lower()
    obj = getattr(subject, attr)
    sign = full_sign(obj.sign)
    return {
        'name': planet_name,
        'sign': sign,
        'fullDegree': obj.abs_pos,
        'house': house_num(obj.house),
        'signLord': SIGN_RULERS.get(sign, ''),
        'speed': getattr(obj, 'speed', 0) or 0,
    }


# ─── Public API ──────────────────────────────────────────────────────────────

def get_natal_transits(birth_data, transit_date=None):
    """
    Compute natal and transit planetary data using kerykeion.

    Args:
        birth_data: dict with keys:
            birthDate (str "YYYY-MM-DD"), birthTime (str "HH:mm"),
            latitude (float), longitude (float),
            timezone (str, IANA timezone e.g. "Asia/Ho_Chi_Minh")
        transit_date: str "YYYY-MM-DD" or None (defaults to today)

    Returns:
        (sidereal_natal_list, tropical_natal_list, tropical_transit_list)
        Each is a list of dicts matching the astrology.js planet format.
    """
    # Parse birth data
    bd = birth_data['birthDate'].split('-')
    bt = birth_data['birthTime'].split(':')
    year, month, day = int(bd[0]), int(bd[1]), int(bd[2])
    hour, minute = int(bt[0]), int(bt[1])
    lat = birth_data['latitude']
    lng = birth_data['longitude']
    tz_str = birth_data.get('timezone', 'Asia/Ho_Chi_Minh')

    # 1. Sidereal natal (Lahiri, whole-sign) → houses, signLord, Ascendant
    sidereal = AstrologicalSubject(
        name='Natal_Sidereal',
        year=year, month=month, day=day, hour=hour, minute=minute,
        lat=lat, lng=lng, tz_str=tz_str, online=False,
        zodiac_type='Sidereal', sidereal_mode='LAHIRI',
        houses_system_identifier='W',
    )

    # 2. Tropical natal (whole-sign) → fullDegree for aspect comparison
    tropical = AstrologicalSubject(
        name='Natal_Tropical',
        year=year, month=month, day=day, hour=hour, minute=minute,
        lat=lat, lng=lng, tz_str=tz_str, online=False,
        zodiac_type='Tropical', houses_system_identifier='W',
    )

    # 3. Tropical transit → current planet positions
    if transit_date:
        td = transit_date.split('-')
        t_year, t_month, t_day = int(td[0]), int(td[1]), int(td[2])
    else:
        from datetime import date
        today = date.today()
        t_year, t_month, t_day = today.year, today.month, today.day

    transit_subj = AstrologicalSubject(
        name='Transit',
        year=t_year, month=t_month, day=t_day, hour=12, minute=0,
        lat=lat, lng=lng, tz_str=tz_str, online=False,
        zodiac_type='Tropical', houses_system_identifier='W',
    )

    # Build lists in the same format as the AstrologyAPI JSON response
    sidereal_natal = []
    asc_sign = full_sign(sidereal.first_house.sign)
    sidereal_natal.append({
        'name': 'Ascendant',
        'sign': asc_sign,
        'fullDegree': sidereal.first_house.abs_pos,
        'house': 1,
        'speed': 0,
        'signLord': SIGN_RULERS.get(asc_sign, 'Mars'),
    })
    for pname in PLANETS:
        sidereal_natal.append(_extract_planet(sidereal, pname))

    tropical_natal = []
    tropical_natal.append({
        'name': 'Ascendant',
        'sign': full_sign(tropical.first_house.sign),
        'fullDegree': tropical.first_house.abs_pos,
        'house': 1,
        'speed': 0,
    })
    for pname in PLANETS:
        tropical_natal.append(_extract_planet(tropical, pname))

    tropical_transit = []
    for pname in PLANETS:
        tropical_transit.append(_extract_planet(transit_subj, pname))

    return sidereal_natal, tropical_natal, tropical_transit


def calculate_transit_report(natal_planets, natal_planets_tropical, transit_planets):
    """
    Calculate the full transit report with grouped transit stories.

    Each story includes: the aspect, house rulers for the natal planet,
    the natal planet's dispositor, and the transit planet's house position.

    Prioritization:
      1. If Moon activates its transit house (aspects natal planets in that house),
         Moon story leads with Moon transit house shown first.
      2. Otherwise, select top stories from personal transit planets
         (excluding Moon and self-to-self) that are separating or exact,
         preferring aspects to personal natal planets.

    Args:
        natal_planets: sidereal natal list (houses, signLord, Ascendant)
        natal_planets_tropical: tropical natal list (fullDegree for aspects)
        transit_planets: tropical transit list (current positions)

    Returns:
        List of event dicts with keys: type, description, and type-specific fields.
    """
    events = []

    # Build whole-sign house system from sidereal Ascendant
    asc_entry = next((p for p in natal_planets if p['name'] == 'Ascendant'), None)
    asc_sign = asc_entry['sign'] if asc_entry else 'Aries'
    house_to_sign, sign_to_house = build_house_sign_map(asc_sign)

    # Build natal planet lookup (sidereal house + tropical degree)
    natal_map = {}
    for p in natal_planets:
        if p['name'] in PLANETS:
            trop = next((t for t in natal_planets_tropical if t['name'] == p['name']), None)
            natal_map[p['name']] = {
                'name': p['name'],
                'house': p['house'],
                'sign': p['sign'],
                'signLord': p.get('signLord') or SIGN_RULERS.get(p['sign'], ''),
                'fullDegree': trop['fullDegree'] if trop else p['fullDegree'],
                'speed': p.get('speed', 0),
            }

    # Build transit planet lookup (tropical sign → sidereal whole-sign house)
    transit_map = {}
    for p in transit_planets:
        if p['name'] in PLANETS:
            natal_house = sign_to_house.get(p['sign'], 1)
            transit_map[p['name']] = {**p, 'natalHouse': natal_house}

    # --- 1. Find ALL aspects between transit and natal planets ---
    active_aspects = []
    for transit_name in PLANETS:
        transit = transit_map.get(transit_name)
        if not transit:
            continue
        for natal_name in PLANETS:
            natal = natal_map.get(natal_name)
            if not natal:
                continue
            diff = normalize_angle(transit['fullDegree'] - natal['fullDegree'])
            for aspect_type in ASPECT_TYPES:
                orb = abs(diff - aspect_type['angle'])
                if orb <= aspect_type['orb']:
                    separating = is_separating(transit, natal, aspect_type['angle'])
                    active_aspects.append({
                        'type': 'aspect',
                        'transitPlanet': transit_name,
                        'natalPlanet': natal_name,
                        'aspect': aspect_type['name'],
                        'natalHouse': natal['house'],
                        'orb': orb,
                        'exact': orb < 1,
                        'separating': separating,
                    })

    # Sort: exact first, then tightest orb
    active_aspects.sort(key=lambda a: (-(1 if a['exact'] else 0), a['orb']))

    # --- 2. Check Moon house activation ---
    moon_house = transit_map.get('Moon', {}).get('natalHouse')
    moon_house_aspects = [
        a for a in active_aspects
        if a['transitPlanet'] == 'Moon'
        and natal_map.get(a['natalPlanet'], {}).get('house') == moon_house
    ]
    moon_activates_house = len(moon_house_aspects) > 0

    # --- 3. Select primary stories ---
    if moon_activates_house:
        # Moon story leads — use the same Moon-first logic
        primary_aspects = moon_house_aspects[:3]
    else:
        # Select from personal transit planets (excl. Moon, excl. self-to-self)
        candidates = [
            a for a in active_aspects
            if a['transitPlanet'] in PERSONAL_PLANETS
            and a['transitPlanet'] != 'Moon'
            and a['transitPlanet'] != a['natalPlanet']  # no self-to-self
        ]

        # Natal planet importance: personal > social > outer
        def _natal_priority(planet):
            if planet in PERSONAL_PLANETS:
                return 0
            if planet in ('Jupiter', 'Saturn'):
                return 1
            return 2

        # For each transit planet, pick its best aspect (natal priority first, then orb)
        best_per_transit = {}
        for a in candidates:
            tp = a['transitPlanet']
            key = (_natal_priority(a['natalPlanet']), a['orb'])
            prev = best_per_transit.get(tp)
            if prev is None or key < (_natal_priority(prev['natalPlanet']), prev['orb']):
                best_per_transit[tp] = a

        # Rank transit planets by their best aspect's orb (tightest first)
        ranked = sorted(best_per_transit.values(), key=lambda a: a['orb'])

        # Select top MAX_STORIES, then order by natal priority for display
        selected = ranked[:MAX_STORIES]
        primary_aspects = sorted(
            selected,
            key=lambda a: (_natal_priority(a['natalPlanet']), a['orb']),
        )

    # --- 4. Build grouped event list ---
    if moon_activates_house:
        # Moon activation: Moon transit house first, then Moon aspects with support
        if transit_map.get('Moon'):
            events.append({
                'type': 'transit_house',
                'planet': 'Moon',
                'house': moon_house,
                'description': f'Moon Transits the {ordinal(moon_house)} House',
            })
        for aspect in primary_aspects:
            _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                              include_transit_house=False, use_specific_aspect_name=True)
    else:
        # Non-Moon stories: each aspect gets a full story group
        for i, aspect in enumerate(primary_aspects):
            # Show transit house after each story's supporting events
            # (serves as a separator between stories)
            is_ending = aspect['separating'] and not aspect['exact']
            _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                              include_transit_house=is_ending,
                              use_specific_aspect_name=False)

        # --- 5. Moon stories for social natal planets (Jupiter/Saturn) ---
        # When Moon aspects a social planet not already in primary stories,
        # add that aspect with rulers/dispositor (no exact/ends qualifier).
        involved_natal = {a['natalPlanet'] for a in primary_aspects}
        involved_transit = {a['transitPlanet'] for a in primary_aspects}
        moon_social_aspects = [
            a for a in active_aspects
            if a['transitPlanet'] == 'Moon'
            and a['natalPlanet'] in ('Jupiter', 'Saturn')
            and a['natalPlanet'] not in involved_natal
            and a['orb'] < 4
        ]
        moon_social_aspects.sort(key=lambda a: a['orb'])
        for aspect in moon_social_aspects:
            # Suppress exact/ends qualifier for Moon social aspects
            moon_aspect = {**aspect, 'exact': False, 'separating': False}
            _add_aspect_story(events, moon_aspect, natal_map, transit_map, house_to_sign,
                              include_transit_house=False, use_specific_aspect_name=False)

        # --- 6. Mercury transit house (when Mercury not in primary stories) ---
        if 'Mercury' not in involved_transit and transit_map.get('Mercury'):
            merc_house = transit_map['Mercury']['natalHouse']
            events.append({
                'type': 'transit_house',
                'planet': 'Mercury',
                'house': merc_house,
                'description': f'Mercury Transits the {ordinal(merc_house)} House',
            })

    return events


def _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                      include_transit_house=False, use_specific_aspect_name=True):
    """
    Append a complete transit story to the events list:
      1. The aspect itself
      2. House rulers for the aspected natal planet
      3. Dispositor (sign lord) of the aspected natal planet
      4. (Optional) Transit house for the transit planet
    """
    transit_name = aspect['transitPlanet']
    natal_name = aspect['natalPlanet']
    natal = natal_map.get(natal_name)

    # 1. Aspect description
    if use_specific_aspect_name:
        aspect_label = aspect['aspect']
    else:
        aspect_label = 'aspect'

    if aspect['exact']:
        aspect['description'] = (
            f"{transit_name} {aspect_label} {natal_name} "
            f"in {ordinal(aspect['natalHouse'])} house : Exact"
        )
    elif aspect['separating']:
        aspect['description'] = (
            f"{transit_name} {aspect_label} {natal_name} "
            f"in {ordinal(aspect['natalHouse'])} house : Ends"
        )
    else:
        aspect['description'] = (
            f"{transit_name} {aspect_label} {natal_name} "
            f"in {ordinal(aspect['natalHouse'])} house"
        )
    events.append(aspect)

    if not natal:
        return

    # 2. House rulers — which houses does the natal planet rule?
    for house_num_val in range(1, 13):
        cusp_sign = house_to_sign.get(house_num_val)
        if cusp_sign and SIGN_RULERS.get(cusp_sign) == natal_name:
            events.append({
                'type': 'ruler',
                'planet': natal_name,
                'rulesHouse': house_num_val,
                'inHouse': natal['house'],
                'description': (
                    f'{natal_name} ruler of the {ordinal(house_num_val)} House '
                    f'in the {ordinal(natal["house"])} House'
                ),
            })

    # 3. Dispositor — sign lord of the natal planet's sign
    dispositor_name = natal['signLord']
    if dispositor_name and dispositor_name != natal_name:
        dispositor_natal = natal_map.get(dispositor_name)
        if dispositor_natal:
            events.append({
                'type': 'dispositor',
                'planet': dispositor_name,
                'house': dispositor_natal['house'],
                'forPlanet': natal_name,
                'description': f'{dispositor_name} in {ordinal(dispositor_natal["house"])} (Dispositor)',
            })

    # 4. Transit house (where the transit planet currently sits)
    if include_transit_house:
        transit_data = transit_map.get(transit_name)
        if transit_data:
            t_house = transit_data['natalHouse']
            events.append({
                'type': 'transit_house',
                'planet': transit_name,
                'house': t_house,
                'description': f'{transit_name} Transits the {ordinal(t_house)} House',
            })


# ─── JSON bridge mode (called by Node.js) ───────────────────────────────────

def _run_json_bridge():
    """
    Read JSON from stdin, compute transit report, write JSON to stdout.

    Expected stdin JSON:
    {
      "birthDate": "1991-12-29",
      "birthTime": "13:30",
      "latitude": 10.7755,
      "longitude": 106.7021,
      "timezone": "Asia/Ho_Chi_Minh",
      "transitDate": "2026-04-02"   // optional
    }

    Output JSON:
    {
      "natalPlanets": [...],
      "natalPlanetsTropical": [...],
      "transitPlanets": [...],
      "transitEvents": [...]
    }
    """
    import sys
    import json

    try:
        input_data = json.loads(sys.stdin.read())

        birth_data = {
            'birthDate': input_data['birthDate'],
            'birthTime': input_data['birthTime'],
            'latitude': input_data['latitude'],
            'longitude': input_data['longitude'],
            'timezone': input_data.get('timezone', 'Asia/Ho_Chi_Minh'),
        }
        transit_date = input_data.get('transitDate')

        sidereal, tropical, transit = get_natal_transits(birth_data, transit_date)
        events = calculate_transit_report(sidereal, tropical, transit)

        result = {
            'natalPlanets': sidereal,
            'natalPlanetsTropical': tropical,
            'transitPlanets': transit,
            'transitEvents': events,
        }

        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    import sys
    if '--json' in sys.argv:
        _run_json_bridge()
    else:
        # Manual test runner moved to tests/astrology_kerykeion_test.py
        print('Run tests with: pytest tests/astrology_kerykeion_test.py -v')
        print('Or manual output: python tests/astrology_kerykeion_test.py')
