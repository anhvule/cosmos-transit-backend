# CosmicTransit.ai Backend

Express API serving Vedic/Western astrology readings — daily/weekly/monthly
transit interpretations, Vimshottari dasha, Varshaphal annual horoscope,
wealth analysis, speculative market-timing signals, and numerology — computed
from a person's birth chart. Chart math runs locally via a Python
([kerykeion](https://github.com/g-battaglia/kerykeion) / Swiss Ephemeris)
subprocess; there is no external astrology API dependency.

## Requirements

- Node.js (Express 5, `better-sqlite3`)
- Python 3.14 with `kerykeion` installed (see `requirements.txt`)

## Setup

```bash
npm install
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cp .env.example .env   # then fill in PORT / ASTROLOGY_ENGINE / PYTHON_BIN as needed
npm run dev
```

`ASTROLOGY_ENGINE=kerykeion` is the only supported engine. `PYTHON_BIN`
should point at a Python with `kerykeion` installed (defaults to `python3`
on PATH; point it at `.venv/bin/python` if using the local virtualenv above).

The server exposes a health check at `GET /health`, and static support/privacy
pages (for App Store review) at `GET /support` and `GET /privacy`.

## API

All reading endpoints are `POST` under `/api` and take a birth profile
(`name`, `birthDate`, `birthTime`, `latitude`, `longitude`, `timezone` as a
numeric UTC offset) plus endpoint-specific fields. See `routes/reading.js`
for full request/response shapes (documented inline above each handler).

| Endpoint | Purpose |
|---|---|
| `/api/career`, `/api/relationship`, `/api/advice`, `/api/food` | Daily transit interpretation by lens |
| `/api/panda/career`, `/api/panda/relationship` | Same, via the newer structured-template DB |
| `/api/investment-weekly`, `/api/investment-monthly` | Aggregated investment-lens readings over a period |
| `/api/dasha`, `/api/dasha-range` | Vimshottari dasha (MD/AD/PD/SD) at a date, or all periods in a range |
| `/api/caution-dates` | Market-wide caution windows from a bundled panel of public charts |
| `/api/market-signal`, `/api/market-signal-weekly` | Speculative gain/loss market posture for a date or week |
| `/api/yearly-summary` | Varshaphal (Tajika annual horoscope) |
| `/api/monthly-prediction` | Sun-transit + Sarvashtavarga monthly predictions |
| `/api/wealth-analysis` | Vedic wealth analysis from the natal chart |
| `/api/essence-cycle` | 10-year Essence Cycle (Western/Pythagorean numerology) |
| `/api/favourites` (GET/POST/DELETE) | Per-device bookmarked transit dates |

Rate limit: 100 requests per IP per day on all `/api/*` routes.

## Testing

```bash
npm test                    # Jest — JS unit/e2e tests
npm run test:planner        # e2e verification against real "Galactic Planner" PDF fixtures (slow, excluded from `npm test`)
.venv/bin/python -m pytest tests/astrology_kerykeion_test.py tests/varshaphal_test.py   # Python engine tests
```

## Seeding per-native descriptions

To fill in the legacy per-ascendant description tables (career, relationship,
investment, advice, food, gain, loss) for a new native, follow
[`SEEDING_GUIDE.md`](SEEDING_GUIDE.md).

## Deployment

`Procfile` runs `node server.js` as the web process (Heroku-style).

## License

MIT — see [`LICENSE`](LICENSE).
