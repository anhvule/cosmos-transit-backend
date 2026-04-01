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


# ─── Manual runner (mirrors the old _run_test behaviour) ─────────────────────

def run_manual_test():
    """Print a readable report for manual verification (replaces _run_test)."""
    for birth_data, transit_date, label in [
        (BIRTH_DATA_HCM,         '2026-04-02', 'Original regression (2026-04-02)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-03-31', 'API request body (2026-03-31)'),
        (BIRTH_DATA_HCM_PRECISE, '2026-04-11', 'API request body — Jack (2026-04-11)'),
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
