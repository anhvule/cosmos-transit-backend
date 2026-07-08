const express = require('express');
const router = express.Router();

/**
 * POST /api/market-signal
 *
 * Predict the speculative-market posture (favourable / cautious / normal) for
 * a single transit date by running the SuddenGainSigns and SuddenLossesSigns
 * rule sets against three bundled famous-investor charts:
 *   - Stanley Druckenmiller (top-down macro · momentum)
 *   - Bill Ackman          (activist · concentrated equity)
 *   - George Soros         (reflexivity · contrarian macro)
 *
 * The verdict is the aggregation across the three charts — same premise as
 * /api/caution-dates, but applied per-date via the gain/loss rule sets rather
 * than via the dasha layer. See services/market-signal.js for the rationale.
 *
 * Request body:
 * {
 *   "transitDate": "2026-05-17"  // optional; defaults to today (UTC)
 * }
 *
 * Response:
 * {
 *   "transitDate": "2026-05-17",
 *   "investors":   [{ key, name, style }, ...],
 *   "day": { date, verdict, confidence, summary, perInvestor: [...] }
 * }
 */
router.post('/market-signal', async (req, res) => {
  try {
    const raw = (req.body && req.body.transitDate) || new Date().toISOString().substring(0, 10);
    const date = new Date(raw).toISOString().substring(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'transitDate must be YYYY-MM-DD' });
    }
    const { computeMarketSignal } = require('../services/market-signal');
    const { investors, days } = await computeMarketSignal([date]);
    res.json({ transitDate: date, investors, day: days[0] });
  } catch (error) {
    console.error('market-signal endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to compute market signal. Please try again later.' });
  }
});

/**
 * POST /api/market-signal-weekly
 *
 * Same as /api/market-signal but for an entire Mon–Sun window. Used by the
 * weekly UI to render a 7-day market-posture strip.
 *
 * Request body:
 * {
 *   "weekStart": "2026-05-11"  // YYYY-MM-DD (Monday). Required.
 * }
 *
 * Response:
 * {
 *   "weekStart": "2026-05-11",
 *   "weekEnd":   "2026-05-17",
 *   "investors": [...],
 *   "days":      [{ date, verdict, confidence, summary, perInvestor }, ... 7 entries ]
 * }
 */
router.post('/market-signal-weekly', async (req, res) => {
  try {
    const weekStart = req.body && req.body.weekStart;
    if (!weekStart || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
      return res.status(400).json({ error: 'weekStart must be in YYYY-MM-DD format' });
    }
    const { computeMarketSignal, weekDates } = require('../services/market-signal');
    const dates = weekDates(weekStart);
    const { investors, days } = await computeMarketSignal(dates);
    res.json({
      weekStart,
      weekEnd: dates[dates.length - 1],
      investors,
      days,
    });
  } catch (error) {
    console.error('market-signal-weekly endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to compute weekly market signal. Please try again later.' });
  }
});

module.exports = router;
