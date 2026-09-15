# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

A customer-facing static site showing Palo Alto Networks product/feature updates and reference resources. Visually cloned from the internal `ai_district_hub` project (fonts, color tokens, header/footer/card components), stripped of anything internal-facing (team directory, internal doc links, partner logos).

## Stack

Static HTML/CSS/JS, no build system, no framework.

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main` (requires GitHub Pages source set to "GitHub Actions" in repo settings — one-time manual step).

## Access control

The site is gated behind a single shared password, checked entirely client-side in `js/auth.js`:

- `PASSWORD_HASH` in `js/auth.js` holds the SHA-256 hex digest of the shared password (never the plaintext). To rotate the password, compute a new digest in a browser console — see the comment in `js/auth.js` for the exact snippet — and replace the constant.
- On correct entry, `index.html` sets `localStorage["intranetAuth"] = "1"`. Every gated page (`updates.html`, `resources.html`) calls `requireAuth()` from `js/auth.js` in an inline `<script>` before `</body>`, redirecting to `index.html` if the key is missing.
- `localStorage` (not `sessionStorage`) is used deliberately so a returning customer doesn't have to re-enter the password every visit. This means a shared/public computer stays "logged in" until someone clicks the "Log out" link in the footer, which clears the key.
- This is a deterrent, not real security — the password hash and check logic are visible via view-source, and a determined visitor can bypass the check via dev tools. There is no per-user identity or backend enforcement.

## No templating

Header, nav, and footer markup are copy-pasted into every HTML page (`index.html` uses a simplified header-less gate layout; `updates.html`/`resources.html` share the full header+nav+footer). When changing nav items, branding text, or footer content, update all pages by hand.

## Updates content

`js/updates-data.js` holds the `UPDATES` array (`title`, `date` as ISO `YYYY-MM-DD`, `category`, `description`, optional `link`). Add a new update by adding an object to this array — `js/updates.js` sorts by date (newest first) and renders cards automatically; no other file needs to change. Leave `link` empty for a non-clickable card.

`resources.html`'s cards are hand-written (not data-driven), matching how `ai_district_hub`'s own `resources.html` is hand-written — only content that changes frequently (like Updates) uses the data-array pattern.
