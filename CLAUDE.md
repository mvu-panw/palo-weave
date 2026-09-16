# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

A customer-facing static site for the CoreWeave joint account, showing Palo Alto Networks product updates. Visually cloned from the internal `ai_district_hub` project (fonts, color tokens, header/footer components), stripped of anything internal-facing (team directory, internal doc links, partner logos). Co-branded with the CoreWeave logo in the header.

## Stack

Static HTML/CSS/JS, no build system, no framework.

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main` (requires GitHub Pages source set to "GitHub Actions" in repo settings — one-time manual step).

## Access control

`index.html` and `js/auth.js` implement a client-side shared-password gate (SHA-256 hash check, `localStorage["intranetAuth"]`, `requireAuth()`/`logout()` helpers) — but **no page currently calls `requireAuth()`**. `updates.html`, the only content page, is public by design. The login flow is effectively orphaned right now: it still works (enter the password, get redirected to `updates.html`), but nothing requires going through it. Keep this in mind before assuming the site is access-controlled — if a new page needs gating, copy `updates.html`'s pre-auth-removal history (see git log) for the `requireAuth()` guard script and "Log out" footer link pattern.

- `PASSWORD_HASH` in `js/auth.js` holds the SHA-256 hex digest of the shared password (never the plaintext). To rotate it, compute a new digest in a browser console — see the comment in `js/auth.js` — and replace the constant.
- This was always a deterrent, not real security — the password hash and check logic are visible via view-source, and a determined visitor can bypass the check via dev tools. There is no per-user identity or backend enforcement.

## No templating

Header, nav, and footer markup are copy-pasted into every HTML page (`index.html` uses a simplified header-less gate layout; `updates.html` has the full header+nav+footer). When changing nav items, branding text, or footer content, update all pages by hand.

## Content

`updates.html` ("Product Updates") is the only content page: it embeds a Google Doc newsletter, plus an "NGFW" section (`.section-heading`) embedding a Google Slides deck below it. It also has a "Palo Security Advisories" nav link straight to `https://security.paloaltonetworks.com/` (`target="_blank"`, external, not part of this site).

Both embeds use the `.embed-wrap`/`.embed-frame` pattern (adapted from `ai_district_hub`'s newsletter embed): an iframe pointed at the doc's `/preview` URL (swap in for the `/edit?usp=sharing` share link), plus an "Open in new tab" link to the original share URL. Access to the embedded content follows whatever the Google Doc's own sharing settings allow — it is not controlled by this site's password gate (which, again, isn't currently wired to anything). A `.embed-placeholder-note` overlay style exists in `css/styles.css` for marking an embed that hasn't been wired up yet, for reuse on future pages.
