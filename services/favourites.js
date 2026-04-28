/**
 * Favourites service — CRUD for per-user transit-date bookmarks.
 *
 * Identity model: there is no auth. Each client generates a stable opaque
 * `user_key` (UUID-ish, stored locally) and sends it with every request.
 * All reads/writes/deletes are scoped to that user_key, so two devices have
 * fully independent favourite lists. Losing the device == losing the list.
 *
 * Service is constructed with a `better-sqlite3` Database handle so tests
 * can inject an in-memory DB.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isISODate(s) {
  if (typeof s !== 'string' || !ISO_DATE.test(s)) return false;
  // Reject things like 2025-13-40 — let Date parse it strictly.
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

const TITLE_MAX = 200;
const DESC_MAX = 4000;

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_key TEXT NOT NULL,
    transit_date TEXT NOT NULL,
    title TEXT,
    description TEXT NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_favourites_user_key
    ON favourites(user_key);
`;

/**
 * Build a Favourites service bound to the given DB handle.
 *
 * @param {import('better-sqlite3').Database} db
 */
function createFavouritesService(db) {
  // Make sure the schema exists for callers that pass an in-memory DB.
  db.exec(SCHEMA_SQL);

  const insertStmt = db.prepare(
    'INSERT INTO favourites (user_key, transit_date, title, description) VALUES (?, ?, ?, ?)'
  );
  const findOneStmt = db.prepare(
    `SELECT id, user_key AS userKey, transit_date AS transitDate,
            title, description, created_at AS createdAt
       FROM favourites WHERE id = ?`
  );
  const listStmt = db.prepare(
    `SELECT id, user_key AS userKey, transit_date AS transitDate,
            title, description, created_at AS createdAt
       FROM favourites
      WHERE user_key = ?
      ORDER BY transit_date DESC, id DESC`
  );
  const deleteStmt = db.prepare(
    'DELETE FROM favourites WHERE id = ? AND user_key = ?'
  );

  function create({ userKey, transitDate, title, description }) {
    if (!userKey || typeof userKey !== 'string') {
      const e = new Error('userKey is required');
      e.code = 'INVALID_INPUT';
      throw e;
    }
    if (!isISODate(transitDate)) {
      const e = new Error('transitDate must be a valid YYYY-MM-DD');
      e.code = 'INVALID_INPUT';
      throw e;
    }
    if (description == null || typeof description !== 'string') {
      const e = new Error('description is required');
      e.code = 'INVALID_INPUT';
      throw e;
    }
    const cleanTitle = title == null
      ? null
      : String(title).trim().slice(0, TITLE_MAX) || null;
    const cleanDesc = String(description).trim().slice(0, DESC_MAX);

    const result = insertStmt.run(userKey, transitDate, cleanTitle, cleanDesc);
    return findOneStmt.get(result.lastInsertRowid);
  }

  function list(userKey) {
    if (!userKey || typeof userKey !== 'string') return [];
    return listStmt.all(userKey);
  }

  function remove({ id, userKey }) {
    if (!userKey || !Number.isInteger(id)) return false;
    const result = deleteStmt.run(id, userKey);
    return result.changes > 0;
  }

  return { create, list, remove };
}

module.exports = {
  createFavouritesService,
  isISODate,
  SCHEMA_SQL,
  TITLE_MAX,
  DESC_MAX,
};
