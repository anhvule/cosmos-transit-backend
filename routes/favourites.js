const express = require('express');
const router = express.Router();
const favouritesDb = require('../db/favourites');
const { createFavouritesService } = require('../services/favourites');
const favouritesService = createFavouritesService(favouritesDb);

/**
 * Favourites — per-user transit-date bookmarks with a free-text memory.
 *
 * Identity is opaque: the client generates a stable `userKey` once (UUID-ish,
 * stored locally) and sends it with every request. There is no auth — losing
 * the device key means losing access to those rows.
 *
 * POST   /api/favourites              — body: { userKey, transitDate (YYYY-MM-DD), title?, description }
 * GET    /api/favourites?userKey=XYZ  — returns array sorted by transitDate desc
 * DELETE /api/favourites/:id?userKey=XYZ — 204 on success, 404 if not owned
 */
router.post('/favourites', (req, res) => {
  try {
    const { userKey, transitDate, title, description } = req.body || {};
    if (!userKey || !transitDate || description == null) {
      return res.status(400).json({
        error: 'Missing required fields: userKey, transitDate, description',
      });
    }
    const fav = favouritesService.create({ userKey, transitDate, title, description });
    res.status(201).json(fav);
  } catch (error) {
    if (error.code === 'INVALID_INPUT') {
      return res.status(400).json({ error: error.message });
    }
    console.error('favourites create error:', error.message);
    res.status(500).json({ error: 'Failed to save favourite. Please try again later.' });
  }
});

router.get('/favourites', (req, res) => {
  try {
    const userKey = req.query.userKey;
    if (!userKey) {
      return res.status(400).json({ error: 'Missing userKey query parameter' });
    }
    res.json(favouritesService.list(String(userKey)));
  } catch (error) {
    console.error('favourites list error:', error.message);
    res.status(500).json({ error: 'Failed to list favourites.' });
  }
});

router.delete('/favourites/:id', (req, res) => {
  try {
    const userKey = req.query.userKey;
    const id = parseInt(req.params.id, 10);
    if (!userKey) {
      return res.status(400).json({ error: 'Missing userKey query parameter' });
    }
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid favourite id' });
    }
    const ok = favouritesService.remove({ id, userKey: String(userKey) });
    if (!ok) {
      return res.status(404).json({ error: 'Favourite not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('favourites delete error:', error.message);
    res.status(500).json({ error: 'Failed to delete favourite.' });
  }
});

module.exports = router;
