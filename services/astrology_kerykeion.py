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
LUNAR_NODES = ['Rahu', 'Ketu']
NATAL_TARGETS = PLANETS + LUNAR_NODES  # All bodies that can be aspected natally
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


def _extract_node(subject, node_name):
    """Extract a lunar node dict from a kerykeion AstrologicalSubject.

    node_name: 'Rahu' (true_node) or 'Ketu' (true_south_node)
    """
    # Try v5 names first, fall back to legacy names
    if node_name == 'Rahu':
        attr = 'true_north_lunar_node' if hasattr(subject, 'true_north_lunar_node') else 'true_node'
    else:
        attr = 'true_south_lunar_node' if hasattr(subject, 'true_south_lunar_node') else 'true_south_node'
    obj = getattr(subject, attr)
    sign = full_sign(obj.sign)
    return {
        'name': node_name,
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

    # 4. Sidereal transit — used only to get each transit planet's sidereal
    #    sign, which determines which natal whole-sign house it occupies.
    #    Tropical fullDegree is still used for aspect calculations.
    transit_sid = AstrologicalSubject(
        name='Transit_Sidereal',
        year=t_year, month=t_month, day=t_day, hour=12, minute=0,
        lat=lat, lng=lng, tz_str=tz_str, online=False,
        zodiac_type='Sidereal', sidereal_mode='LAHIRI',
        houses_system_identifier='W',
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
    for nname in LUNAR_NODES:
        sidereal_natal.append(_extract_node(sidereal, nname))

    tropical_natal = []
    tropical_natal.append({
        'name': 'Ascendant',
        'sign': full_sign(tropical.first_house.sign),
        'fullDegree': tropical.first_house.abs_pos,
        'house': 1,
        'speed': 0,
    })
    mc_sign = full_sign(tropical.tenth_house.sign)
    tropical_natal.append({
        'name': 'MC',
        'sign': mc_sign,
        'fullDegree': tropical.tenth_house.abs_pos,
        'house': 10,
        'speed': 0,
        'signLord': SIGN_RULERS.get(mc_sign, ''),
    })
    for pname in PLANETS:
        tropical_natal.append(_extract_planet(tropical, pname))
    for nname in LUNAR_NODES:
        tropical_natal.append(_extract_node(tropical, nname))

    tropical_transit = []
    for pname in PLANETS:
        p = _extract_planet(transit_subj, pname)
        p_sid = _extract_planet(transit_sid, pname)
        p['sidereal_sign'] = p_sid['sign']
        p['sidereal_abs_pos'] = p_sid['fullDegree']
        tropical_transit.append(p)
    for nname in LUNAR_NODES:
        p = _extract_node(transit_subj, nname)
        p_sid = _extract_node(transit_sid, nname)
        p['sidereal_sign'] = p_sid['sign']
        p['sidereal_abs_pos'] = p_sid['fullDegree']
        tropical_transit.append(p)

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
        if p['name'] in NATAL_TARGETS:
            trop = next((t for t in natal_planets_tropical if t['name'] == p['name']), None)
            natal_map[p['name']] = {
                'name': p['name'],
                'house': p['house'],
                'sign': p['sign'],
                'signLord': p.get('signLord') or SIGN_RULERS.get(p['sign'], ''),
                'fullDegree': trop['fullDegree'] if trop else p['fullDegree'],
                'speed': p.get('speed', 0),
            }

    # Add MC (Midheaven) to natal_map as an aspectable angle
    mc_entry = next((p for p in natal_planets_tropical if p['name'] == 'MC'), None)
    if mc_entry:
        mc_sign = mc_entry['sign']
        natal_map['MC'] = {
            'name': 'MC',
            'house': 10,
            'sign': mc_sign,
            'signLord': mc_entry.get('signLord') or SIGN_RULERS.get(mc_sign, ''),
            'fullDegree': mc_entry['fullDegree'],
            'speed': 0,
        }

    # Build transit planet lookup using tropical sign for behavioral logic
    # (moon_activates_house, inner-planet house display). A separate
    # moon_display_house is computed from sidereal position for the Moon
    # transit house event only.
    transit_map = {}
    for p in transit_planets:
        if p['name'] in NATAL_TARGETS:
            natal_house = sign_to_house.get(p['sign'], 1)
            transit_map[p['name']] = {**p, 'natalHouse': natal_house}

    # --- 1. Find ALL aspects between transit and natal planets ---
    active_aspects = []
    for transit_name in NATAL_TARGETS:
        transit = transit_map.get(transit_name)
        if not transit:
            continue
        for natal_name in NATAL_TARGETS:
            # Skip all node-to-node aspects (same node or cross-node)
            if transit_name in LUNAR_NODES and natal_name in LUNAR_NODES:
                continue
            natal = natal_map.get(natal_name)
            if not natal:
                continue
            diff = normalize_angle(transit['fullDegree'] - natal['fullDegree'])
            for aspect_type in ASPECT_TYPES:
                orb = abs(diff - aspect_type['angle'])
                if orb <= aspect_type['orb']:
                    # Allow self-to-self only when exact — a planet exactly
                    # aspecting its own natal position (e.g. Mercury opposite
                    # natal Mercury) is significant; loose self-aspects are not.
                    if transit_name == natal_name and transit_name != 'Moon' and orb >= 1:
                        continue
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

    # Compute display house from sidereal position (EOD check).
    # Moon can cross a sidereal sign boundary during the calendar day (~12°/day).
    # Use end-of-day (noon + 12h) sidereal position to capture late-day crossings.
    moon_display_house = moon_house
    moon_tp = next((p for p in transit_planets if p['name'] == 'Moon'), None)
    if moon_tp and moon_tp.get('sidereal_abs_pos') is not None:
        sid_pos_noon = moon_tp['sidereal_abs_pos']
        sid_pos_eod = (sid_pos_noon + moon_tp.get('speed', 12) * 0.5) % 360
        sid_sign_eod = SIGN_ORDER[int(sid_pos_eod // 30)]
        sid_sign_noon = SIGN_ORDER[int(sid_pos_noon // 30)]
        display_sign = sid_sign_eod if sid_sign_eod != sid_sign_noon else sid_sign_noon
        moon_display_house = sign_to_house.get(display_sign, moon_house)

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

        # Natal planet importance: Moon (luminary) > personal > social > outer
        # Moon gets top priority as natal target because it is the primary
        # luminary for daily transit activations.
        def _natal_priority(planet):
            if planet == 'Moon':
                return 0  # Moon (luminary) — highest natal priority
            if planet in PERSONAL_PLANETS:
                return 1  # Sun, Mercury, Venus, Mars
            if planet in ('Jupiter', 'Saturn'):
                return 2  # social
            return 3  # outer

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

        # Also include exact aspects (orb < 1°) from personal transit planets
        # not yet represented, but only when the natal target is also a
        # personal planet. This catches cases where best_per_transit picked a
        # higher-priority (e.g. Moon) but loose natal target, causing a tight
        # exact aspect to a personal natal planet to be silently dropped.
        selected_transit_set = {a['transitPlanet'] for a in selected}
        exact_extras = [
            a for a in candidates
            if a['exact']
            and a['transitPlanet'] not in selected_transit_set
            and a['natalPlanet'] in PERSONAL_PLANETS
        ]
        exact_extras.sort(key=lambda a: (_natal_priority(a['natalPlanet']), a['orb']))
        if exact_extras:
            selected = selected + exact_extras

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
                'house': moon_display_house,
                'description': f'Moon Transits the {ordinal(moon_display_house)} House',
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

        # --- 5. Moon aspect stories (personal + social + node natal targets) ---
        # Moon aspects to natal planets/nodes, shown with rulers/dispositor
        # (no exact/ends qualifier). Social planets: orb < 6, Nodes: orb < 8.
        involved_natal = {a['natalPlanet'] for a in primary_aspects}
        involved_transit = {a['transitPlanet'] for a in primary_aspects}
        moon_extra_aspects = [
            a for a in active_aspects
            if a['transitPlanet'] == 'Moon'
            and (
                a['natalPlanet'] in PERSONAL_PLANETS
                or (a['natalPlanet'] in ('Jupiter', 'Saturn') and a['orb'] < 6)
                or (a['natalPlanet'] in LUNAR_NODES and a['orb'] < 8)
            )
        ]
        moon_extra_aspects.sort(key=lambda a: a['orb'])
        for aspect in moon_extra_aspects:
            # Suppress exact/ends qualifier for Moon extra aspects
            moon_aspect = {**aspect, 'exact': False, 'separating': False}
            _add_aspect_story(events, moon_aspect, natal_map, transit_map, house_to_sign,
                              include_transit_house=False, use_specific_aspect_name=False)

        # --- 6. Inner-planet transit houses (Mercury/Venus not in primary stories) ---
        for inner_planet in ('Mercury', 'Venus'):
            if inner_planet not in involved_transit and transit_map.get(inner_planet):
                inner_house = transit_map[inner_planet]['natalHouse']
                events.append({
                    'type': 'transit_house',
                    'planet': inner_planet,
                    'house': inner_house,
                    'description': f'{inner_planet} Transits the {ordinal(inner_house)} House',
                })

        # --- 6b. Jupiter/Saturn transit house (near sign ingress) ---
        # Jupiter and Saturn move slowly — only surface their transit house
        # when they are within INGRESS_ORB degrees of a sidereal sign boundary
        # (recently entered or about to leave). This marks house change events.
        INGRESS_ORB = 5
        for slow_planet in ('Jupiter', 'Saturn'):
            if slow_planet not in transit_map:
                continue
            tp_data = next((p for p in transit_planets if p['name'] == slow_planet), None)
            if not tp_data:
                continue
            sid_pos = tp_data.get('sidereal_abs_pos')
            if sid_pos is None:
                continue
            sign_pos = sid_pos % 30
            if sign_pos < INGRESS_ORB or sign_pos > (30 - INGRESS_ORB):
                t_house = transit_map[slow_planet]['natalHouse']
                events.append({
                    'type': 'transit_house',
                    'planet': slow_planet,
                    'house': t_house,
                    'description': f'{slow_planet} Transits the {ordinal(t_house)} House',
                })

    # --- Steps below run regardless of Moon activation path ---

    # --- 7. Tight approaching personal aspects (always) ---
    # Emit : Starts for personal-planet approaches within 1.5° regardless of
    # whether the same aspect is already in the primary story. Python dedup drops
    # duplicates. Running outside the Moon-activation branch ensures no gaps on
    # Moon-activation days, giving the calendar bridge a consecutive daily run.
    # Personal planets + social planets (Jupiter/Saturn) as valid natal targets.
    # This covers aspects like "Mars square natal Jupiter" which are meaningful
    # calendar events but Jupiter is not in PERSONAL_PLANETS.
    _PERSONAL_AND_SOCIAL = set(PERSONAL_PLANETS) | {'Jupiter', 'Saturn'}

    approaching_aspects = [
        a for a in active_aspects
        if a['transitPlanet'] in PERSONAL_PLANETS
        and a['transitPlanet'] != 'Moon'
        and a['natalPlanet'] in _PERSONAL_AND_SOCIAL
        and not a['exact']
        and not a['separating']
        and a['orb'] < 1.6
    ]
    approaching_aspects.sort(key=lambda a: a['orb'])
    for aspect in approaching_aspects:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False,
                          show_starts=True)

    # --- 7b. Tight separating personal aspects (always) ---
    # Emit : Ends for personal-planet separating aspects within 3°. Running
    # outside the Moon-activation branch prevents gaps that would split a single
    # consecutive run into two, causing the bridge to see two : Ends entries.
    ending_aspects = [
        a for a in active_aspects
        if a['transitPlanet'] in PERSONAL_PLANETS
        and a['transitPlanet'] != 'Moon'
        and a['natalPlanet'] in _PERSONAL_AND_SOCIAL
        and not a['exact']
        and a['separating']
        and a['orb'] < 3
    ]
    ending_aspects.sort(key=lambda a: a['orb'])
    for aspect in ending_aspects:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=True, use_specific_aspect_name=False)

    # --- 8a. Exact personal-transit → personal/social-natal aspects (always) ---
    # In the Moon-activation path, personal transit stories are fully suppressed,
    # so exact aspects like Mars opposite natal Moon are silently dropped.
    # In the non-Moon path, a transit planet already selected for one natal target
    # won't appear for a second exact natal target. This step covers both gaps.
    covered_aspect_keys = {
        (a['transitPlanet'], a['natalPlanet']) for a in primary_aspects
    }
    always_exact = [
        a for a in active_aspects
        if a['transitPlanet'] in PERSONAL_PLANETS
        and a['transitPlanet'] != 'Moon'
        and a['natalPlanet'] in _PERSONAL_AND_SOCIAL
        and a['exact']
        and (a['transitPlanet'], a['natalPlanet']) not in covered_aspect_keys
    ]
    always_exact.sort(key=lambda a: a['orb'])
    for aspect in always_exact:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False)

    # Major aspects only — quincunx is excluded for slow planets because
    # Jupiter/Saturn move so slowly that a 3° quincunx orb can persist for
    # 30+ days and drowns out genuinely significant events.
    _MAJOR_ASPECTS = {'conjunction', 'opposition', 'trine', 'square', 'sextile'}

    # Slow planets + social planets as valid natal targets for slow-transit sections.
    # This covers slow-vs-slow aspects like "Jupiter trine natal Saturn".
    _SLOW_NATAL_TARGETS = set(PERSONAL_PLANETS) | {'Jupiter', 'Saturn'}

    # --- 8. Exact slow-planet/node aspects to personal/social natal planets ---
    # Slow transits (Jupiter, Saturn, Uranus, Neptune, Pluto, Rahu, Ketu)
    # that form an exact aspect (orb < 0.5° for Jupiter/Saturn, < 1° for others)
    # to a personal or social natal planet are rare and significant.
    slow_exact_aspects = [
        a for a in active_aspects
        if (a['transitPlanet'] in SLOW_PLANETS or a['transitPlanet'] in LUNAR_NODES)
        and a['natalPlanet'] in _SLOW_NATAL_TARGETS
        and a['aspect'] in _MAJOR_ASPECTS
        and a['exact']
    ]
    slow_exact_aspects.sort(key=lambda a: a['orb'])
    for aspect in slow_exact_aspects:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False)

    # --- 8b. Approaching Jupiter/Saturn aspects to personal/social natal planets ---
    # When Jupiter or Saturn is within 2.6° of forming an exact aspect to a
    # personal or social natal planet (approaching, not yet exact), include it
    # with a : Starts qualifier.
    approaching_slow = [
        a for a in active_aspects
        if a['transitPlanet'] in ('Jupiter', 'Saturn')
        and a['natalPlanet'] in _SLOW_NATAL_TARGETS
        and a['aspect'] in _MAJOR_ASPECTS
        and not a['exact']
        and not a['separating']
        and a['orb'] < 2.6
    ]
    approaching_slow.sort(key=lambda a: a['orb'])
    for aspect in approaching_slow:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False,
                          show_starts=True)

    # --- 8c. Separating Jupiter/Saturn aspects to personal/social natal planets ---
    # Mirror of 8b: after the exact point, include the aspect with a : Ends
    # qualifier while still within 3.5° on the separating side.
    separating_slow = [
        a for a in active_aspects
        if a['transitPlanet'] in ('Jupiter', 'Saturn')
        and a['natalPlanet'] in _SLOW_NATAL_TARGETS
        and a['aspect'] in _MAJOR_ASPECTS
        and not a['exact']
        and a['separating']
        and a['orb'] < 3.5
    ]
    separating_slow.sort(key=lambda a: a['orb'])
    for aspect in separating_slow:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False)

    # --- 9. Lunar node aspects (personal transit planets → Rahu/Ketu) ---
    # When a personal transit planet (non-Moon) forms a tight aspect
    # (orb < 3°) with a natal lunar node, include it.
    node_aspects = [
        a for a in active_aspects
        if a['transitPlanet'] in PERSONAL_PLANETS
        and a['transitPlanet'] != 'Moon'
        and a['natalPlanet'] in LUNAR_NODES
        and a['orb'] < 3
    ]
    node_aspects.sort(key=lambda a: a['orb'])
    for aspect in node_aspects:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False,
                          show_starts=True)

    # --- 10. Ascendant aspects (transit planet conjunct natal Ascendant) ---
    # When a transit planet is conjunct the tropical Ascendant, show a special
    # "Aspecting Ascendant (ASC)" event with a qualifier:
    #   : Exact  — orb < 1°
    #   : Ends   — separating (recently past exact), within conj_orb + 2°
    #   : Starts — approaching (not yet exact), within conj_orb
    asc_trop = next(
        (p for p in natal_planets_tropical if p['name'] == 'Ascendant'), None
    )
    if asc_trop:
        asc_deg = asc_trop['fullDegree']
        conj_orb = next(a['orb'] for a in ASPECT_TYPES if a['name'] == 'conjunction')
        ends_orb = conj_orb + 2  # wider window for separating (Ends)
        asc_fake_natal = {'fullDegree': asc_deg}
        for transit_name in PLANETS:
            transit = transit_map.get(transit_name)
            if not transit:
                continue
            diff = normalize_angle(transit['fullDegree'] - asc_deg)
            orb = abs(diff)  # conjunction = 0°
            if orb > ends_orb:
                continue
            separating = is_separating(transit, asc_fake_natal, 0)
            if orb < 1:
                qualifier = ' : Exact'
            elif separating:
                qualifier = ' : Ends'
            elif orb <= conj_orb:
                qualifier = ' : Starts'
            else:
                continue  # beyond conj_orb and not separating — skip
            events.append({
                'type': 'ascendant_aspect',
                'transitPlanet': transit_name,
                'orb': orb,
                'description': f'{transit_name} Aspecting Ascendant (ASC){qualifier}',
            })

    # --- 10b. MC aspects (transit planet aspecting natal Midheaven) ---
    # Check all major aspect types. Emit a qualifier (Exact / Ends / Starts)
    # and the MC sign ruler as a dispositor event.
    mc_natal = natal_map.get('MC')
    if mc_natal:
        mc_deg = mc_natal['fullDegree']
        mc_fake_natal = {'fullDegree': mc_deg}
        ends_orb_mc = 2  # extra window for separating (Ends) past standard orb
        for transit_name in PLANETS:
            transit = transit_map.get(transit_name)
            if not transit:
                continue
            diff = normalize_angle(transit['fullDegree'] - mc_deg)
            best = None  # (orb, aspect_type)
            for aspect_type in ASPECT_TYPES:
                orb = abs(diff - aspect_type['angle'])
                extended_orb = aspect_type['orb'] + ends_orb_mc
                if orb <= extended_orb:
                    if best is None or orb < best[0]:
                        best = (orb, aspect_type)
            if best is None:
                continue
            orb, aspect_type = best
            separating = is_separating(transit, mc_fake_natal, aspect_type['angle'])
            # Skip if beyond standard orb and not separating (approaching but not in range yet)
            if orb > aspect_type['orb'] and not separating:
                continue
            if orb < 1:
                qualifier = ' : Exact'
            elif separating:
                qualifier = ' : Ends'
            else:
                qualifier = ' : Starts'
            events.append({
                'type': 'mc_aspect',
                'transitPlanet': transit_name,
                'orb': orb,
                'description': f'{transit_name} Aspecting Midheaven (MC){qualifier}',
            })
            # Emit the MC sign ruler as dispositor
            mc_sign_lord = mc_natal.get('signLord', '')
            if mc_sign_lord and mc_sign_lord != transit_name:
                lord_natal = natal_map.get(mc_sign_lord)
                if lord_natal:
                    events.append({
                        'type': 'dispositor',
                        'planet': mc_sign_lord,
                        'house': lord_natal['house'],
                        'forPlanet': 'MC',
                        'description': f'{mc_sign_lord} in {ordinal(lord_natal["house"])} (Dispositor)',
                    })

    # --- 11. Moon transit house (always last, non-Moon-activation path only) ---
    if not moon_activates_house and transit_map.get('Moon') and moon_display_house:
        events.append({
            'type': 'transit_house',
            'planet': 'Moon',
            'house': moon_display_house,
            'description': f'Moon Transits the {ordinal(moon_display_house)} House',
        })

    # --- 12. Deduplicate — preserve first occurrence of each description ---
    # Multiple transit planets aspecting the same natal planet each emit the
    # same ruler / dispositor sub-events. Remove the repeated entries while
    # keeping the original order.
    seen_descriptions = set()
    deduped = []
    for event in events:
        desc = event.get('description', '')
        if desc not in seen_descriptions:
            seen_descriptions.add(desc)
            deduped.append(event)

    # --- 13. Add impact level to each event ---
    # Rules derived from event type and the planet involved:
    #   ruler / dispositor                             → Extremely Impactful
    #   aspect where transit planet is Jupiter/Saturn  → Extremely Impactful
    #   transit_house / aspect / ascendant_aspect
    #     where the active planet is Moon              → Slightly impactful
    #   everything else                                → Impactful
    for event in deduped:
        event_type = event.get('type')
        transit_planet = event.get('transitPlanet') or event.get('planet')
        if event_type in ('ruler', 'dispositor'):
            event['impact'] = 'Extremely Impactful'
        elif event_type == 'aspect' and transit_planet in ('Jupiter', 'Saturn'):
            event['impact'] = 'Extremely Impactful'
        elif event_type == 'transit_house':
            event['impact'] = 'Slightly impactful' if transit_planet == 'Moon' else 'Impactful'
        elif event_type == 'aspect':
            event['impact'] = 'Slightly impactful' if transit_planet == 'Moon' else 'Impactful'
        elif event_type in ('ascendant_aspect', 'mc_aspect'):
            event['impact'] = 'Slightly impactful' if transit_planet == 'Moon' else 'Impactful'
        else:
            event['impact'] = 'Impactful'

    # --- 14. Assign warning category based on event description ---
    # Category 1 – High Alert: external financial environment is unstable /
    #              prone to unexpected drains.
    _HIGH_ALERT_EVENTS = {
        'Moon Transits the 2nd House',
        'Sun Transit the 2nd House',
        'Moon Transits the 8th House',
        'Mars Transits the 12th House',
        'Moon Transits the 5th House',
        'Moon Transits the 9th House',
    }
    # Category 2 – Behavioural Warnings: psychological triggers that cause
    #              impulsive or emotionally-driven decisions.
    _BEHAVIOURAL_WARNING_EVENTS = {
        'Mars Transits the 1st House',
        'Uranus conjunct Venus',
        'Mars Aspecting Ascendant (ASC)',
    }

    _ALL_WARNINGS = {
        "Moon Transits the 8th House",
        "Moon Transits the 2nd House",
        "Sun Transit the 2nd House",
        "Mars Transits the 12th House",
        "Mars Transits the 1st House",
        "Uranus conjunct Venus",
        "Mars Aspecting Ascendant (ASC)",
        "Moon Transits the 9th House"
    }

    _SPECULATIVE_POWERHOUSE_WARNING_EVENTS = {
        'Mars aspect Jupiter in 5th House',
        'Mercury aspect Jupiter in 5th House',
        'Jupiter aspect Mars in 8th house',
        'Jupiter aspect Mercury in 8th house',
    }

    _WHALE_MOVEMENT_WARNING_EVENTS = {
        'Jupiter aspect Venus in 8th House',
        'Jupiter aspect Mercury in 8th House',
        'Uranus conjunct Venus',
        'Venus Transits the 2nd House',
        'Mercury Transits the 2nd House',
    }

    _ALL_AUSPICIOUS_EVENTS = {
        "Mars aspect Jupiter in 5th House",
        "Mercury aspect Jupiter in 5th House",
        "Jupiter aspect Venus in 8th House",
        "Jupiter aspect Mercury in 8th House",
        "Jupiter aspect Mars in 8th House",
        "Uranus conjunct Venus",
        "Venus Transits the 2nd House",
        "Mercury Transits the 2nd House"
    }
    
    import re as _re
    def _base_desc(desc):
        return _re.sub(r'\s*:\s*(Exact|Starts|Ends)$', '', desc or '').strip()

    for event in deduped:
        base = _base_desc(event.get('description', ''))
        if base in _HIGH_ALERT_EVENTS:
            event['warning'] = 'High Alert'
        elif base in _BEHAVIOURAL_WARNING_EVENTS:
            event['warning'] = 'Behavioural Warnings'
        elif base in _SPECULATIVE_POWERHOUSE_WARNING_EVENTS:
            event['warning'] = 'Explosive Speculative Powerhouse'
        elif base in _WHALE_MOVEMENT_WARNING_EVENTS:
            event['warning'] = 'Quick Speculative Whale Movement'
        else:
            event['warning'] = None

    # --- 15. Sort: warned events first, then by impact level (stable sort) ---
    # Primary key: events with a warning come before events without (0 vs 1).
    # Secondary key: impact tier (Extremely Impactful → Impactful → Slightly impactful).
    _impact_order = {'Extremely Impactful': 0, 'Impactful': 1, 'Slightly impactful': 2}
    deduped.sort(key=lambda e: (
        0 if e.get('warning') else 1,
        _impact_order.get(e.get('impact', ''), 1),
    ))

    return deduped


