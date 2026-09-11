# To-X-or-UI

A local pass-and-play party game for 2+ players: everyone reviews the same
UX/UI screen, privately writes up what's wrong with it, then you reveal all
the critiques and argue about it.

No accounts, no install, nothing leaves the browser. Built-in library of 10
"broken" screens (checkout, sign-up, dashboard, pricing, settings, mobile
nav, search, onboarding, product page, 404) — each with real, deliberately
placed UX/UI problems.

## How to play

1. **Setup** — add players (2–8), pick timer lengths, pick a screen to
   review (or let it pick a random one each round).
2. **Review together** — everyone looks at the same screen at once while a
   shared timer counts down. Talk through first impressions, but don't
   settle on an answer yet.
3. **Write it up (private, pass the device)** — one at a time, each player
   gets a personal timer to tag issues (Contrast, Navigation, Dark Patterns,
   etc.) and write a short critique. Everyone else looks away — answers stay
   hidden until the reveal.
4. **Reveal & debate** — all critiques are shown side by side. Optionally
   reveal the designer's own list of intentionally hidden issues as extra
   discussion fuel.
5. **Next round or wrap up** — play another screen with the same group, or
   end the game and see a recap of every round played.

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
  URL on the shared device. (Uses `npx serve`, downloaded on first run only.)
- **Deploy it** (e.g. to Vercel) as a static site for a shareable link — it's
  plain HTML/CSS/JS, so no framework or build settings are needed. You'd
  still play pass-and-play on one screen/device, same as running it locally.

## Playing together

This is built for **one shared device** — pass a phone, tablet, or laptop
around the table. That's what makes the "hidden until reveal" mechanic work
without needing separate logins or a backend.

## Files

- `index.html` — page shell
- `style.css` — all styling
- `scenarios.js` — the 10 built-in "broken" screens + the critique tag list
- `app.js` — game logic (state machine, timers, rendering)

## Adding your own screens

Every entry in `scenarios.js`'s `SCENARIOS` array is just a title, a chunk
of self-contained HTML/CSS (rendered in a sandboxed iframe, so it can't
affect the rest of the game), and an optional list of "designer's notes" —
the intentionally hidden issues shown on request during the reveal. Copy an
existing entry as a template.
