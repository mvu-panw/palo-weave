# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

A customer-facing static site for the CoreWeave joint account, showing Palo Alto Networks product updates and the CoreWeave NGFW deployment estate. Visually cloned from the internal `ai_district_hub` project (fonts, color tokens, header/footer components), stripped of anything internal-facing (team directory, internal doc links, partner logos). Co-branded with the CoreWeave logo in the header.

## Stack

Static HTML/CSS/JS, no build system, no framework.

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main` (requires GitHub Pages source set to "GitHub Actions" in repo settings — one-time manual step).

## Access control

Most of the site is gated behind a single shared password, checked entirely client-side in `js/auth.js`. **`updates.html` ("Product Updates") is the one exception — it has no auth check and is publicly reachable without logging in.** Every other page (`resources.html`, `remote-root-of-trust-attestation.html`, `ai-dc-reference-architecture.html`) is still gated.

- `PASSWORD_HASH` in `js/auth.js` holds the SHA-256 hex digest of the shared password (never the plaintext). To rotate the password, compute a new digest in a browser console — see the comment in `js/auth.js` for the exact snippet — and replace the constant.
- On correct entry, `index.html` sets `localStorage["intranetAuth"] = "1"`. Each gated page calls `requireAuth()` from `js/auth.js` in an inline `<script>` before `</body>`, redirecting to `index.html` if the key is missing, and has a "Log out" link in the footer wired to `logout()`. `updates.html` has neither — no `js/auth.js` include, no guard script, no logout link.
- `localStorage` (not `sessionStorage`) is used deliberately so a returning customer doesn't have to re-enter the password every visit on the gated pages. This means a shared/public computer stays "logged in" until someone clicks "Log out."
- This is a deterrent, not real security — the password hash and check logic are visible via view-source, and a determined visitor can bypass the check via dev tools. There is no per-user identity or backend enforcement.

## No templating

Header, nav, and footer markup are copy-pasted into every HTML page (`index.html` uses a simplified header-less gate layout; every other page shares the full header+nav+footer). When changing nav items, branding text, or footer content, update all pages by hand.

The nav has a "Project Repo" dropdown (`.nav-dropdown`/`.nav-dropdown-menu`, hover + `:focus-within` driven, no JS) for pages that don't warrant a top-level nav slot. The trigger is a `.nav-dropdown-label` span, not a link — there's no landing page for "Project Repo" itself. Add `active` to the label span (not just the matching link inside the menu) on any page reached through the dropdown, so the top-level nav still shows where you are.

## Content

Every content page is just an embedded document, not hand-authored HTML:

- `updates.html` ("Product Updates") embeds a Google Doc newsletter, plus an "NGFW" section (`.section-heading`) embedding a Google Slides deck below it.
- `resources.html` ("Coreweave NGFW Estate") embeds a Google Sheet tracking the CoreWeave NGFW deployment.
- `remote-root-of-trust-attestation.html` and `ai-dc-reference-architecture.html` (under the "Project Repo" dropdown) embed a Google Doc and a Google Slides deck, respectively.

The top-level nav also has a "Palo Security Advisories" link straight to `https://security.paloaltonetworks.com/` (`target="_blank"`, external — not part of this site, not gated).

All four use the same `.embed-wrap`/`.embed-frame` pattern (adapted from `ai_district_hub`'s newsletter embed): an iframe pointed at the doc's `/preview` URL (swap in for the `/edit?usp=sharing` share link), plus an "Open in new tab" link to the original share URL. Access to the embedded content follows whatever the Google Doc/Sheet's own sharing settings allow — it is not controlled by this site's password gate. A `.embed-placeholder-note` overlay marks an embed that hasn't been wired up yet.
