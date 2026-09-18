# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

A customer-facing static site for the CoreWeave joint account, showing Palo Alto Networks product updates and technical reference material. Visually cloned from the internal `ai_district_hub` project (fonts, color tokens, header/footer components), stripped of anything internal-facing (team directory, internal doc links, partner logos).

## Stack

Static HTML/CSS/JS, no build system, no framework.

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main` (requires GitHub Pages source set to "GitHub Actions" in repo settings — one-time manual step).

## Access control

`index.html` and `js/auth.js` implement a client-side shared-password gate (SHA-256 hash check, `localStorage["intranetAuth"]`, `requireAuth()`/`logout()` helpers) — but **no page currently calls `requireAuth()`**. Every content page is public by design. The login flow is effectively orphaned right now: it still works (enter the password, get redirected to `updates.html`), but nothing requires going through it. Keep this in mind before assuming the site is access-controlled — if a page needs gating, copy the `requireAuth()` guard script and "Log out" footer link pattern from git history (see the commit that removed it from `updates.html`).

- `PASSWORD_HASH` in `js/auth.js` holds the SHA-256 hex digest of the shared password (never the plaintext). To rotate it, compute a new digest in a browser console — see the comment in `js/auth.js` — and replace the constant.
- This was always a deterrent, not real security — the password hash and check logic are visible via view-source, and a determined visitor can bypass the check via dev tools. There is no per-user identity or backend enforcement.

## No templating

Header, nav, and footer markup are copy-pasted into every HTML page (`index.html` uses a simplified header-less gate layout; every content page shares the full header+nav+footer). When changing nav items, branding text, or footer content, update all pages by hand.

The nav has a "Technical Resources" dropdown (`.nav-dropdown`/`.nav-dropdown-menu`, hover + `:focus-within` driven, no JS) nesting `techdocs.html`, `github.html`, `api-docs.html`, and `slide-decks-spreadsheets.html`. The trigger is a `.nav-dropdown-label` span, not a link — there's no landing page for "Technical Resources" itself. Add `active` to the label span (not just the matching link inside the menu) on any page reached through the dropdown, so the top-level nav still shows where you are.

## Content

- `updates.html` ("Product Updates") embeds a Google Doc newsletter.
- `techdocs.html` (under "Technical Resources") embeds a single doc — a placeholder, not yet wired to a real doc.
- `github.html`, `api-docs.html`, and `slide-decks-spreadsheets.html` (under "Technical Resources") are `.resource-grid`/`.resource-card` link lists (title + description + external link) rather than embeds — `github.html` for repo links, `api-docs.html` for PAN developer-portal links, `slide-decks-spreadsheets.html` for Google Drive links. An HTML comment in each shows the card markup to add more.

The top-level nav also has a "Palo Security Advisories" link straight to `https://security.paloaltonetworks.com/` (`target="_blank"`, external, not part of this site).

Single-doc embeds use the `.embed-wrap`/`.embed-frame` pattern (adapted from `ai_district_hub`'s newsletter embed): an iframe pointed at the doc's `/preview` URL (swap in for the `/edit?usp=sharing` share link), plus an "Open in new tab" link to the original share URL. Access to embedded content follows whatever the doc's own sharing settings allow — it is not controlled by this site's password gate (which, again, isn't currently wired to anything). A `.embed-placeholder-note` overlay style marks an embed that hasn't been wired up yet.