def _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                      include_transit_house=False, use_specific_aspect_name=True,
                      show_starts=False):
    """
    Append a complete transit story to the events list:
      1. The aspect itself
      2. House rulers for the aspected natal planet
      3. Dispositor (sign lord) of the aspected natal planet
      4. (Optional) Transit house for the transit planet

    show_starts: if True, approaching (non-exact, non-separating) aspects
                 get the ' : Starts' qualifier.
    """
    transit_name = aspect['transitPlanet']
    natal_name = aspect['natalPlanet']
    natal = natal_map.get(natal_name)

    # 1. Aspect description
    if use_specific_aspect_name:
        aspect_label = aspect['aspect']
    else:
        aspect_label = 'aspect'

    # Build qualifier: Exact > Ends (separating) > Starts (approaching, opt-in)
    if aspect['exact']:
        qualifier = ' : Exact'
    elif aspect['separating']:
        qualifier = ' : Ends'
    elif show_starts and not aspect['exact'] and not aspect['separating']:
        qualifier = ' : Starts'
    else:
        qualifier = ''

    aspect['description'] = (
        f"{transit_name} {aspect_label} {natal_name} "
        f"in {ordinal(aspect['natalHouse'])} house{qualifier}"
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


def _run_json_batch():
    """
    Batch mode: compute transit events for multiple dates in a single Python process.

    Expected stdin JSON:
    {
      "birthDate": "1991-12-29",
      "birthTime": "13:30",
      "latitude": 10.7755,
      "longitude": 106.7021,
      "timezone": "Asia/Ho_Chi_Minh",
      "transitDates": ["2026-05-01", "2026-05-02", ...]
    }

    Output JSON:
    {
      "results": {
        "2026-05-01": [{ "description": "...", ... }, ...],
        "2026-05-02": [...],
        ...
      }
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
        transit_dates = input_data.get('transitDates', [])
        # Optional baseline date (day before the month) for ingress detection
        baseline_date = input_data.get('baselineDate')

        # Compute natal chart once — reused for every transit date
        all_dates = ([baseline_date] if baseline_date else []) + transit_dates
        sidereal, tropical, _ = get_natal_transits(birth_data, all_dates[0] if all_dates else None)

        # Build sign_to_house from the sidereal natal chart so we can look up
        # a transit planet's house from its tropical sign independently of the
        # full event calculation (needed for ingress detection).
        asc_sign = next((p['sign'] for p in sidereal if p['name'] == 'Ascendant'), None)
        if asc_sign and asc_sign in SIGN_ORDER:
            asc_idx = SIGN_ORDER.index(asc_sign)
            _sign_to_house = {SIGN_ORDER[(asc_idx + i) % 12]: i + 1 for i in range(12)}
        else:
            _sign_to_house = {}

        INNER_PLANETS = {'Mercury', 'Venus', 'Sun', 'Mars'}

        def planet_houses_for(transit_planets):
            """Return {planet_name: house_number} for non-Moon inner planets."""
            houses = {}
            for p in transit_planets:
                if p['name'] in INNER_PLANETS:
                    houses[p['name']] = _sign_to_house.get(p['sign'], 0)
            return houses

        results = {}
        planet_houses = {}   # date -> {planet: house}
        baseline_events = []  # events for the baseline date

        for date in all_dates:
            try:
                _, _, transit = get_natal_transits(birth_data, date)
                events = calculate_transit_report(sidereal, tropical, transit)
                planet_houses[date] = planet_houses_for(transit)
                if date in transit_dates:
                    results[date] = events
                elif date == baseline_date:
                    baseline_events = events
            except Exception as day_err:
                planet_houses[date] = {}
                if date == baseline_date:
                    baseline_events = []

        print(json.dumps({
            'results': results,
            'planetHouses': planet_houses,
            'baselineEvents': baseline_events,
        }))
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    import sys
    if '--json-batch' in sys.argv:
        _run_json_batch()
    elif '--json' in sys.argv:
        _run_json_bridge()
    else:
        # Manual test runner moved to tests/astrology_kerykeion_test.py
        print('Run tests with: pytest tests/astrology_kerykeion_test.py -v')
        print('Or manual output: python tests/astrology_kerykeion_test.py')
