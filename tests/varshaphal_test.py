"""pytest tests for services/varshaphal.py — focuses on the
forecast-year → Pravesh helper added to fix the year-labelling mismatch
flagged against Yearly.docx.

Run:
    pytest tests/varshaphal_test.py -v
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'services'))

from varshaphal import find_varshapravesh_for_forecast_year  # noqa: E402

BIRTH_DEC29 = {
    'year': 1991, 'month': 12, 'day': 29, 'hour': 13, 'minute': 30,
    'lat': 10.7755, 'lng': 106.7021, 'tz': 'Asia/Ho_Chi_Minh',
}

BIRTH_MAR15 = {
    'year': 1990, 'month': 3, 'day': 15, 'hour': 8, 'minute': 0,
    'lat': 10.7755, 'lng': 106.7021, 'tz': 'Asia/Ho_Chi_Minh',
}


def test_late_year_birthday_uses_previous_year_pravesh():
    """A Dec 29 birthday's "2025 horoscope" is the Tajika year that *starts*
    on Dec 29, 2024 — matches Yearly.docx labelling."""
    pravesh = find_varshapravesh_for_forecast_year(BIRTH_DEC29, 2025)
    assert pravesh.year == 2024, (
        f'Expected Pravesh in 2024 for Dec 29 birthday + forecast year 2025, '
        f'got {pravesh.year}'
    )
    assert pravesh.month == 12 and pravesh.day == 29


def test_early_year_birthday_uses_same_year_pravesh():
    """A Mar 15 birthday's "2025 horoscope" starts on Mar 15, 2025 — that
    Tajika year covers ~292 of 365 days of 2025."""
    pravesh = find_varshapravesh_for_forecast_year(BIRTH_MAR15, 2025)
    assert pravesh.year == 2025, (
        f'Expected Pravesh in 2025 for Mar 15 birthday + forecast year 2025, '
        f'got {pravesh.year}'
    )
    assert pravesh.month == 3 and pravesh.day == 15


def test_yearly_docx_reference_chart_matches_for_input_2025():
    """End-to-end: forecast year 2025 for the Yearly.docx birth data should
    produce Tajika year 34 (Pravesh Dec 29, 2024) — the chart the docx
    actually renders."""
    from varshaphal import (
        build_annual_chart, compute_age_at_pravesh, house_of_sign, muntha_sign,
    )

    pravesh = find_varshapravesh_for_forecast_year(BIRTH_DEC29, 2025)
    chart = build_annual_chart(BIRTH_DEC29, pravesh)

    # Doc claims annual Lagna = Kanya (Virgo), birth Lagna in 8th house.
    assert chart['annualLagna'] == 'Virgo'
    assert chart['birthLagna'] == 'Aries'
    assert house_of_sign(chart['annualLagna'], chart['birthLagna']) == 8

    # Doc: Tajika year 34 → age completed 33.
    age = compute_age_at_pravesh(BIRTH_DEC29, pravesh)
    assert age == 33

    # Doc: Muntha in Capricorn (Makara), 5th house of annual chart.
    m_sign = muntha_sign(chart['birthLagna'], age)
    assert m_sign == 'Capricorn'
    assert house_of_sign(chart['annualLagna'], m_sign) == 5

    # Doc per-planet houses in the annual chart.
    expected_houses = {
        'Sun': 4, 'Moon': 3, 'Mars': 11, 'Mercury': 3,
        'Jupiter': 9, 'Venus': 5, 'Saturn': 6, 'Rahu': 7, 'Ketu': 1,
    }
    actual = {p['name']: p['house'] for p in chart['planets']}
    for planet, house in expected_houses.items():
        assert actual[planet] == house, (
            f'{planet} expected in h{house}, got h{actual[planet]}'
        )
