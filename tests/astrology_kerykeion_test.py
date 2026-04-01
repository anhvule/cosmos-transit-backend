"""
pytest tests for astrology_kerykeion.py

Run with:
    pytest tests/astrology_kerykeion_test.py -v

Or the manual CLI runner:
    python tests/astrology_kerykeion_test.py
"""

import sys
import os

# Allow importing the service from the project root
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'services'))

from astrology_kerykeion import get_natal_transits, calculate_transit_report


# ─── Shared fixtures ──────────────────────────────────────────────────────────

BIRTH_DATA_HCM = {
    'birthDate': '1991-12-29',
    'birthTime': '13:30',
    'latitude': 10.7755,
    'longitude': 106.7021,
    'timezone': 'Asia/Ho_Chi_Minh',
}

BIRTH_DATA_HCM_PRECISE = {
    'birthDate': '1991-12-29',
    'birthTime': '13:30',
    'latitude': '10.7765713',
    'longitude': '106.7012093',
    'timezone': 'Asia/Ho_Chi_Minh',
}


# ─── Scenario: 2026-04-02 (original regression) ───────────────────────────────

class TestTransit20260402:
    """
    Transit date 2026-04-02 with original hardcoded coordinates.
    Expected output matches the legacy _run_test baseline.
    """

    TRANSIT_DATE = '2026-04-02'

    EXPECTED = [
        'Mars aspect Moon in 6th house : Ends',
        'Moon ruler of the 4th House in the 6th House',
        'Mercury in 8th (Dispositor)',
        'Mars Transits the 12th House',
        'Mercury aspect Jupiter in 5th house : Exact',
        'Jupiter ruler of the 9th House in the 5th House',
        'Jupiter ruler of the 12th House in the 5th House',
        'Sun in 9th (Dispositor)',
        'Moon aspect Mercury in 8th house',
        'Mercury ruler of the 3rd House in the 8th House',
        'Mercury ruler of the 6th House in the 8th House',
        'Mars in 8th (Dispositor)',
        'Moon aspect Rahu in 9th house',
        'Jupiter in 5th (Dispositor)',
        'Moon aspect Ketu in 3rd house',
        'Mercury in 8th (Dispositor)',
        'Moon aspect Sun in 9th house',
        'Sun ruler of the 5th House in the 9th House',
        'Jupiter in 5th (Dispositor)',
        'Venus Transits the 2nd House',
        'Jupiter aspect Mercury in 8th house : Exact',
        'Mercury ruler of the 3rd House in the 8th House',
        'Mercury ruler of the 6th House in the 8th House',
        'Mars in 8th (Dispositor)',
        'Sun aspect Rahu in 9th house : Ends',
        'Jupiter in 5th (Dispositor)',
        'Sun aspect Ketu in 3rd house : Ends',
        'Mercury in 8th (Dispositor)',
        'Venus Aspecting Ascendant (ASC) : Exact',
        'Moon Transits the 7th House',
    ]

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_full_report_matches_expected(self):
        events = self._get_events()
        actual = [e['description'] for e in events]
        assert actual == self.EXPECTED, (
            f'\nActual:\n' + '\n'.join(f'  {d}' for d in actual) +
            f'\nExpected:\n' + '\n'.join(f'  {d}' for d in self.EXPECTED)
        )

    def test_jupiter_rules_9th_house_in_5th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Jupiter ruler of the 9th House in the 5th House' in descriptions

    def test_jupiter_rules_12th_house_in_5th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Jupiter ruler of the 12th House in the 5th House' in descriptions


# ─── Scenario: 2026-03-31 (API request body) ─────────────────────────────────

