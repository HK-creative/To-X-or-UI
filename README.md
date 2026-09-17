# To-X-or-UI

A solo UX/UI eye-test game. You're shown a real-looking product screen and a
checklist of possible problems with it. Some are genuine UX/UI issues, some
are decoys that sound plausible but aren't actually true of that screen.
Check every real issue — nothing else — and find out immediately whether
you're right.

No accounts, no install, nothing leaves the browser. Built-in library of 10
"broken" screens (checkout, sign-up, dashboard, pricing, settings, mobile
nav, search, onboarding, product page, 404), each with real, deliberately
placed UX/UI problems and hand-written decoys.

## How to play

1. **Pick how many screens** — 3, 5, or all 10 — and hit Start.
2. **Look at the screen**, then check off every option in the list you
   believe is a genuine problem with it.
3. **Submit** — every option is instantly marked: a real issue you caught
   (✅), a decoy you wrongly flagged (❌), a real issue you missed (⚠️), or
   a decoy you correctly left alone. Each one comes with a short
   explanation.
4. **Next screen**, and so on — then a final score and rating across the
   whole run.

Scoring: your % is how many of all those true/false calls you got right,
across every option, on every screen you played.

Progress is saved automatically (to your browser only), so an accidental
refresh or a closed tab won't lose the game in progress.

## Running it

No build step, no server framework, no dependencies to install for the game
itself. Pick whichever is easiest:

- **Just open the file.** Double-click `index.html` (or drag it into a
  browser window). Works entirely offline.
- **One command, if you have Node.js installed:**
  ```
  npm start
  ```
  This runs a tiny local web server on <http://localhost:3000> — open that
  URL in a browser. (Uses `npx serve`, downloaded on first run only.)
- **Deploy it** (e.g. to Vercel) as a static site for a shareable link — it's
  plain HTML/CSS/JS, so no framework or build settings are needed.

## Files

- `index.html` — page shell
- `style.css` — all styling
- `scenarios.js` — the 10 built-in "broken" screens, their real issues, and
  their decoy options
- `app.js` — game logic (state machine, scoring, rendering)

## Adding your own screens

Every entry in `scenarios.js`'s `SCENARIOS` array has a title, a chunk of
self-contained HTML/CSS (rendered in a sandboxed iframe, so it can't affect
the rest of the game), and an `issues` list mixing real problems
(`correct: true`) with decoys (`correct: false`) — each with an `explain`
string shown at reveal. Copy an existing entry as a template; roughly 5 real
issues and 3 decoys per screen reads well.
