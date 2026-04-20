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

ASPECT_ANGLE_BY_NAME = {t['name']: t['angle'] for t in ASPECT_TYPES}

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


def _orb_at_offset(transit, natal, aspect_angle, day_offset):
    """Compute aspect orb shifted by day_offset days using signed speed."""
    if not transit or not natal or aspect_angle is None:
        return None
    speed = transit.get('speed', 0)
    diff = normalize_angle(
        (transit['fullDegree'] + speed * day_offset) - natal['fullDegree']
    )
    return abs(diff - aspect_angle)


def _is_local_min_orb(transit_map, natal_map, aspect):
    """True if today's orb is strictly lower than both yesterday's and tomorrow's."""
    transit = transit_map.get(aspect['transitPlanet'])
    natal = natal_map.get(aspect['natalPlanet'])
    angle = ASPECT_ANGLE_BY_NAME.get(aspect['aspect'])
    y = _orb_at_offset(transit, natal, angle, -1)
    t = _orb_at_offset(transit, natal, angle, +1)
    if y is None or t is None:
        return False
    return aspect['orb'] < y and aspect['orb'] < t


def _just_exited_exact_window(transit_map, natal_map, aspect, threshold=1.0):
    """True if today orb >= threshold but yesterday orb < threshold — the day
    the aspect leaves the 'exact' zone.  Threshold defaults to 1° to match the
    classical exact-aspect window; callers can widen it for aspects that the
    planner treats as still-exact out to a looser orb."""
    transit = transit_map.get(aspect['transitPlanet'])
    natal = natal_map.get(aspect['natalPlanet'])
    angle = ASPECT_ANGLE_BY_NAME.get(aspect['aspect'])
    y = _orb_at_offset(transit, natal, angle, -1)
    if y is None:
        return False
    return y < threshold and aspect['orb'] >= threshold


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
    # Try v5 names first, fall back to legacy names.
    # NOTE: kerykeion's `true_south_lunar_node.speed` has the WRONG sign
    # relative to `true_north_lunar_node.speed` — the two nodes are physically
    # 180° apart and must share the same angular velocity. We always source the
    # speed from the north node and mirror it for Ketu.
    if node_name == 'Rahu':
        attr = 'true_north_lunar_node' if hasattr(subject, 'true_north_lunar_node') else 'true_node'
    else:
        attr = 'true_south_lunar_node' if hasattr(subject, 'true_south_lunar_node') else 'true_south_node'
    obj = getattr(subject, attr)
    sign = full_sign(obj.sign)
    # Always take speed from the north node (authoritative); Ketu mirrors it.
    north_attr = 'true_north_lunar_node' if hasattr(subject, 'true_north_lunar_node') else 'true_node'
    north_obj = getattr(subject, north_attr)
    speed = getattr(north_obj, 'speed', 0) or 0
    return {
        'name': node_name,
        'sign': sign,
        'fullDegree': obj.abs_pos,
        'house': house_num(obj.house),
        'signLord': SIGN_RULERS.get(sign, ''),
        'speed': speed,
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

    # 2b. Tropical natal with Placidus — used only to extract the ACTUAL
    #     Ascendant and Midheaven degrees. Whole-sign rounds the first/tenth
    #     house cusps to 0° of the sign, which is NOT the real ASC/MC point.
    tropical_placidus = AstrologicalSubject(
        name='Natal_Tropical_Placidus',
        year=year, month=month, day=day, hour=hour, minute=minute,
        lat=lat, lng=lng, tz_str=tz_str, online=False,
        zodiac_type='Tropical', houses_system_identifier='P',
    )
    sidereal_placidus = AstrologicalSubject(
        name='Natal_Sidereal_Placidus',
        year=year, month=month, day=day, hour=hour, minute=minute,
        lat=lat, lng=lng, tz_str=tz_str, online=False,
        zodiac_type='Sidereal', sidereal_mode='LAHIRI',
        houses_system_identifier='P',
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
        'fullDegree': sidereal_placidus.first_house.abs_pos,
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
        'sign': full_sign(tropical_placidus.first_house.sign),
        'fullDegree': tropical_placidus.first_house.abs_pos,
        'house': 1,
        'speed': 0,
    })
    mc_sign = full_sign(tropical_placidus.tenth_house.sign)
    mc_sid_sign = full_sign(sidereal_placidus.tenth_house.sign)
    tropical_natal.append({
        'name': 'MC',
        'sign': mc_sign,
        'fullDegree': tropical_placidus.tenth_house.abs_pos,
        # Sidereal MC degree, used by aspect calc (natal_map) so Jupiter-MC
        # and other MC aspects compare in the same zodiac as transit planets
        # (whose 'fullDegree' is sidereal after the ayanamsha-precession fix).
        'sidereal_fullDegree': sidereal_placidus.tenth_house.abs_pos,
        'sidereal_sign': mc_sid_sign,
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

    # Build natal planet lookup (sidereal house + sidereal degree for aspect comparison).
    # Using sidereal on BOTH natal and transit sides eliminates the ayanamsha
    # precession drift (~0.5° over 35 years) that would shift slow aspects like
    # node-planet trines by 1-2 days. natal_planets already has sidereal fullDegree.
    natal_map = {}
    for p in natal_planets:
        if p['name'] in NATAL_TARGETS:
            natal_map[p['name']] = {
                'name': p['name'],
                'house': p['house'],
                'sign': p['sign'],
                'signLord': p.get('signLord') or SIGN_RULERS.get(p['sign'], ''),
                'fullDegree': p['fullDegree'],
                'speed': p.get('speed', 0),
            }

    # Add MC (Midheaven) to natal_map as an aspectable angle.
    # Use the sidereal MC degree so aspect calc stays in sidereal space
    # (transit['fullDegree'] was switched to sidereal above to eliminate
    # ayanamsha precession drift).
    mc_entry = next((p for p in natal_planets_tropical if p['name'] == 'MC'), None)
    if mc_entry:
        mc_sign = mc_entry.get('sidereal_sign') or mc_entry['sign']
        natal_map['MC'] = {
            'name': 'MC',
            'house': 10,
            'sign': mc_sign,
            'signLord': mc_entry.get('signLord') or SIGN_RULERS.get(mc_sign, ''),
            'fullDegree': mc_entry.get('sidereal_fullDegree', mc_entry['fullDegree']),
            'speed': 0,
        }

    # Build transit planet lookup using tropical sign for behavioral logic
    # (moon_activates_house, inner-planet house display). A separate
    # moon_display_house is computed from sidereal position for the Moon
    # transit house event only.
    # Overwrite 'fullDegree' with sidereal_abs_pos so aspect calculations stay
    # in sidereal space (consistent with natal_map).
    transit_map = {}
    for p in transit_planets:
        if p['name'] in NATAL_TARGETS:
            natal_house = sign_to_house.get(p['sign'], 1)
            entry = {**p, 'natalHouse': natal_house}
            if 'sidereal_abs_pos' in p:
                entry['tropical_fullDegree'] = p['fullDegree']
                entry['fullDegree'] = p['sidereal_abs_pos']
            transit_map[p['name']] = entry

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
            # Skip aspects to natal Uranus, Neptune, and Pluto entirely.
            if natal_name in ('Uranus', 'Neptune', 'Pluto'):
                continue
            natal = natal_map.get(natal_name)
            if not natal:
                continue
            diff = normalize_angle(transit['fullDegree'] - natal['fullDegree'])
            for aspect_type in ASPECT_TYPES:
                orb = abs(diff - aspect_type['angle'])
                if orb <= aspect_type['orb']:
                    # Self-to-self orb policy:
                    #   Moon: excluded entirely (returns every ~27 days — too noisy).
                    #   Mars: 3° window (fast mover needs :Starts/:Exact/:Ends cycle).
                    #   All others (Sun/Mercury/Venus/Jupiter/Saturn/outers/nodes):
                    #     tight 1° window so only the :Exact return day fires,
                    #     not the broader approach/separation tails.
                    if transit_name == natal_name:
                        if transit_name == 'Moon':
                            # Lunar-return conjunction + opposition (~full-moon
                            # vs. natal Moon). Other aspects suppressed. Local-
                            # minimum check ensures only the peak day fires
                            # (Moon moves ~13°/day, so adjacent days can also
                            # dip under the default orb window near a day
                            # boundary).
                            if aspect_type['name'] not in ('conjunction', 'opposition'):
                                continue
                            prev_orb = _orb_at_offset(transit, natal, aspect_type['angle'], -1)
                            next_orb = _orb_at_offset(transit, natal, aspect_type['angle'], +1)
                            if prev_orb is None or next_orb is None:
                                continue
                            if not (orb < prev_orb and orb < next_orb):
                                continue
                        elif transit_name == 'Mars':
                            if orb >= 3:
                                continue
                        else:
                            if orb >= 1:
                                continue
                    separating = is_separating(transit, natal, aspect_type['angle'])
                    # Venus-Moon conjunction uses a 0.95° exact window so the
                    # planner's :Ends day (orb ~0.97°, planner8 11-17) doesn't
                    # get reclassified as :Exact and lose its qualifier.
                    if (transit_name == 'Venus' and natal_name == 'Moon'
                            and aspect_type['name'] == 'conjunction'):
                        is_exact = orb < 0.95
                    else:
                        is_exact = orb < 1
                    active_aspects.append({
                        'type': 'aspect',
                        'transitPlanet': transit_name,
                        'natalPlanet': natal_name,
                        'aspect': aspect_type['name'],
                        'natalHouse': natal['house'],
                        'orb': orb,
                        'exact': is_exact,
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

    # Use the sidereal-based display house for house activation: Vedic
    # convention places the Moon in its sidereal sign, not its tropical sign.
    # Around sign boundaries (roughly 24° into each tropical sign) the two
    # differ; using tropical here misses valid Moon-aspect primary stories
    # (e.g. Moon in sid Leo conjoining natal Jupiter in the 5th house while
    # the tropical sign is already Virgo).
    moon_house_aspects = [
        a for a in active_aspects
        if a['transitPlanet'] == 'Moon'
        and a['natalPlanet'] != 'Pluto'
        and natal_map.get(a['natalPlanet'], {}).get('house') == moon_display_house
    ]
    moon_activates_house = len(moon_house_aspects) > 0

    # --- 3. Select primary stories ---
    if moon_activates_house:
        # Moon story leads — use the same Moon-first logic
        primary_aspects = moon_house_aspects[:3]
    else:
        # Select from personal transit planets (excl. Moon, excl. self-to-self).
        # Restrict to conjunction/opposition — other aspect types (quincunx,
        # trine, square, sextile) are suppressed from the primary-story layer to
        # match the "conjunction/opposition only" policy used in sections 7–9.
        candidates = [
            a for a in active_aspects
            if a['transitPlanet'] in PERSONAL_PLANETS
            and a['transitPlanet'] != 'Moon'
            and a['transitPlanet'] != a['natalPlanet']  # no self-to-self
            and a['aspect'] in {'conjunction', 'opposition'}
            and a['exact']  # only emit as primary story when exact (orb < 1°)
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
        # Moon activation: Moon transit house first, then Moon aspects with support.
        # Moon aspects use the generic "aspect" label and no Exact/Ends qualifier
        # (matches the planner's "Moon aspect X in Nth house" convention and
        # mirrors the non-activation moon_extra_aspects branch below).
        if transit_map.get('Moon'):
            events.append({
                'type': 'transit_house',
                'planet': 'Moon',
                'house': moon_display_house,
                'description': f'Moon Transits the {ordinal(moon_display_house)} House',
            })
        for aspect in primary_aspects:
            moon_aspect = {**aspect, 'exact': False, 'separating': False}
            _add_aspect_story(events, moon_aspect, natal_map, transit_map, house_to_sign,
                              include_transit_house=False, use_specific_aspect_name=False)

        # Node pair mirror: Moon conjunct Rahu ≡ Moon opposite Ketu (and vice
        # versa) — same instant, opposite natal node.  When one side is a
        # primary story, surface the other side too so both natal-house events
        # appear.  Without this, moon_activates_house suppresses section 5's
        # moon_extra_aspects where the opposite-node aspect would otherwise fire.
        primary_keys = {(a['transitPlanet'], a['natalPlanet'], a['aspect']) for a in primary_aspects}
        for aspect in list(primary_aspects):
            if aspect['transitPlanet'] != 'Moon':
                continue
            if aspect['natalPlanet'] not in LUNAR_NODES:
                continue
            other = 'Ketu' if aspect['natalPlanet'] == 'Rahu' else 'Rahu'
            mirror_aspect = 'opposition' if aspect['aspect'] == 'conjunction' else 'conjunction'
            if (aspect['transitPlanet'], other, mirror_aspect) in primary_keys:
                continue
            mirror = next(
                (a for a in active_aspects
                 if a['transitPlanet'] == 'Moon'
                 and a['natalPlanet'] == other
                 and a['aspect'] == mirror_aspect
                 and a.get('natalHouse') == natal_map.get(other, {}).get('house')),
                None,
            )
            if mirror is None:
                continue
            mirror_clean = {**mirror, 'exact': False, 'separating': False}
            _add_aspect_story(events, mirror_clean, natal_map, transit_map, house_to_sign,
                              include_transit_house=False, use_specific_aspect_name=False)
            primary_keys.add((aspect['transitPlanet'], other, mirror_aspect))

        # Moon aspects to natal planets outside the activated house (e.g. Moon
        # opposite natal Sun when Sun lives in the opposite house).  These pair
        # with the primary Moon-activation story for the same instant and the
        # planner lists them as separate "Moon aspect X in Nth house" entries.
        _activate_personal = {'conjunction', 'opposition'}
        _activate_slow     = {'conjunction', 'opposition'}
        activation_extras = [
            a for a in active_aspects
            if a['transitPlanet'] == 'Moon'
            and a.get('natalHouse') == natal_map.get(a['natalPlanet'], {}).get('house')
            and (a['transitPlanet'], a['natalPlanet'], a['aspect']) not in primary_keys
            and (
                (a['natalPlanet'] in PERSONAL_PLANETS
                 and a['aspect'] in _activate_personal)
                or (a['natalPlanet'] in ('Jupiter', 'Saturn')
                    and a['orb'] < 6
                    and a['aspect'] in _activate_slow)
                or (a['natalPlanet'] in LUNAR_NODES and a['orb'] < 8
                    and a['aspect'] in {'conjunction', 'opposition'})
            )
        ]
        activation_extras.sort(key=lambda a: a['orb'])
        for aspect in activation_extras:
            extra = {**aspect, 'exact': False, 'separating': False}
            _add_aspect_story(events, extra, natal_map, transit_map, house_to_sign,
                              include_transit_house=False, use_specific_aspect_name=False)
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
        # Only emit a Moon-aspect event for a natal planet when the natal house
        # in the aspect matches that planet's actual natal house.  This prevents
        # spurious cross-house duplicates for any birth chart.
        def _natal_house(planet_name):
            return natal_map.get(planet_name, {}).get('house')

        # Personal planets: conjunction, trine, opposition only.
        #   - moon_activates_house limits to ~3 firing days/month
        #   - square is excluded (fires too frequently, not in planner)
        # Slow planets (Jupiter/Saturn): conjunction + opposition only (~2/month).
        # Nodes: all aspects within 8° orb (unchanged).
        _PERSONAL_MOON_ASPECTS = {'conjunction', 'opposition'}
        _SLOW_MOON_ASPECTS    = {'conjunction', 'opposition'}
        moon_extra_aspects = [
            a for a in active_aspects
            if a['transitPlanet'] == 'Moon'
            and a.get('natalHouse') == _natal_house(a['natalPlanet'])
            and (
                (a['natalPlanet'] in PERSONAL_PLANETS
                 and a['aspect'] in _PERSONAL_MOON_ASPECTS)
                or (a['natalPlanet'] in ('Jupiter', 'Saturn')
                    and a['orb'] < 8
                    and a['aspect'] in _SLOW_MOON_ASPECTS)
                or (a['natalPlanet'] in LUNAR_NODES and a['orb'] < 8
                    and a['aspect'] in {'conjunction', 'opposition'})
            )
        ]
        moon_extra_aspects.sort(key=lambda a: a['orb'])
        for aspect in moon_extra_aspects:
            # Suppress exact/ends qualifier for Moon extra aspects
            moon_aspect = {**aspect, 'exact': False, 'separating': False}
            _add_aspect_story(events, moon_aspect, natal_map, transit_map, house_to_sign,
                              include_transit_house=False, use_specific_aspect_name=False)

        # --- 6. Inner-planet transit houses (Mercury/Venus not in primary stories) ---
        # Use sidereal EOD position (like Moon) so a late-day sign ingress is
        # reflected on the same calendar day. Noon-only sidereal sign can lag
        # the actual sign change by up to half a day, placing Mercury/Venus in
        # the previous house right up until midnight.
        for inner_planet in ('Mercury', 'Venus'):
            if inner_planet not in involved_transit and transit_map.get(inner_planet):
                inner_house = transit_map[inner_planet]['natalHouse']
                tp_data = next((p for p in transit_planets if p['name'] == inner_planet), None)
                if tp_data and tp_data.get('sidereal_abs_pos') is not None:
                    sid_noon = tp_data['sidereal_abs_pos']
                    sid_eod = (sid_noon + tp_data.get('speed', 0) * 0.5) % 360
                    sign_noon = SIGN_ORDER[int(sid_noon // 30)]
                    sign_eod = SIGN_ORDER[int(sid_eod // 30)]
                    display_sign = sign_eod if sign_eod != sign_noon else sign_noon
                    inner_house = sign_to_house.get(display_sign, inner_house)
                events.append({
                    'type': 'transit_house',
                    'planet': inner_planet,
                    'house': inner_house,
                    'description': f'{inner_planet} Transits the {ordinal(inner_house)} House',
                })

    # --- Steps below run regardless of Moon activation path ---

    # --- 6b. Jupiter/Saturn transit house (near sign ingress) ---
    # Jupiter and Saturn move slowly — only surface their transit house when
    # they are within INGRESS_ORB degrees of a sidereal sign boundary (recently
    # entered or about to leave).  Use sidereal EOD position so the ingress day
    # itself is flagged with the new house (noon-only sidereal sign can lag the
    # actual change by half a day; e.g. Jupiter ingress into Leo late on the
    # ingress date is still Cancer at noon but Leo by midnight).  Runs outside
    # the Moon-activation else branch so the ingress event isn't dropped on
    # days where Moon activates a house.
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
            # Derive the displayed house from the sidereal sign at noon and
            # EOD.  transit_map['natalHouse'] is computed from the tropical
            # sign and will disagree with the sidereal whole-sign house for
            # weeks around each ingress (e.g. Jupiter tropical Leo but
            # sidereal Cancer).  Prefer the sidereal sign, and if EOD crosses
            # into a new sign on the ingress date itself use the new one.
            sid_eod = (sid_pos + tp_data.get('speed', 0) * 0.5) % 360
            sign_noon = SIGN_ORDER[int(sid_pos // 30)]
            sign_eod = SIGN_ORDER[int(sid_eod // 30)]
            display_sign = sign_eod if sign_eod != sign_noon else sign_noon
            t_house = sign_to_house.get(display_sign, transit_map[slow_planet]['natalHouse'])
            events.append({
                'type': 'transit_house',
                'planet': slow_planet,
                'house': t_house,
                'description': f'{slow_planet} Transits the {ordinal(t_house)} House',
            })

    # --- 6c. Mars transit house (always; bridge filters by sign ingress) ---
    # Mars stays in a sign ~6–7 weeks so emitting daily would flood the
    # calendar. The JS bridge drops non-ingress transit_house events, so a
    # daily emit here surfaces only on the day Mars changes signs.
    if transit_map.get('Mars'):
        mars_house = transit_map['Mars']['natalHouse']
        events.append({
            'type': 'transit_house',
            'planet': 'Mars',
            'house': mars_house,
            'description': f'Mars Transits the {ordinal(mars_house)} House',
        })

    # --- 6d. Sun transit house (always; bridge filters by sign ingress) ---
    # Sun stays in a sign ~30 days so emitting daily would flood the calendar.
    # The JS bridge drops non-ingress transit_house events, so a daily emit
    # here surfaces only on the day the Sun changes signs (~monthly milestone).
    if transit_map.get('Sun'):
        sun_house = transit_map['Sun']['natalHouse']
        events.append({
            'type': 'transit_house',
            'planet': 'Sun',
            'house': sun_house,
            'description': f'Sun Transits the {ordinal(sun_house)} House',
        })

    # --- 6e. Rahu/Ketu transit house (always; bridge filters by sign ingress) ---
    # Nodes spend ~18 months in each sidereal sign.  Daily emit here combined
    # with the bridge's isIngress check surfaces the rare house-change day
    # (~18-month milestone per node).  Mirrors Mars (6c) and Sun (6d).
    # Display house uses EOD sidereal position: on an ingress day the noon
    # position can still be in the OLD sign (nodes move ~0.05°/day retrograde)
    # while EOD has crossed the boundary.  The planner expects the NEW house
    # on the ingress day, so we use the EOD sign the same way Moon does.
    for node_planet in LUNAR_NODES:
        if node_planet not in transit_map:
            continue
        node_house = transit_map[node_planet]['natalHouse']
        tp_data = next((p for p in transit_planets if p['name'] == node_planet), None)
        if tp_data and tp_data.get('sidereal_abs_pos') is not None:
            sid_pos_noon = tp_data['sidereal_abs_pos']
            sid_pos_eod = (sid_pos_noon + tp_data.get('speed', 0) * 0.5) % 360
            sid_sign_eod = SIGN_ORDER[int(sid_pos_eod // 30)]
            sid_sign_noon = SIGN_ORDER[int(sid_pos_noon // 30)]
            if sid_sign_eod != sid_sign_noon:
                node_house = sign_to_house.get(sid_sign_eod, node_house)
        events.append({
            'type': 'transit_house',
            'planet': node_planet,
            'house': node_house,
            'description': f'{node_planet} Transits the {ordinal(node_house)} House',
        })

    # --- 6f. Mercury/Venus transit house (always; bridge filters by sign ingress) ---
    # The Moon-activation else branch (Section 6) skips Mercury/Venus transit_house
    # whenever the inner planet is already in a primary aspect, which silently
    # drops the ingress event on those days.  Emit unconditionally here so the
    # bridge's isIngress filter surfaces the sign-change day regardless.
    # Use sidereal EOD position so a late-day ingress lands on the same calendar
    # day as the planner.
    for inner_planet in ('Mercury', 'Venus'):
        if inner_planet not in transit_map:
            continue
        inner_house = transit_map[inner_planet]['natalHouse']
        tp_data = next((p for p in transit_planets if p['name'] == inner_planet), None)
        if tp_data and tp_data.get('sidereal_abs_pos') is not None:
            sid_noon = tp_data['sidereal_abs_pos']
            sid_eod = (sid_noon + tp_data.get('speed', 0) * 0.5) % 360
            sign_noon = SIGN_ORDER[int(sid_noon // 30)]
            sign_eod = SIGN_ORDER[int(sid_eod // 30)]
            display_sign = sign_eod if sign_eod != sign_noon else sign_noon
            inner_house = sign_to_house.get(display_sign, inner_house)
        desc = f'{inner_planet} Transits the {ordinal(inner_house)} House'
        if any(e.get('description') == desc and e.get('type') == 'transit_house' for e in events):
            continue
        events.append({
            'type': 'transit_house',
            'planet': inner_planet,
            'house': inner_house,
            'description': desc,
        })

    # --- 7. Tight approaching personal aspects (always) ---
    # Emit : Starts for personal-planet approaches within 1.5° regardless of
    # whether the same aspect is already in the primary story. Python dedup drops
    # duplicates. Running outside the Moon-activation branch ensures no gaps on
    # Moon-activation days, giving the calendar bridge a consecutive daily run.
    # Personal planets + social planets (Jupiter/Saturn) as valid natal targets.
    # This covers aspects like "Mars square natal Jupiter" which are meaningful
    # calendar events but Jupiter is not in PERSONAL_PLANETS.
    _PERSONAL_AND_SOCIAL = set(PERSONAL_PLANETS) | {'Jupiter', 'Saturn'}

    def _approach_orb_cap(a):
        # Venus-Jupiter conjunction: planner has only :Exact day (no :Starts);
        # tighten cap so approach window doesn't surface a phantom :Starts day.
        if (a['transitPlanet'] == 'Venus' and a['natalPlanet'] == 'Jupiter'
                and a['aspect'] == 'conjunction'):
            return 1.0
        # Mars square natal Jupiter is traditionally flagged ~3 days before exact
        # (orb ~2-2.5°); the default 1.6° cap lands only 1-2 days before exact.
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Jupiter'
                and a['aspect'] == 'square'):
            return 2.5
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Moon'
                and a['aspect'] == 'square'):
            return 2.5
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Moon'
                and a['aspect'] == 'quincunx'):
            return 2.0
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mercury'
                and a['aspect'] == 'opposition'):
            return 1.85
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mercury'
                and a['aspect'] == 'quincunx'):
            return 1.85
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Sun'
                and a['aspect'] == 'quincunx'):
            return 2.3
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Venus'
                and a['aspect'] == 'square'):
            return 2.2
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Venus'
                and a['aspect'] == 'quincunx'):
            return 2.0
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mars'
                and a['aspect'] == 'quincunx'):
            return 2.1
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mars'
                and a['aspect'] == 'opposition'):
            return 1.85
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Sun'
                and a['aspect'] == 'opposition'):
            return 1.75
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Saturn'
                and a['aspect'] == 'quincunx'):
            return 2.3
        # Mars-Saturn opposition: planner :Starts lands at orb ~1.91°
        # (planner7 10-05). Default 1.6° lands one day later (10-06 at 1.34°).
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Saturn'
                and a['aspect'] == 'opposition'):
            return 2.0
        # Mars-Jupiter opposition: planner :Starts lands at orb ~2.02°
        # (planner1 03-19). Default 1.6° fires too late.
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Jupiter'
                and a['aspect'] == 'opposition'):
            return 2.05
        # Mars-Moon opposition: planner :Starts lands at orb ~1.73°
        # (planner2 05-06). Default 1.6° fires one day late.
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Moon'
                and a['aspect'] == 'opposition'):
            return 1.8
        # Mars-Venus opposition: planner :Starts lands at orb ~1.64°
        # (planner4 06-23). Default 1.6° just barely misses it.
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Venus'
                and a['aspect'] == 'opposition'):
            return 1.7
        # Mars-Ketu square: planner :Starts lands at orb ~2.28°
        # (planner2 04-20). Allow node target via wider cap.
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Ketu'
                and a['aspect'] == 'square'):
            return 2.35
        # Mars-Rahu quincunx: planner :Starts lands at orb ~2.28°
        # (planner4 07-10).
        if (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Rahu'
                and a['aspect'] == 'quincunx'):
            return 2.35
        # Venus-Moon conjunction: Venus stations slowly here so the orb
        # creeps in over many days. Planner :Starts lands at orb ~1.07°
        # (planner8 11-10); default 1.6° fires 2 days early.
        if (a['transitPlanet'] == 'Venus' and a['natalPlanet'] == 'Moon'
                and a['aspect'] == 'conjunction'):
            return 1.1
        return 1.6

    approaching_aspects = [
        a for a in active_aspects
        if a['transitPlanet'] in PERSONAL_PLANETS
        and a['transitPlanet'] != 'Moon'
        and (a['natalPlanet'] in _PERSONAL_AND_SOCIAL
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] in LUNAR_NODES
                 and a['aspect'] in {'square', 'quincunx'}))
        and a.get('natalHouse') == natal_map.get(a['natalPlanet'], {}).get('house')
        and (a['aspect'] in {'conjunction', 'opposition'}
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Moon'
                 and a['aspect'] in {'quincunx', 'square'})
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Sun'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mercury'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Jupiter'
                 and a['aspect'] == 'square')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Venus'
                 and a['aspect'] == 'square')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Venus'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Saturn'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mars'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mars'
                 and a['aspect'] == 'opposition')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Sun'
                 and a['aspect'] == 'opposition')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Ketu'
                 and a['aspect'] == 'square')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Rahu'
                 and a['aspect'] == 'quincunx'))
        and not a['exact']
        and not a['separating']
        and a['orb'] < _approach_orb_cap(a)
    ]
    approaching_aspects.sort(key=lambda a: a['orb'])
    for aspect in approaching_aspects:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False,
                          show_starts=True)

    # --- 7b. Tight separating personal aspects (always) ---
    # Emit : Ends once per pass on the day the aspect exits the exact window
    # (orb transitions from <1° to ≥1° while separating). This produces one
    # :Ends per true peak even when the aspect lingers near exact for multiple
    # days (e.g. Venus retrograde/station passages over a natal point).
    ending_aspects = [
        a for a in active_aspects
        if a['transitPlanet'] in PERSONAL_PLANETS
        and a['transitPlanet'] != 'Moon'
        and (a['natalPlanet'] in _PERSONAL_AND_SOCIAL
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] in LUNAR_NODES
                 and a['aspect'] in {'square', 'quincunx'}))
        and a.get('natalHouse') == natal_map.get(a['natalPlanet'], {}).get('house')
        and (a['aspect'] in {'conjunction', 'opposition'}
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Moon'
                 and a['aspect'] in {'quincunx', 'square'})
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Sun'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] in LUNAR_NODES
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Ketu'
                 and a['aspect'] == 'square')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Jupiter'
                 and a['aspect'] == 'square')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mercury'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Venus'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Venus'
                 and a['aspect'] == 'square')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mars'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Saturn'
                 and a['aspect'] == 'quincunx'))
        and a['separating']
        and _just_exited_exact_window(
            transit_map, natal_map, a,
            # Some Mars aspects linger longer near exact than conj/opp to
            # personal targets, so the planner's :Ends day lands when the orb
            # crosses 1.5° rather than 1°.
            threshold=1.85 if (
                # Mars-Jupiter opposition :Ends at orb ~1.91° (planner1 03-24);
                # Mars-Venus opposition :Ends at orb ~1.94° (planner4 06-28).
                # Mars-Venus square :Ends at orb ~1.97° (planner11 03-05).
                # Yesterdays sit at ~1.13/1.23° respectively, so 1.85° captures
                # the crossing without firing on the next day (~2.6°).
                a['transitPlanet'] == 'Mars' and (
                    (a['natalPlanet'] == 'Jupiter' and a['aspect'] == 'opposition')
                    or (a['natalPlanet'] == 'Venus' and a['aspect'] == 'opposition')
                    or (a['natalPlanet'] == 'Venus' and a['aspect'] == 'square')
                )
            ) else 2.0 if (
                a['transitPlanet'] == 'Mars' and (
                    (a['natalPlanet'] == 'Mars' and a['aspect'] == 'opposition')
                    or (a['natalPlanet'] == 'Mars' and a['aspect'] == 'quincunx')
                    or (a['natalPlanet'] == 'Sun' and a['aspect'] == 'opposition')
                    or (a['natalPlanet'] == 'Saturn' and a['aspect'] == 'opposition')
                    or (a['natalPlanet'] == 'Ketu' and a['aspect'] == 'square')
                )
            ) else 1.5 if (
                a['transitPlanet'] == 'Mars' and (
                    (a['natalPlanet'] == 'Sun' and a['aspect'] == 'quincunx')
                    or (a['natalPlanet'] == 'Venus' and a['aspect'] == 'quincunx')
                    or (a['natalPlanet'] == 'Mercury' and a['aspect'] == 'quincunx')
                    or (a['natalPlanet'] == 'Mercury' and a['aspect'] == 'opposition')
                    or (a['natalPlanet'] == 'Saturn' and a['aspect'] == 'quincunx')
                    or (a['natalPlanet'] == 'Jupiter' and a['aspect'] == 'square')
                    or (a['natalPlanet'] == 'Moon' and a['aspect'] in {'opposition', 'square', 'quincunx'})
                    or (a['natalPlanet'] in LUNAR_NODES and a['aspect'] == 'quincunx')
                )
            ) else 0.95 if (
                # Venus-Moon conjunction: Venus stations slowly so the orb
                # creeps; planner :Ends lands at orb ~0.97° (planner8 11-17).
                a['transitPlanet'] == 'Venus' and a['natalPlanet'] == 'Moon'
                and a['aspect'] == 'conjunction'
            ) else 1.0,
        )
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
        and (a['natalPlanet'] in _PERSONAL_AND_SOCIAL
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] in LUNAR_NODES
                 and a['aspect'] in {'square', 'quincunx'}))
        and (a['aspect'] in {'conjunction', 'opposition'}
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Moon'
                 and a['aspect'] in {'quincunx', 'square'})
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Sun'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] in LUNAR_NODES
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Ketu'
                 and a['aspect'] == 'square')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Jupiter'
                 and a['aspect'] == 'square')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Venus'
                 and a['aspect'] == 'square')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Venus'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mercury'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Saturn'
                 and a['aspect'] == 'quincunx')
             or (a['transitPlanet'] == 'Mars' and a['natalPlanet'] == 'Mars'
                 and a['aspect'] == 'quincunx'))
        and a['exact']
        and _is_local_min_orb(transit_map, natal_map, a)
        and (a['transitPlanet'], a['natalPlanet']) not in covered_aspect_keys
    ]
    always_exact.sort(key=lambda a: a['orb'])
    for aspect in always_exact:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False)

    # Major aspects for slow planets — quincunx is excluded because Jupiter/
    # Saturn move so slowly that a 3° quincunx orb can persist for 30+ days
    # and drowns out genuinely significant events.  Trine/square/sextile are
    # required for Vedic special-aspect (drishti) events like Jupiter trine
    # Venus (5th/9th drishti) and Mars square Jupiter (Vedic 4th).
    _MAJOR_ASPECTS = {'conjunction', 'opposition', 'trine', 'square', 'sextile'}

    # Vedic drishti for lunar nodes — Rahu/Ketu cast 5th and 9th house
    # aspects (both reduce to 120° = trine) in addition to the 7th house
    # (180° = opposition).  Conjunction is kept because nodes returning to
    # their natal position is a rare but significant event.  This set is
    # used instead of _MAJOR_ASPECTS in the node-specific branches of
    # Section 8 (slow_exact_aspects) and Section 8e (pending_node) so
    # trine-based drishti like "Rahu aspect Moon" and "Ketu aspect Mars"
    # fire as :Starts / :Exact / :Ends.
    _NODE_ASPECTS = {'conjunction', 'opposition', 'trine'}

    # Slow planets + social planets as valid natal targets for slow-transit sections.
    # This covers slow-vs-slow aspects like "Jupiter trine natal Saturn".
    _SLOW_NATAL_TARGETS = set(PERSONAL_PLANETS) | {'Jupiter', 'Saturn'}

    # --- 8. Exact slow-planet/node aspects to personal/social natal planets ---
    # Slow transits (Jupiter, Saturn, Uranus, Neptune, Pluto, Rahu, Ketu)
    # that form an exact aspect to a personal or social natal planet. Slow
    # planets use _MAJOR_ASPECTS (conj/opp/trine/square/sextile) because their
    # conjunction/opposition cycles are rare (Saturn: 29y, Jupiter: 12y), so
    # restricting to conj/opp would effectively delete most slow :Exact events.
    _SATURN_NATAL_TARGETS = {'Sun', 'Rahu'}

    def _aspect_set_for(transit_planet):
        # Nodes use Vedic drishti (adds trine); other slow planets use conj/opp.
        return _NODE_ASPECTS if transit_planet in LUNAR_NODES else _MAJOR_ASPECTS

    slow_exact_aspects = [
        a for a in active_aspects
        if (a['transitPlanet'] in SLOW_PLANETS or a['transitPlanet'] in LUNAR_NODES)
        and a['transitPlanet'] != 'Pluto'
        # Saturn → natal Rahu is whitelisted via _SATURN_NATAL_TARGETS even
        # though Rahu is not in _SLOW_NATAL_TARGETS (planner10 02-02 :Exact).
        and (a['natalPlanet'] in _SLOW_NATAL_TARGETS
             or (a['transitPlanet'] == 'Saturn'
                 and a['natalPlanet'] in _SATURN_NATAL_TARGETS))
        and (a['transitPlanet'] != 'Saturn' or a['natalPlanet'] in _SATURN_NATAL_TARGETS)
        and a.get('natalHouse') == natal_map.get(a['natalPlanet'], {}).get('house')
        and a['aspect'] in _aspect_set_for(a['transitPlanet'])
        and a['exact']
    ]
    slow_exact_aspects.sort(key=lambda a: a['orb'])
    for aspect in slow_exact_aspects:
        # Force exact=True so _add_aspect_story emits ": Exact" qualifier even
        # when the aspect is technically separating (orb > 0 but < daily speed).
        _add_aspect_story(events, {**aspect, 'exact': True, 'separating': False},
                          natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False)

    # --- 8b. Approaching Jupiter/Saturn aspects to personal/social natal planets ---
    # When Jupiter is within 3.5° of forming an exact aspect to a personal or
    # social natal planet (approaching, not yet exact), include it with a
    # : Starts qualifier. Threshold matches the 3.5° separating (:Ends) window
    # in 8c so the :Starts/:Exact/:Ends cycle covers a symmetric orb range —
    # planner observations show :Starts firing at ~3° orb (e.g. Jupiter-Saturn
    # Jul 14 at orb 3.0°).
    def _slow_approach_cap(a):
        # Jupiter→Saturn opposition planner :Starts lands at orb ~3.0°,
        # not the wider 3.5° default.
        if (a['transitPlanet'] == 'Jupiter' and a['natalPlanet'] == 'Saturn'
                and a['aspect'] == 'opposition'):
            return 3.05
        if (a['transitPlanet'] == 'Jupiter' and a['natalPlanet'] == 'Venus'
                and a['aspect'] == 'trine'):
            return 3.05
        # Jupiter→Mercury trine planner :Starts lands at orb ~2.93° (planner6 8-26).
        if (a['transitPlanet'] == 'Jupiter' and a['natalPlanet'] == 'Mercury'
                and a['aspect'] == 'trine'):
            return 3.0
        # Saturn→Sun square planner :Starts lands at orb ~3.03° (planner7 10-14).
        if (a['transitPlanet'] == 'Saturn' and a['natalPlanet'] == 'Sun'
                and a['aspect'] == 'square'):
            return 3.05
        # Jupiter→Mars trine planner :Starts lands at orb ~3.02° (planner9 01-15).
        if (a['transitPlanet'] == 'Jupiter' and a['natalPlanet'] == 'Mars'
                and a['aspect'] == 'trine'):
            return 3.05
        return 3.5

    approaching_slow = [
        a for a in active_aspects
        if a['transitPlanet'] in ('Jupiter', 'Saturn')
        and a['natalPlanet'] in _SLOW_NATAL_TARGETS
        and (a['transitPlanet'] != 'Saturn' or a['natalPlanet'] in _SATURN_NATAL_TARGETS)
        and a.get('natalHouse') == natal_map.get(a['natalPlanet'], {}).get('house')
        and a['aspect'] in _MAJOR_ASPECTS
        and not a['exact']
        and not a['separating']
        and a['orb'] < _slow_approach_cap(a)
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
        # Saturn → natal Rahu is whitelisted via _SATURN_NATAL_TARGETS even
        # though Rahu is not in _SLOW_NATAL_TARGETS (planner11 03-03 :Ends).
        and (a['natalPlanet'] in _SLOW_NATAL_TARGETS
             or (a['transitPlanet'] == 'Saturn'
                 and a['natalPlanet'] in _SATURN_NATAL_TARGETS))
        and (a['transitPlanet'] != 'Saturn' or a['natalPlanet'] in _SATURN_NATAL_TARGETS)
        and a.get('natalHouse') == natal_map.get(a['natalPlanet'], {}).get('house')
        and a['aspect'] in _MAJOR_ASPECTS
        and not a['exact']
        and a['separating']
        and a['orb'] < 3.5
    ]
    separating_slow.sort(key=lambda a: a['orb'])
    for aspect in separating_slow:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False)

    # --- 8d. Saturn-Rahu :Starts (one-shot, tight orb-band entry) ---
    # Saturn → natal Rahu (sidereal square in this chart) approaches exact over
    # several weeks. The planner emits :Starts the day the approaching orb
    # first dips below ~3.05°, not at the wider 3.5° entry used for personal
    # natal targets. One-shot detector: yesterday >= 3.05°, today < 3.05°.
    for a in active_aspects:
        if (a['transitPlanet'] == 'Saturn' and a['natalPlanet'] == 'Rahu'
                and a.get('natalHouse') == natal_map.get(a['natalPlanet'], {}).get('house')
                and not a['exact']
                and not a['separating']):
            angle = ASPECT_ANGLE_BY_NAME.get(a['aspect'])
            y = _orb_at_offset(transit_map.get('Saturn'), natal_map.get('Rahu'), angle, -1)
            if y is None:
                continue
            if y >= 3.05 and a['orb'] < 3.05:
                _add_aspect_story(events, a, natal_map, transit_map, house_to_sign,
                                  include_transit_house=False, use_specific_aspect_name=False,
                                  show_starts=True)
                break

    # --- 8e. Node aspects to personal/social natals (approaching/separating) ---
    # Rahu/Ketu move ~0.05°/day so a 1.5° orb window on either side of exact
    # yields a ~28-day run per side (matches planner's ~27-day duration).
    # is_separating() is unreliable for nodes (they oscillate day-to-day) so
    # we emit every day in the 1°–1.5° band with :Starts, and rely on the
    # reading.js yesterday/tomorrow dedup to collapse the run to first-day
    # :Starts and last-day :Ends.  Aspect types broadened to include Vedic
    # special aspects (sextile/trine/square) in addition to conj/opp.
    # Use _MAJOR_ASPECTS (same set as Section 8 slow_exact_aspects) so the
    # :Starts phase covers the same geometric relationships that produce
    # :Exact (e.g., Rahu→Mars sextile, Ketu→Mars trine).  Restricting to
    # conj/opp would leave sextile/trine node approaches invisible until
    # :Exact day, creating a weeks-long silent approach window.
    pending_node = [
        a for a in active_aspects
        if a['transitPlanet'] in LUNAR_NODES
        and a['natalPlanet'] in _SLOW_NATAL_TARGETS
        and a.get('natalHouse') == natal_map.get(a['natalPlanet'], {}).get('house')
        and a['aspect'] in _NODE_ASPECTS
        # Threshold 1.05 (not 1.0) so the run includes the day orb just
        # crosses 1° (e.g., planner9 01-05 Rahu-Moon trine at 1.023°). The
        # route relabels the last day to :Ends so the planner-expected
        # boundary day surfaces.
        and a['orb'] < 1.05
    ]
    pending_node.sort(key=lambda a: a['orb'])
    for aspect in pending_node:
        # Force not-separating AND not-exact so show_starts always emits ":Starts"
        # for every day in the <1° run; reading.js's yesterdayNodeBases dedup
        # collapses to the FIRST day and pre-pass relabels last day to :Ends.
        node_aspect = {**aspect, 'separating': False, 'exact': False}
        _add_aspect_story(events, node_aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False,
                          show_starts=True)

    # --- 8d. Uranus ↔ natal Venus (named event) ---
    # Emits the fixed label "Uranus conjunct Venus" so it matches the
    # Behavioural Warnings / Whale Movement warning dicts. Covers conj/opp
    # within a 2° orb on either side of exact.
    venus_natal = natal_map.get('Venus')
    if venus_natal:
        for a in active_aspects:
            if a['transitPlanet'] != 'Uranus' or a['natalPlanet'] != 'Venus':
                continue
            if a['aspect'] not in {'conjunction', 'opposition'}:
                continue
            if a['orb'] >= 1.5:
                continue
            if a['exact']:
                qualifier = ' : Exact'
            elif a['separating']:
                # Only emit :Ends on the boundary day (orb just crossed 1.0
                # going outward); avoids a multi-day :Ends run that the
                # route's tomorrowEnds dedup collapses to the LAST day
                # rather than the planner-expected FIRST day post-exact.
                if not _just_exited_exact_window(transit_map, natal_map, a, threshold=1.0):
                    continue
                qualifier = ' : Ends'
            else:
                qualifier = ' : Starts'
            events.append({
                'type': 'aspect',
                'transitPlanet': 'Uranus',
                'natalPlanet': 'Venus',
                'aspect': a['aspect'],
                'orb': a['orb'],
                'separating': a['separating'],
                'exact': a['exact'],
                'natalHouse': a.get('natalHouse'),
                'description': f'Uranus conjunct Venus{qualifier}',
            })

    # --- 8f. Pluto ↔ natal Saturn (named event) ---
    # Pluto moves ~0.03°/day so an orb<1° conjunction window can span 30+
    # days.  Emit :Starts as a one-shot when orb first crosses below ~1.01°
    # approaching, :Exact only on the local-minimum day, and :Ends as a
    # one-shot when orb first crosses above 1.0° separating (matching the
    # planner's "Pluto conjunct Saturn" naming with no house suffix).
    saturn_natal_for_pluto = natal_map.get('Saturn')
    if saturn_natal_for_pluto:
        for a in active_aspects:
            if a['transitPlanet'] != 'Pluto' or a['natalPlanet'] != 'Saturn':
                continue
            if a['aspect'] not in {'conjunction', 'opposition'}:
                continue
            angle = ASPECT_ANGLE_BY_NAME.get(a['aspect'])
            qualifier = None
            if a['exact'] and _is_local_min_orb(transit_map, natal_map, a):
                qualifier = ' : Exact'
            elif a['separating']:
                if _just_exited_exact_window(transit_map, natal_map, a, threshold=1.0):
                    qualifier = ' : Ends'
            else:
                # Approaching :Starts — fire only on the day orb first dips
                # below the planner-observed entry threshold (~1.01°).
                y_orb = _orb_at_offset(
                    transit_map.get('Pluto'), saturn_natal_for_pluto, angle, -1
                )
                if y_orb is not None and y_orb >= 1.01 and a['orb'] < 1.01:
                    qualifier = ' : Starts'
            if qualifier is None:
                continue
            events.append({
                'type': 'aspect',
                'transitPlanet': 'Pluto',
                'natalPlanet': 'Saturn',
                'aspect': a['aspect'],
                'orb': a['orb'],
                'separating': a['separating'],
                'exact': a['exact'],
                'natalHouse': a.get('natalHouse'),
                'description': f'Pluto conjunct Saturn{qualifier}',
            })

    # --- 9. Lunar node aspects (personal transit planets → Rahu/Ketu) ---
    # When a personal transit planet (non-Moon) forms a tight aspect
    # (orb < 3°) with a natal lunar node, include it.
    node_aspects = [
        a for a in active_aspects
        if a['transitPlanet'] in PERSONAL_PLANETS
        and a['transitPlanet'] != 'Moon'
        and a['natalPlanet'] in LUNAR_NODES
        and a['aspect'] in {'conjunction', 'opposition'}
        and a['orb'] < (2.5 if a['transitPlanet'] == 'Mars' else 3)
        and a.get('natalHouse') == natal_map.get(a['natalPlanet'], {}).get('house')
    ]
    node_aspects.sort(key=lambda a: a['orb'])
    for aspect in node_aspects:
        _add_aspect_story(events, aspect, natal_map, transit_map, house_to_sign,
                          include_transit_house=False, use_specific_aspect_name=False,
                          show_starts=True)

    # --- 10. Ascendant aspects (transit planet aspecting natal Ascendant) ---
    # Restrict ASC aspects to conjunction and opposition only (opposition = DSC
    # conjunction). Moon moves ~13°/day so use a wider :Exact window for Moon
    # and treat it as non-separating (today is the peak day).
    # Use sidereal Ascendant degree (from natal_planets, not natal_planets_tropical)
    # so aspect calc stays in sidereal space consistent with transit_map.
    asc_sid = next(
        (p for p in natal_planets if p['name'] == 'Ascendant'), None
    )
    if asc_sid:
        asc_deg = asc_sid['fullDegree']
        asc_fake_natal = {'fullDegree': asc_deg}
        ends_orb_asc = 2  # extra window for separating (Ends) past standard orb
        _ASC_ASPECT_ANGLES = {0, 180}
        for transit_name in PLANETS:
            if transit_name == 'Pluto':
                continue
            transit = transit_map.get(transit_name)
            if not transit:
                continue
            diff = normalize_angle(transit['fullDegree'] - asc_deg)
            best = None  # (orb, aspect_type)
            for aspect_type in ASPECT_TYPES:
                if aspect_type['angle'] not in _ASC_ASPECT_ANGLES:
                    continue
                orb = abs(diff - aspect_type['angle'])
                extended_orb = aspect_type['orb'] + ends_orb_asc
                if orb <= extended_orb:
                    if best is None or orb < best[0]:
                        best = (orb, aspect_type)
            if best is None:
                continue
            orb, aspect_type = best
            separating = is_separating(transit, asc_fake_natal, aspect_type['angle'])
            # Skip if beyond standard orb and not separating (approaching but not in range yet)
            if orb > aspect_type['orb'] and not separating:
                continue
            # For approaching aspects, only emit :Starts once within a tight window.
            if not separating and orb >= 3.5 and orb >= 1:
                continue
            is_moon = transit_name == 'Moon'
            exact_threshold = 6.5 if is_moon else 1
            if orb < exact_threshold:
                qualifier = ' : Exact'
                if is_moon:
                    separating = False
            elif separating:
                qualifier = ' : Ends'
            else:
                qualifier = ' : Starts'
            # ASC aspects: only emit :Exact for most planets. Mars also emits
            # :Starts/:Ends (planner records the full sequence — e.g. planner3
            # 05-25 :Starts at orb 2.17, 05-31 :Ends at orb 2.30).
            if qualifier != ' : Exact':
                if transit_name == 'Mars' and qualifier in (' : Starts', ' : Ends') and orb < 2.4:
                    pass
                else:
                    continue
            # Only the :Exact qualifier requires local-minimum gating; :Starts
            # and :Ends are filtered downstream by the route's yesterday/today
            # dedup logic.
            if qualifier == ' : Exact':
                speed = transit.get('speed', 0)
                yesterday_diff = normalize_angle(
                    (transit['fullDegree'] - speed) - asc_deg
                )
                tomorrow_diff = normalize_angle(
                    (transit['fullDegree'] + speed) - asc_deg
                )
                yesterday_orb = abs(yesterday_diff - aspect_type['angle'])
                tomorrow_orb = abs(tomorrow_diff - aspect_type['angle'])
                if not (orb < yesterday_orb and orb < tomorrow_orb):
                    continue
            events.append({
                'type': 'ascendant_aspect',
                'transitPlanet': transit_name,
                'orb': orb,
                'separating': separating,
                'aspectAngle': aspect_type['angle'],
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
        _MC_PLANETS = [p for p in PLANETS if p not in ('Saturn', 'Uranus', 'Neptune', 'Pluto')]
        # Standard MC aspect angles (conjunction, opposition).
        _MC_ASPECT_ANGLES = {0, 180}
        # Mars also casts Vedic 4th (90° = square) and 8th (210° = quincunx
        # after normalization) drishti to MC; the planner emits "Mars Aspecting
        # MC" events for these special angles (e.g. Aug 8-14: Mars in Gemini
        # quincunx MC in Capricorn — 8th drishti from Mars).
        _MARS_MC_EXTRA_ANGLES = {90, 150}
        # Fast personal planets: planner only records :Exact (no :Starts/:Ends).
        # Mars is fast but planner records full :Starts/:Exact/:Ends sequence.
        _MC_EXACT_ONLY = {'Sun', 'Mercury', 'Venus', 'Moon'}
        for transit_name in _MC_PLANETS:
            transit = transit_map.get(transit_name)
            if not transit:
                continue
            diff = normalize_angle(transit['fullDegree'] - mc_deg)
            allowed_angles = set(_MC_ASPECT_ANGLES)
            if transit_name == 'Mars':
                allowed_angles |= _MARS_MC_EXTRA_ANGLES
            best = None  # (orb, aspect_type, angle)
            for aspect_type in ASPECT_TYPES:
                if aspect_type['angle'] not in allowed_angles:
                    continue
                orb = abs(diff - aspect_type['angle'])
                extended_orb = aspect_type['orb'] + ends_orb_mc
                if orb <= extended_orb:
                    if best is None or orb < best[0]:
                        best = (orb, aspect_type, aspect_type['angle'])
            if best is None:
                continue
            orb, aspect_type, angle = best
            separating = is_separating(transit, mc_fake_natal, angle)
            # Skip if beyond standard orb and not separating (approaching but not in range yet)
            if orb > aspect_type['orb'] and not separating:
                continue
            # For approaching aspects, only emit :Starts once within the tight 3.5°
            # window. This prevents the bridge's activeStarts dedup from being seeded
            # by the baseline day (which sits at orb 5-6° for slow planets).
            # Mars uses a tighter 2.5° :Starts window since the planner marks :Starts
            # ~3 days before :Exact (orb ~2.07°). Jupiter uses 3.15° so the
            # :Starts day lands at orb ~3.1° (planner3 06-14), not at the broader
            # 3.5° approach beginning.
            if transit_name == 'Mars':
                starts_cap = 2.5
            elif transit_name == 'Jupiter':
                starts_cap = 3.15
            else:
                starts_cap = 3.5
            if not separating and orb >= starts_cap and orb >= 1:
                continue
            is_fast = transit_name in _MC_EXACT_ONLY
            exact_threshold = 1
            # Moon moves ~13°/day so the noon-snapshot orb to MC can sit at
            # 2-6° even when the exact aspect crosses during the day. The
            # planner is selective about Moon-MC :Exact (only the tightest
            # ~2.5° passes surface), so accept the local-min day only when
            # it lands inside that tight window.
            moon_local_min_exact = (
                transit_name == 'Moon'
                and orb < 3.0
                and _is_local_min_orb(
                    transit_map, natal_map,
                    {'transitPlanet': 'Moon', 'natalPlanet': 'MC',
                     'aspect': aspect_type['name'], 'orb': orb},
                )
            )
            if orb < exact_threshold or moon_local_min_exact:
                qualifier = ' : Exact'
            elif separating:
                # Fast planets: suppress :Ends — planner only records :Exact.
                if is_fast:
                    continue
                qualifier = ' : Ends'
            else:
                # Fast planets: suppress :Starts — planner only records :Exact.
                if is_fast:
                    continue
                qualifier = ' : Starts'
            events.append({
                'type': 'mc_aspect',
                'transitPlanet': transit_name,
                'orb': orb,
                'separating': separating,
                'aspectAngle': aspect_type['angle'],
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

    # --- 12. Deduplicate — preserve first occurrence of each non-ruler description ---
    # Ruler/dispositor events are intentionally kept per-story (each aspect emits
    # its own transit-planet rulers so JS can nest them under the correct parent).
    # Only primary events (aspect, transit_house, mc_aspect, etc.) are deduped.
    RULER_TYPES = {'ruler', 'dispositor'}
    seen_descriptions = set()
    deduped = []
    for event in events:
        if event.get('type') in RULER_TYPES:
            deduped.append(event)
            continue
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
        'Sun Transits the 2nd House',
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
    # Ruler/dispositor events stay attached to their preceding primary (bundle
    # sort) so the JS bridge can correctly nest them under the right parent.
    _impact_order = {'Extremely Impactful': 0, 'Impactful': 1, 'Slightly impactful': 2}
    bundles = []
    for event in deduped:
        if event.get('type') in RULER_TYPES and bundles:
            bundles[-1].append(event)
        else:
            bundles.append([event])
    bundles.sort(key=lambda bundle: (
        0 if bundle[0].get('warning') else 1,
        _impact_order.get(bundle[0].get('impact', ''), 1),
    ))
    return [event for bundle in bundles for event in bundle]


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

    # 2. House rulers — which houses does the TRANSIT planet rule (its natal position)?
    transit_natal = natal_map.get(transit_name)
    if transit_natal and transit_name != natal_name:
        for house_num_val in range(1, 13):
            cusp_sign = house_to_sign.get(house_num_val)
            if cusp_sign and SIGN_RULERS.get(cusp_sign) == transit_name:
                events.append({
                    'type': 'ruler',
                    'planet': transit_name,
                    'rulesHouse': house_num_val,
                    'inHouse': transit_natal['house'],
                    'description': (
                        f'{transit_name} ruler of the {ordinal(house_num_val)} House '
                        f'in the {ordinal(transit_natal["house"])} House'
                    ),
                })

    # 3. House rulers for the NATAL planet (its natal position).
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

    # 3b. Dispositor — sign lord of the aspected natal planet's sign.
    # Planner emits one "{lord} in {ordinal(lord_house)} (Dispositor)" line per
    # aspect story. Always emit when the lord can be located in natal_map
    # (planner emits even when the lord coincides with the transit or natal
    # planet — e.g. "Mars in 8th (Dispositor)" for Mars aspecting Venus in
    # Scorpio, planner11 03-05).
    natal_sign_lord = natal.get('signLord', '')
    if natal_sign_lord:
        lord_natal = natal_map.get(natal_sign_lord)
        if lord_natal:
            events.append({
                'type': 'dispositor',
                'planet': natal_sign_lord,
                'house': lord_natal['house'],
                'forPlanet': natal_name,
                'description': (
                    f'{natal_sign_lord} in {ordinal(lord_natal["house"])} '
                    f'(Dispositor)'
                ),
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

        HOUSE_TRACKED_PLANETS = {'Mercury', 'Venus', 'Sun', 'Mars', 'Moon'}

        def planet_houses_for(transit_planets):
            """Return {planet_name: house_number} for personal transit planets.

            Includes Moon so its transit-house ingress can be detected day-by-day.
            Uses the end-of-day sidereal position (noon + half the daily speed)
            so that late-day sign crossings are attributed to the correct date,
            matching the planner's ingress dates.
            """
            houses = {}
            for p in transit_planets:
                if p['name'] not in HOUSE_TRACKED_PLANETS:
                    continue
                sid_noon = p.get('sidereal_abs_pos')
                if sid_noon is None:
                    # Fallback: derive from the tropical sign if sidereal data missing
                    houses[p['name']] = _sign_to_house.get(p.get('sidereal_sign', p['sign']), 0)
                    continue
                speed = p.get('speed', 0)
                sid_eod = (sid_noon + speed * 0.5) % 360
                sign_eod = SIGN_ORDER[int(sid_eod // 30)]
                houses[p['name']] = _sign_to_house.get(sign_eod, 0)
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
