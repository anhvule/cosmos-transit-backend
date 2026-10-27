# Mind & Energy: Focus, Irritability and Steadiness Design

**Date:** 2026-10-27  
**Approach:** Extend the existing rule-based scorer (`services/mind-energy.js`) with three more metrics  
**Constraint:** Existing `overthinking` and `vitality` scores and drivers must not change. The response stays backward compatible: new fields are additive.

## Goal

`POST /api/mind-energy-monthly` currently scores two daily metrics, overthinking and vitality. Add three more Vedic-derived daily metrics that people find useful day to day:

| Metric | Meaning | Direction | Main factors |
|---|---|---|---|
| `focus` | Mental clarity and concentration | higher = sharper | Mercury, Jupiter, Moon's sign modality |
| `irritability` | Short temper, friction with others | higher = more irritable | Mars |
| `steadiness` | Emotional stability | higher = steadier | Moon strength (paksha bala) |

All three use only inputs `scoreDay` already receives (natal and transit signs, houses, `siderealLon`, `speed`, dasha, Moon nakshatra lord, tithi). No Python bridge or chart-math changes.

### Out of scope

- Tara bala / Chandra bala "day quality" badge (needs the natal Moon nakshatra; separate change).
- Longer-horizon life-area metrics (luck, romance, drive, intuition).
- Re-tuning existing overthinking / vitality weights.

## Scoring model

Same model as the existing metrics: each metric starts at `BASE` (50), each rule that fires adds a weighted delta and is reported as a driver `{ metric, label, delta }`, and the total is clamped to 0–100. Weights live in `WEIGHTS.focus`, `WEIGHTS.irritability` and `WEIGHTS.steadiness` so they can be tuned without touching the logic.

### Shared helpers

- `GRAHA_DRISHTI` gains `Mars: [1, 4, 7, 8]` and `Saturn: [1, 3, 7, 10]` (sign distance; 1 = conjunction).
- New `aspects(planet, fromSign, toSign)` helper; the existing Jupiter-aspects-Moon rule uses it (same behaviour).
- `FIXED_SIGNS` (Taurus, Leo, Scorpio, Aquarius) and `MOVABLE_SIGNS` (Aries, Cancer, Libra, Capricorn).
- Mercury combustion (within 12° of the Sun) is computed once and shared by overthinking and focus.

### Focus rules

| Rule | Delta |
|---|---|
| Mercury retrograde | −8 |
| Mercury combust | −6 |
| Jupiter conjoins or aspects transit Mercury | +6 |
| Transit Moon in a fixed sign | +4 |
| Transit Moon in a movable sign | −3 |
| Moon conjunct Rahu/Ketu | −6 |
| Transit Mercury in house 1 / 5 / 10 | +5 |
| Transit Mercury in house 8 / 12 | −6 |
| Mercury antardasha / mahadasha with natal Mercury exalted or own | +5 / +3 |
| Transit Mercury dignity (exalted / own / debilitated) | +12 / +8 / −12 |
| Natal Mercury dignity (exalted / own / debilitated) | +6 / +4 / −6 |

### Irritability rules

| Rule | Delta |
|---|---|
| Mars conjoins or aspects the Moon | +12 |
| Mars conjunct Saturn | +10 |
| Mars conjunct Rahu (Angarak yoga) | +12 |
| Transit Mars in house 1 / 7 / 8 | +6 |
| Transit Sun exalted or own (Aries / Leo) | +3 |
| Jupiter aspects the Moon | −8 |
| Venus conjunct the Moon | −4 |
| Mars or Rahu antardasha / mahadasha | +6 / +4 |
| Transit Mars dignity (exalted / own / debilitated) | +4 / +4 / +6 |

### Steadiness rules

| Rule | Delta |
|---|---|
| Waxing / waning Moon (paksha bala) | +6 / −4 |
| Near Purnima (tithi 13–15) | +6 |
| Near Amavasya (tithi 28–30) | −8 |
| Transit Moon in house 1 / 5 / 9 / 11 | +4 |
| Transit Moon in house 4 / 8 / 12 | −4 / −8 / −6 |
| Mars conjoins or aspects the Moon | −8 |
| Moon conjunct Saturn (Vish yoga) | −8 |
| Moon conjunct Rahu/Ketu (Grahan yoga) | −10 |
| Jupiter aspects the Moon | +8 |
| Venus conjunct the Moon | +4 |
| Moon antardasha / mahadasha with natal Moon debilitated | −5 / −3 |
| Transit Moon dignity (exalted / own / debilitated) | +10 / +6 / −12 |
| Natal Moon dignity (exalted / own / debilitated) | +6 / +4 / −6 |

Debilitation penalties go through the existing `dignityDrivers`, so neecha bhanga (cancelled debilitation) halves them as it already does for Sun, Mars and Moon.

## API contract

`scoreDay` returns `{ overthinking, vitality, focus, irritability, steadiness, drivers }`.

`POST /api/mind-energy-monthly` days gain three fields (all `null` on days with no transit data):

```json
{
  "date": "2026-11-01",
  "overthinking": 62, "vitality": 41,
  "focus": 55, "irritability": 48, "steadiness": 60,
  "drivers": [{ "metric": "irritability", "label": "Mars aspects the Moon", "delta": 12 }]
}
```

`driver.metric` may now be any of the five metric keys. `MAX_DRIVERS_PER_DAY` rises from 5 to 8 so every metric can surface its drivers.

## App (cosmos-transit-ui)

- `MindEnergyDay` adds `focus`, `irritability`, `steadiness` (default 0 when missing, so older responses still parse).
- `mind_energy_screen.dart` keeps one `_metrics` list (key, label, colour, getter) instead of per-metric constants. Colours: overthinking `#FBBF24`, vitality `#4ADE80`, focus `#60A5FA`, irritability `#F87171`, steadiness `#C084FC`.
- The legend becomes tappable chips that show/hide each line. Default visible: overthinking + vitality. At least one line always stays on.
- The day card shows all five scores in a two-column grid and the top 5 drivers, coloured by metric.
- The explainer adds one sentence per new metric.
- `ApiCacheService._cacheVersion` goes `v3` → `v4` so cached months without the new fields are evicted.

## Rollout

Deploy the backend before shipping the app build. Against an old backend the app parses fine but shows 0 for the three new scores.

## Verification

- Backend: `npx jest` — new tests cover Mars-on-Moon (irritability up, steadiness down), Angarak yoga, fixed-sign Moon (focus up), Mercury retrograde (focus down), debilitated Moon (steadiness down) and 0–100 bounds for all five. Route test accepts the new metric keys and up to 8 drivers. Existing overthinking / vitality tests pass unchanged.
- App: `flutter analyze` and `flutter test` (model test covers the new fields and their defaults).
- Manual: open Mind & Energy in the iOS simulator against the updated backend, toggle chips, tap a day and check all five scores and coloured drivers.