class TestTransit20260331:
    """
    Transit date 2026-03-31 with precise coordinates from the /reading API request:

        {
          "name": "test",
          "birthDate": "1991-12-29",
          "birthTime": "13:30",
          "latitude": "10.7765713",
          "longitude": "106.7012093",
          "timezone": "Asia/Ho_Chi_Minh",
          "transitDate": "2026-03-31"
        }

    Result must contain:
      - Jupiter ruler of the 9th House in the 5th House
      - Jupiter ruler of the 12th House in the 5th House
    """

    TRANSIT_DATE = '2026-03-31'

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_jupiter_rules_9th_house_in_5th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Jupiter ruler of the 9th House in the 5th House' in descriptions, (
            'Expected "Jupiter ruler of the 9th House in the 5th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_jupiter_rules_12th_house_in_5th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Jupiter ruler of the 12th House in the 5th House' in descriptions, (
            'Expected "Jupiter ruler of the 12th House in the 5th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_both_jupiter_ruler_entries_present(self):
        """Both Jupiter ruler entries must appear together in the same report."""
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Jupiter ruler of the 9th House in the 5th House' in descriptions
        assert 'Jupiter ruler of the 12th House in the 5th House' in descriptions

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_jupiter_ruler_events_are_ruler_type(self):
        events = self._get_events()
        jupiter_rulers = [
            e for e in events
            if e.get('type') == 'ruler' and e.get('planet') == 'Jupiter'
        ]
        houses_ruled = {e['rulesHouse'] for e in jupiter_rulers}
        assert 9 in houses_ruled, f'Jupiter should rule the 9th house. Ruled: {houses_ruled}'
        assert 12 in houses_ruled, f'Jupiter should rule the 12th house. Ruled: {houses_ruled}'

    def test_jupiter_ruler_events_in_5th_house(self):
        events = self._get_events()
        jupiter_rulers = [
            e for e in events
            if e.get('type') == 'ruler' and e.get('planet') == 'Jupiter'
        ]
        for ruler in jupiter_rulers:
            assert ruler['inHouse'] == 5, (
                f'Jupiter ruler of {ruler["rulesHouse"]}th should be in 5th house, '
                f'got {ruler["inHouse"]}'
            )


# ─── Scenario: 2026-04-11 (API request body — Jack) ──────────────────────────

class TestTransit20260411:
    """
    Transit date 2026-04-11 with precise coordinates from the /reading API request:

        {
          "name": "Jack",
          "birthDate": "1991-12-29",
          "birthTime": "13:30",
          "latitude": "10.7765713",
          "longitude": "106.7012093",
          "timezone": "Asia/Ho_Chi_Minh",
          "transitDate": "2026-04-11"
        }

    Result must contain:
      - Mercury Transits the 12th House
      - Moon aspect Saturn in 10th house
      - Saturn ruler of the 10th House in the 10th House
      - Saturn ruler of the 11th House in the 10th House
    """

    TRANSIT_DATE = '2026-04-11'

    REQUIRED_DESCRIPTIONS = [
        'Mercury Transits the 12th House',
        'Moon aspect Saturn in 10th house',
        'Saturn ruler of the 10th House in the 10th House',
        'Saturn ruler of the 11th House in the 10th House',
    ]

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_mercury_transits_12th_house(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Mercury Transits the 12th House' in descriptions, (
            'Expected "Mercury Transits the 12th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_moon_aspect_saturn_in_10th_house(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Moon aspect Saturn in 10th house' in descriptions, (
            'Expected "Moon aspect Saturn in 10th house" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_saturn_ruler_of_10th_house_in_10th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Saturn ruler of the 10th House in the 10th House' in descriptions, (
            'Expected "Saturn ruler of the 10th House in the 10th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_saturn_ruler_of_11th_house_in_10th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Saturn ruler of the 11th House in the 10th House' in descriptions, (
            'Expected "Saturn ruler of the 11th House in the 10th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_all_required_descriptions_present(self):
        """All four required descriptions must appear in the same report."""
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        missing = [d for d in self.REQUIRED_DESCRIPTIONS if d not in descriptions]
        assert not missing, (
            'Missing required descriptions:\n' + '\n'.join(f'  {d}' for d in missing) +
            '\nActual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_saturn_ruler_events_are_ruler_type(self):
        events = self._get_events()
        saturn_rulers = [
            e for e in events
            if e.get('type') == 'ruler' and e.get('planet') == 'Saturn'
        ]
        houses_ruled = {e['rulesHouse'] for e in saturn_rulers}
        assert 10 in houses_ruled, f'Saturn should rule the 10th house. Ruled: {houses_ruled}'
        assert 11 in houses_ruled, f'Saturn should rule the 11th house. Ruled: {houses_ruled}'

    def test_saturn_ruler_events_in_10th_house(self):
        events = self._get_events()
        saturn_rulers = [
            e for e in events
            if e.get('type') == 'ruler' and e.get('planet') == 'Saturn'
        ]
        for ruler in saturn_rulers:
            assert ruler['inHouse'] == 10, (
                f'Saturn ruler of {ruler["rulesHouse"]}th should be in 10th house, '
                f'got {ruler["inHouse"]}'
            )

    def test_mercury_transit_house_event_type(self):
        events = self._get_events()
        mercury_transit = next(
            (e for e in events if e.get('type') == 'transit_house' and e.get('planet') == 'Mercury'),
            None,
        )
        assert mercury_transit is not None, 'Expected a transit_house event for Mercury'
        assert mercury_transit['house'] == 12, (
            f'Mercury should transit the 12th house, got {mercury_transit["house"]}'
        )


# ─── Scenario: 2026-04-12 (API request body — Jack) ──────────────────────────

class TestTransit20260412:
    """
    Transit date 2026-04-12 with precise coordinates from the /reading API request:

        {
          "name": "Jack",
          "birthDate": "1991-12-29",
          "birthTime": "13:30",
          "latitude": "10.7765713",
          "longitude": "106.7012093",
          "timezone": "Asia/Ho_Chi_Minh",
          "transitDate": "2026-04-12"
        }

    Result must contain:
      - Sun aspect Moon in 6th house : Exact
      - Moon ruler of the 4th House in the 6th House
      - Mercury in 8th (Dispositor)
    """

    TRANSIT_DATE = '2026-04-12'

    REQUIRED_DESCRIPTIONS = [
        'Sun aspect Moon in 6th house : Exact',
        'Moon ruler of the 4th House in the 6th House',
        'Mercury in 8th (Dispositor)',
    ]

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_sun_aspect_moon_in_6th_exact(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Sun aspect Moon in 6th house : Exact' in descriptions, (
            'Expected "Sun aspect Moon in 6th house : Exact" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_moon_ruler_of_4th_house_in_6th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Moon ruler of the 4th House in the 6th House' in descriptions, (
            'Expected "Moon ruler of the 4th House in the 6th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_mercury_dispositor_in_8th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Mercury in 8th (Dispositor)' in descriptions, (
            'Expected "Mercury in 8th (Dispositor)" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_all_required_descriptions_present(self):
        """All three required descriptions must appear in the same report."""
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        missing = [d for d in self.REQUIRED_DESCRIPTIONS if d not in descriptions]
        assert not missing, (
            'Missing required descriptions:\n' + '\n'.join(f'  {d}' for d in missing) +
            '\nActual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_sun_moon_aspect_is_exact(self):
        events = self._get_events()
        sun_moon = next(
            (e for e in events
             if e.get('type') == 'aspect' and e.get('transitPlanet') == 'Sun'
             and e.get('natalPlanet') == 'Moon'),
            None,
        )
        assert sun_moon is not None, 'Expected a Sun aspect Moon event'
        assert sun_moon.get('exact') is True, 'Sun aspect Moon should be exact'
        assert sun_moon.get('natalHouse') == 6, (
            f'Sun aspect Moon should be in 6th house, got {sun_moon.get("natalHouse")}'
        )

    def test_moon_ruler_event_type(self):
        events = self._get_events()
        moon_ruler = next(
            (e for e in events
             if e.get('type') == 'ruler' and e.get('planet') == 'Moon'
             and e.get('rulesHouse') == 4),
            None,
        )
        assert moon_ruler is not None, 'Expected Moon ruler of 4th house event'
        assert moon_ruler['inHouse'] == 6, (
            f'Moon ruler of 4th should be in 6th house, got {moon_ruler["inHouse"]}'
        )


# ─── Scenario: 2026-04-13 (API request body — Jack) ──────────────────────────

class TestTransit20260413:
    """
    Transit date 2026-04-13 with precise coordinates from the /reading API request:

        {
          "name": "Jack",
          "birthDate": "1991-12-29",
          "birthTime": "13:30",
          "latitude": "10.7765713",
          "longitude": "106.7012093",
          "timezone": "Asia/Ho_Chi_Minh",
          "transitDate": "2026-04-13"
        }

    Result must contain:
      - Moon Transits the 11th House
    """

    TRANSIT_DATE = '2026-04-13'

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_moon_transits_11th_house(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Moon Transits the 11th House' in descriptions, (
            'Expected "Moon Transits the 11th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_moon_transit_house_event_type(self):
        events = self._get_events()
        moon_transit = next(
            (e for e in events if e.get('type') == 'transit_house' and e.get('planet') == 'Moon'),
            None,
        )
        assert moon_transit is not None, 'Expected a transit_house event for Moon'
        assert moon_transit['house'] == 11, (
            f'Moon should transit the 11th house, got {moon_transit["house"]}'
        )

    def test_moon_transit_is_last_event(self):
        """Moon transit house should be the last event in the report."""
        events = self._get_events()
        last = events[-1]
        assert last['type'] == 'transit_house' and last['planet'] == 'Moon', (
            f'Expected Moon transit_house as last event, got: {last["description"]}'
        )


# ─── Scenario: 2026-04-19 (API request body — Jack) ──────────────────────────

class TestTransit20260419:
    """
    Transit date 2026-04-19 with precise coordinates from the /reading API request:

        {
          "name": "Jack",
          "birthDate": "1991-12-29",
          "birthTime": "13:30",
          "latitude": "10.7765713",
          "longitude": "106.7012093",
          "timezone": "Asia/Ho_Chi_Minh",
          "transitDate": "2026-04-19"
        }

    Result must contain:
      - Venus Transits the 2nd House
      - Moon aspect Venus in 8th house
      - Venus ruler of the 2nd House in the 8th House
      - Venus ruler of the 7th House in the 8th House
    """

    TRANSIT_DATE = '2026-04-19'

    REQUIRED_DESCRIPTIONS = [
        'Venus Transits the 2nd House',
        'Moon aspect Venus in 8th house',
        'Venus ruler of the 2nd House in the 8th House',
        'Venus ruler of the 7th House in the 8th House',
    ]

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_venus_transits_2nd_house(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Venus Transits the 2nd House' in descriptions, (
            'Expected "Venus Transits the 2nd House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_moon_aspect_venus_in_8th_house(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Moon aspect Venus in 8th house' in descriptions, (
            'Expected "Moon aspect Venus in 8th house" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_venus_ruler_of_2nd_house_in_8th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Venus ruler of the 2nd House in the 8th House' in descriptions, (
            'Expected "Venus ruler of the 2nd House in the 8th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_venus_ruler_of_7th_house_in_8th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Venus ruler of the 7th House in the 8th House' in descriptions, (
            'Expected "Venus ruler of the 7th House in the 8th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_all_required_descriptions_present(self):
        """All four required descriptions must appear in the same report."""
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        missing = [d for d in self.REQUIRED_DESCRIPTIONS if d not in descriptions]
        assert not missing, (
            'Missing required descriptions:\n' + '\n'.join(f'  {d}' for d in missing) +
            '\nActual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_venus_transit_house_event_type(self):
        events = self._get_events()
        venus_transit = next(
            (e for e in events if e.get('type') == 'transit_house' and e.get('planet') == 'Venus'),
            None,
        )
        assert venus_transit is not None, 'Expected a transit_house event for Venus'
        assert venus_transit['house'] == 2, (
            f'Venus should transit the 2nd house, got {venus_transit["house"]}'
        )

    def test_venus_ruler_events_are_ruler_type(self):
        events = self._get_events()
        venus_rulers = [
            e for e in events
            if e.get('type') == 'ruler' and e.get('planet') == 'Venus'
        ]
        houses_ruled = {e['rulesHouse'] for e in venus_rulers}
        assert 2 in houses_ruled, f'Venus should rule the 2nd house. Ruled: {houses_ruled}'
        assert 7 in houses_ruled, f'Venus should rule the 7th house. Ruled: {houses_ruled}'

    def test_venus_ruler_events_in_8th_house(self):
        events = self._get_events()
        venus_rulers = [
            e for e in events
            if e.get('type') == 'ruler' and e.get('planet') == 'Venus'
        ]
        for ruler in venus_rulers:
            assert ruler['inHouse'] == 8, (
                f'Venus ruler of {ruler["rulesHouse"]}th should be in 8th house, '
                f'got {ruler["inHouse"]}'
            )


# ─── Scenario: 2026-04-20 (API request body — Jack) ──────────────────────────

class TestTransit20260420:
    """
    Transit date 2026-04-20 with precise coordinates from the /reading API request:

        {
          "name": "Jack",
          "birthDate": "1991-12-29",
          "birthTime": "13:30",
          "latitude": "10.7765713",
          "longitude": "106.7012093",
          "timezone": "Asia/Ho_Chi_Minh",
          "transitDate": "2026-04-20"
        }

    Result must contain:
      - Mars aspect Ketu in 3rd house : Starts
    """

    TRANSIT_DATE = '2026-04-20'

    REQUIRED_DESCRIPTIONS = [
        'Mars aspect Ketu in 3rd house : Starts',
    ]

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_mars_aspect_ketu_in_3rd_starts(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Mars aspect Ketu in 3rd house : Starts' in descriptions, (
            'Expected "Mars aspect Ketu in 3rd house : Starts" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_all_required_descriptions_present(self):
        """All required descriptions must appear in the same report."""
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        missing = [d for d in self.REQUIRED_DESCRIPTIONS if d not in descriptions]
        assert not missing, (
            'Missing required descriptions:\n' + '\n'.join(f'  {d}' for d in missing) +
            '\nActual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_ketu_aspect_event_type(self):
        events = self._get_events()
        ketu_aspect = next(
            (e for e in events
             if e.get('type') == 'aspect' and e.get('natalPlanet') == 'Ketu'
             and e.get('transitPlanet') == 'Mars'),
            None,
        )
        assert ketu_aspect is not None, 'Expected a Mars aspect Ketu event'
        assert ketu_aspect.get('natalHouse') == 3, (
            f'Ketu should be in 3rd house, got {ketu_aspect.get("natalHouse")}'
        )


# ─── Scenario: 2026-04-21 (API request body — Jack) ──────────────────────────

class TestTransit20260421:
    """
    Transit date 2026-04-21 with precise coordinates from the /reading API request:

        {
          "name": "Jack",
          "birthDate": "1991-12-29",
          "birthTime": "13:30",
          "latitude": "10.7765713",
          "longitude": "106.7012093",
          "timezone": "Asia/Ho_Chi_Minh",
          "transitDate": "2026-04-21"
        }

    Result must contain:
      - Moon aspect Mercury in 8th house
      - Mercury ruler of the 3rd House in the 8th House
      - Mercury ruler of the 6th House in the 8th House
      - Ketu aspect Sun in 9th house : Exact
      - Sun ruler of the 5th House in the 9th House
      - Moon aspect Mars in 8th house
      - Mars ruler of the 1st House in the 8th House
      - Mars ruler of the 8th House in the 8th House
    """

    TRANSIT_DATE = '2026-04-21'

    REQUIRED_DESCRIPTIONS = [
        'Moon aspect Mercury in 8th house',
        'Mercury ruler of the 3rd House in the 8th House',
        'Mercury ruler of the 6th House in the 8th House',
        'Ketu aspect Sun in 9th house : Exact',
        'Sun ruler of the 5th House in the 9th House',
        'Moon aspect Mars in 8th house',
        'Mars ruler of the 1st House in the 8th House',
        'Mars ruler of the 8th House in the 8th House',
    ]

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_moon_aspect_mercury_in_8th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Moon aspect Mercury in 8th house' in descriptions, (
            'Expected "Moon aspect Mercury in 8th house" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_mercury_ruler_of_3rd_in_8th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Mercury ruler of the 3rd House in the 8th House' in descriptions, (
            'Expected "Mercury ruler of the 3rd House in the 8th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_mercury_ruler_of_6th_in_8th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Mercury ruler of the 6th House in the 8th House' in descriptions, (
            'Expected "Mercury ruler of the 6th House in the 8th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_ketu_aspect_sun_in_9th_exact(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Ketu aspect Sun in 9th house : Exact' in descriptions, (
            'Expected "Ketu aspect Sun in 9th house : Exact" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_sun_ruler_of_5th_in_9th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Sun ruler of the 5th House in the 9th House' in descriptions, (
            'Expected "Sun ruler of the 5th House in the 9th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_moon_aspect_mars_in_8th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Moon aspect Mars in 8th house' in descriptions, (
            'Expected "Moon aspect Mars in 8th house" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_mars_ruler_of_1st_in_8th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Mars ruler of the 1st House in the 8th House' in descriptions, (
            'Expected "Mars ruler of the 1st House in the 8th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_mars_ruler_of_8th_in_8th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Mars ruler of the 8th House in the 8th House' in descriptions, (
            'Expected "Mars ruler of the 8th House in the 8th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_all_required_descriptions_present(self):
        """All required descriptions must appear in the same report."""
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        missing = [d for d in self.REQUIRED_DESCRIPTIONS if d not in descriptions]
        assert not missing, (
            'Missing required descriptions:\n' + '\n'.join(f'  {d}' for d in missing) +
            '\nActual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_ketu_aspect_event_type(self):
        events = self._get_events()
        ketu_sun = next(
            (e for e in events
             if e.get('type') == 'aspect' and e.get('transitPlanet') == 'Ketu'
             and e.get('natalPlanet') == 'Sun'),
            None,
        )
        assert ketu_sun is not None, 'Expected a Ketu aspect Sun event'
        assert ketu_sun.get('exact') is True, 'Ketu aspect Sun should be exact'
        assert ketu_sun.get('natalHouse') == 9, (
            f'Sun should be in 9th house, got {ketu_sun.get("natalHouse")}'
        )


# ─── Scenario: 2026-04-22 (API request body — Jack) ──────────────────────────

class TestTransit20260422:
    """
    Transit date 2026-04-22 with precise coordinates from the /reading API request:

        {
          "name": "Jack",
          "birthDate": "1991-12-29",
          "birthTime": "13:30",
          "latitude": "10.7765713",
          "longitude": "106.7012093",
          "timezone": "Asia/Ho_Chi_Minh",
          "transitDate": "2026-04-22"
        }

    Result must contain (Venus-Venus excluded):
      - Moon aspect Sun in 9th house
      - Sun ruler of the 5th House in the 9th House
      - Moon aspect Rahu in 9th house
      - Moon aspect Ketu in 3rd house
    """

    TRANSIT_DATE = '2026-04-22'

    REQUIRED_DESCRIPTIONS = [
        'Moon aspect Sun in 9th house',
        'Sun ruler of the 5th House in the 9th House',
        'Moon aspect Rahu in 9th house',
        'Moon aspect Ketu in 3rd house',
    ]

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_moon_aspect_sun_in_9th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Moon aspect Sun in 9th house' in descriptions, (
            'Expected "Moon aspect Sun in 9th house" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_sun_ruler_of_5th_in_9th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Sun ruler of the 5th House in the 9th House' in descriptions, (
            'Expected "Sun ruler of the 5th House in the 9th House" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_moon_aspect_rahu_in_9th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Moon aspect Rahu in 9th house' in descriptions, (
            'Expected "Moon aspect Rahu in 9th house" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_moon_aspect_ketu_in_3rd(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Moon aspect Ketu in 3rd house' in descriptions, (
            'Expected "Moon aspect Ketu in 3rd house" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_no_venus_venus_self_aspect(self):
        """Venus-Venus self-to-self aspects should be excluded."""
        events = self._get_events()
        venus_self = [
            e for e in events
            if e.get('transitPlanet') == 'Venus' and e.get('natalPlanet') == 'Venus'
        ]
        assert len(venus_self) == 0, (
            'Venus-Venus self-aspect should not appear.\n'
            'Found: ' + ', '.join(e['description'] for e in venus_self)
        )

    def test_all_required_descriptions_present(self):
        """All required descriptions must appear in the same report."""
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        missing = [d for d in self.REQUIRED_DESCRIPTIONS if d not in descriptions]
        assert not missing, (
            'Missing required descriptions:\n' + '\n'.join(f'  {d}' for d in missing) +
            '\nActual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )


# ─── Scenario: 2026-04-24 (API request body — Jack) ──────────────────────────

class TestTransit20260424:
    """
    Transit date 2026-04-24 with precise coordinates from the /reading API request.

    Result must contain:
      - Moon aspect Saturn in 10th house
    """

    TRANSIT_DATE = '2026-04-24'

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_moon_aspect_saturn_in_10th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Moon aspect Saturn in 10th house' in descriptions, (
            'Expected "Moon aspect Saturn in 10th house" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )


# ─── Scenario: 2026-04-27 (API request body — Jack) ──────────────────────────

class TestTransit20260427:
    """
    Transit date 2026-04-27 with precise coordinates from the /reading API request.

    Result must contain:
      - Sun Aspecting Ascendant (ASC) : Exact
    """

    TRANSIT_DATE = '2026-04-27'

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_sun_aspecting_ascendant_exact(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Sun Aspecting Ascendant (ASC) : Exact' in descriptions, (
            'Expected "Sun Aspecting Ascendant (ASC) : Exact" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_ascendant_aspect_event_type(self):
        events = self._get_events()
        asc_event = next(
            (e for e in events if e.get('type') == 'ascendant_aspect' and e.get('transitPlanet') == 'Sun'),
            None,
        )
        assert asc_event is not None, 'Expected an ascendant_aspect event for Sun'


# ─── Scenario: 2026-05-03 (API request body — Jack) ──────────────────────────

class TestTransit20260503:
    """
    Transit date 2026-05-03 with precise coordinates from the /reading API request.

    Result must contain:
      - Ketu aspect Sun in 9th house : Exact
      - Sun ruler of the 5th House in the 9th House
      - Jupiter in 5th (Dispositor)
    """

    TRANSIT_DATE = '2026-05-03'

    REQUIRED_DESCRIPTIONS = [
        'Ketu aspect Sun in 9th house : Exact',
        'Sun ruler of the 5th House in the 9th House',
        'Jupiter in 5th (Dispositor)',
    ]

    def _get_events(self):
        sidereal, tropical, transit = get_natal_transits(BIRTH_DATA_HCM_PRECISE, self.TRANSIT_DATE)
        return calculate_transit_report(sidereal, tropical, transit)

    def test_report_is_non_empty(self):
        events = self._get_events()
        assert len(events) > 0

    def test_ketu_aspect_sun_in_9th_exact(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Ketu aspect Sun in 9th house : Exact' in descriptions, (
            'Expected "Ketu aspect Sun in 9th house : Exact" in report.\n'
            'Actual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )

    def test_sun_ruler_of_5th_in_9th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Sun ruler of the 5th House in the 9th House' in descriptions

    def test_jupiter_dispositor_in_5th(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        assert 'Jupiter in 5th (Dispositor)' in descriptions

    def test_all_required_descriptions_present(self):
        events = self._get_events()
        descriptions = [e['description'] for e in events]
        missing = [d for d in self.REQUIRED_DESCRIPTIONS if d not in descriptions]
        assert not missing, (
            'Missing required descriptions:\n' + '\n'.join(f'  {d}' for d in missing) +
            '\nActual descriptions:\n' + '\n'.join(f'  {d}' for d in descriptions)
        )


# ─── Manual runner (mirrors the old _run_test behaviour) ─────────────────────

def run_manual_test():
    """Print a readable report for manual verification (replaces _run_test)."""
    for birth_data, transit_date, label in [
        (BIRTH_DATA_HCM,         '2026-04-02', 'Original regression (2026-04-02)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-03-31', 'API request body (2026-03-31)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-04-11', 'API request body — Jack (2026-04-11)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-04-12', 'API request body — Jack (2026-04-12)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-04-13', 'API request body — Jack (2026-04-13)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-04-19', 'API request body — Jack (2026-04-19)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-04-20', 'API request body — Jack (2026-04-20)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-04-21', 'API request body — Jack (2026-04-21)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-04-22', 'API request body — Jack (2026-04-22)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-04-24', 'API request body — Jack (2026-04-24)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-04-27', 'API request body — Jack (2026-04-27)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-05-03', 'API request body — Jack (2026-05-03)'),
    ]:
        print(f'\n{"=" * 60}')
        print(f'Scenario: {label}')
        print(f'Birth: {birth_data["birthDate"]} {birth_data["birthTime"]}')
        print(f'Location: {birth_data["latitude"]}N, {birth_data["longitude"]}E')
        print(f'Transit date: {transit_date}')
        print('=' * 60)

        sidereal, tropical, transit = get_natal_transits(birth_data, transit_date)

        print('\n--- Sidereal Natal (houses) ---')
        for p in sidereal:
            print(f'  {p["name"]:12s}  {p["sign"]:13s}  house={p["house"]:<3}  deg={p["fullDegree"]:.2f}')

        print('\n--- Transit Report ---')
        events = calculate_transit_report(sidereal, tropical, transit)
        for e in events:
            print(f'  {e["description"]}')


if __name__ == '__main__':
    run_manual_test()
