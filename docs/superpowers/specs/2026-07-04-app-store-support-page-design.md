# App Store Support Page Design

**Date:** 2026-07-04  
**Approach:** Static HTML file + Express route (Approach 1)

## Goal

Host a public support URL on the existing Heroku API so App Store Connect can link to it from the CosmicTransit product page.

## URL

`GET /support` on the Heroku app (e.g. `https://<heroku-app>/support`).

Paste that full URL into App Store Connect → App Information → Support URL.

## Implementation

| Piece | Detail |
|---|---|
| Page | `public/support.html` |
| Route | `GET /support` in `server.js` serves the file via `res.sendFile` |
| Email | Placeholder `support@cosmictransit.ai` (edit in HTML later) |

## Page content

- App name: CosmicTransit
- Short description of the app (personalized astrology / transit guidance)
- Support contact email (mailto link)
- Expected response time: within 2 business days
- Mobile-friendly, readable layout (no framework, no assets)

## Out of scope

- Privacy policy page
- FAQ
- Contact form
- Branding assets / logo
- Rate limiting on `/support` (public marketing page, not an API)

## Success criteria

- Visiting `/support` on the deployed Heroku app returns HTML (not JSON)
- Page shows a clear support email users can tap/click
- URL is suitable to paste into App Store Connect
