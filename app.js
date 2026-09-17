/* ============================================================
   To-X-or-UI — solo quiz engine
   Plain JS, single global `state` object + immediate-mode render.
   No build step, no dependencies, no server required.
   ============================================================ */

const STORAGE_KEY = 'toxorui_v2';
const ROUND_PRESETS = [3, 5, SCENARIOS.length];

function defaultState() {
  return {
    screen: 'home', // home | play | result
    roundCount: SCENARIOS.length,
    order: [],       // scenario ids for this game, in play order
    index: 0,        // current round
    displayOrder: [], // shuffled option indices for the current scenario
    selections: {},  // optionIndex -> true, current round only
    submitted: false,
    results: [],     // { scenarioId, title, decisionsCorrect, decisionsTotal, correctFound, correctTotal, falsePicked, falseTotal }
    _justResumed: false,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.screen) return null;
    return parsed;
  } catch (e) { return null; }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore quota/private-mode errors */ }
}

let state = loadState() || defaultState();
if (state.screen && state.screen !== 'home') state._justResumed = true;

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scenarioById(id) { return SCENARIOS.find((s) => s.id === id); }
function currentScenario() { return state.order.length ? scenarioById(state.order[state.index]) : null; }

/* ---------------------------------------------------------------
   Mockup rendering: build a placeholder + queue a post-render
   callback that sets `iframe.srcdoc`, avoiding any HTML-attribute
   escaping headaches with the scenario markup.
   --------------------------------------------------------------- */
let mountQueue = [];
let iframeCounter = 0;

function mockupBlock(scenario, opts) {
  opts = opts || {};
  const id = 'mockup-' + (iframeCounter++);
  const height = opts.height || scenario.height || 560;
  mountQueue.push(() => {
    const el = document.getElementById(id);
    if (el) el.srcdoc = scenario.html;
  });
  return `
    <div class="mockup-shell">
      <div class="mockup-chrome">
        <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
        <span class="name">${esc(scenario.title)}</span>
      </div>
      <div style="position:relative;">
        <iframe id="${id}" sandbox="" style="height:${height}px;" title="${esc(scenario.title)}"></iframe>
        <div class="click-block"></div>
      </div>
    </div>`;
}

/* ---------------------------------------------------------------
   Scoring
   --------------------------------------------------------------- */
function computeRoundStats(scenario, selections) {
  let decisionsCorrect = 0;
  let correctFound = 0, correctTotal = 0;
  let falsePicked = 0, falseTotal = 0;
  scenario.issues.forEach((opt, i) => {
    const picked = !!selections[i];
    if (opt.correct) {
      correctTotal++;
      if (picked) correctFound++;
    } else {
      falseTotal++;
      if (picked) falsePicked++;
    }
    if (picked === opt.correct) decisionsCorrect++;
  });
  return {
    decisionsCorrect,
    decisionsTotal: scenario.issues.length,
    correctFound, correctTotal,
    falsePicked, falseTotal,
  };
}

function ratingFor(pct) {
  if (pct >= 90) return { emoji: '🦅', label: 'Eagle-Eyed Auditor' };
  if (pct >= 75) return { emoji: '🔍', label: 'Sharp Reviewer' };
  if (pct >= 55) return { emoji: '🙂', label: 'Getting There' };
  return { emoji: '☕', label: 'Needs More Coffee' };
}

/* ---------------------------------------------------------------
   Render
   --------------------------------------------------------------- */
function renderApp() {
  mountQueue = [];
  const root = document.getElementById('app');
  const resumeBanner = state._justResumed ? `
    <div class="resume-banner">
      <span>👋 Welcome back — picking up your game right where it left off.</span>
      <button class="btn btn-ghost btn-sm" onclick="App.dismissResume()">Got it</button>
    </div>` : '';

  const showRestart = state.screen !== 'home' || state.results.length > 0;

  const header = `
    <div class="brand" style="width:100%;justify-content:space-between;">
      <div style="display:flex;align-items:baseline;gap:10px;">
        <div class="logo">T<span class="x">o</span>-X-or-UI</div>
        <div class="sub">Spot the flaws. Prove it.</div>
      </div>
      ${showRestart ? `<button class="btn btn-ghost btn-sm" onclick="App.confirmRestart()">↺ Start over</button>` : ''}
    </div>`;

  let body = '';
  switch (state.screen) {
    case 'home': body = renderHome(); break;
    case 'play': body = renderPlay(); break;
    case 'result': body = renderResult(); break;
    default: body = renderHome();
  }

  root.innerHTML = `<div class="wrap">${header}${resumeBanner}${body}
    <footer class="credit">Solo play &middot; nothing leaves this browser</footer>
  </div>`;

  mountQueue.forEach((fn) => fn());
  mountQueue = [];
}

/* ---------------------------------------------------------------
   Home screen
   --------------------------------------------------------------- */
function renderHome() {
  const presetRow = ROUND_PRESETS.map((n) => `
    <button class="preset ${state.roundCount === n ? 'active' : ''}" onclick="App.setRoundCount(${n})">
      ${n === SCENARIOS.length ? 'All ' + n : n} screen${n === 1 ? '' : 's'}
    </button>`).join('');

  return `
    <h1 class="title">Can you spot the UX problems?</h1>
    <p class="lede">You'll see a real-looking product screen with a list of possible issues. Some are genuine UX/UI problems, some are decoys that sound plausible but aren't actually true of that screen. Check every real issue &mdash; nothing else. You'll see whether you're right immediately.</p>

    <div class="card">
      <div class="section-title">How many screens?</div>
      <div class="preset-row">${presetRow}</div>
    </div>

    <button class="btn btn-primary btn-lg btn-block" onclick="App.startGame()">Start →</button>

    <div class="card" style="margin-top:22px;">
      <div class="section-title">How scoring works</div>
      <div class="stack" style="font-size:13px;color:var(--text-dim);line-height:1.5;">
        <div>✅ Checking a real issue &mdash; a point.</div>
        <div>❌ Checking a decoy that isn't real &mdash; costs you.</div>
        <div>⚠️ Leaving a real issue unchecked &mdash; a miss, shown at reveal.</div>
        <div>Your final score is the % of all these calls you got right across every screen.</div>
      </div>
    </div>
  `;
}

/* ---------------------------------------------------------------
   Play screen — one screen, one checklist, then the reveal
   --------------------------------------------------------------- */
function renderPlay() {
  const scenario = currentScenario();
  if (!scenario) { state.screen = 'home'; return renderHome(); }

  const dots = state.order.map((_, i) => {
    const cls = i < state.index ? 'done' : i === state.index ? 'current' : '';
    return `<div class="dot ${cls}"></div>`;
  }).join('');

  const rows = state.displayOrder.map((i) => {
    const opt = scenario.issues[i];
    const selected = !!state.selections[i];
    let resClass = '', badge = '';
    if (state.submitted) {
      if (opt.correct && selected) { resClass = 'res-correct-hit'; badge = '<span class="badge hit">Nice catch</span>'; }
      else if (!opt.correct && selected) { resClass = 'res-wrong-hit'; badge = '<span class="badge wrong">Not real</span>'; }
      else if (opt.correct && !selected) { resClass = 'res-missed'; badge = '<span class="badge missed">Missed</span>'; }
      else { resClass = 'res-neutral'; badge = '<span class="badge neutral">Ignored ✓</span>'; }
    }
    const catLine = (state.submitted && opt.correct && opt.tag) ? `<div class="cat">${esc(tagLabel(opt.tag))}</div>` : '';
    const explainLine = state.submitted ? `<div class="explain">${esc(opt.explain)}</div>` : '';
    const onclick = state.submitted ? '' : `onclick="App.toggleOption(${i})"`;

    return `
      <div class="option-row ${selected ? 'selected' : ''} ${state.submitted ? 'locked' : ''} ${resClass}" ${onclick}>
        <div class="box">${selected ? '✓' : ''}</div>
        <div class="body">
          <div class="top-line">
            <div class="text">${esc(opt.text)}</div>
            ${badge}
          </div>
          ${catLine}
          ${explainLine}
        </div>
      </div>`;
  }).join('');

  let summaryBlock = '';
  if (state.submitted) {
    const s = computeRoundStats(scenario, state.selections);
    const pct = Math.round((s.decisionsCorrect / s.decisionsTotal) * 100);
    summaryBlock = `
      <div class="round-summary">
        <span class="big">${pct}%</span>
        Found ${s.correctFound}/${s.correctTotal} real issues &middot; ${s.falsePicked} false alarm${s.falsePicked === 1 ? '' : 's'}
      </div>`;
  }

  const isLast = state.index >= state.order.length - 1;
  const actionButton = !state.submitted
    ? `<button class="btn btn-primary btn-lg btn-block" onclick="App.submitRound()">Submit answer →</button>`
    : `<button class="btn btn-primary btn-lg btn-block" onclick="App.nextRound()">${isLast ? 'See results →' : 'Next screen →'}</button>`;

  return `
    <div class="top-actions"><span class="pill">Round ${state.index + 1} of ${state.order.length}</span></div>
    <div class="progress-dots">${dots}</div>
    <div class="card">
      ${mockupBlock(scenario)}
    </div>
    <div class="card">
      <h2 class="title">What's actually wrong with this screen?</h2>
      <p class="lede">Check every real issue below. Some options are decoys &mdash; picking one wrong costs you.</p>
      ${summaryBlock}
      ${rows}
      <div style="margin-top:16px;">${actionButton}</div>
    </div>
  `;
}

/* ---------------------------------------------------------------
   Result screen
   --------------------------------------------------------------- */
function renderResult() {
  const totalCorrect = state.results.reduce((sum, r) => sum + r.decisionsCorrect, 0);
  const totalDecisions = state.results.reduce((sum, r) => sum + r.decisionsTotal, 0);
  const pct = totalDecisions ? Math.round((totalCorrect / totalDecisions) * 100) : 0;
  const rating = ratingFor(pct);

  const rows = state.results.map((r) => {
    const rpct = Math.round((r.decisionsCorrect / r.decisionsTotal) * 100);
    return `<div class="history-row"><span>${esc(r.title)}</span><span class="pct">${rpct}%</span></div>`;
  }).join('');

  return `
    <div class="card center">
      <div class="rating">${rating.emoji}</div>
      <div class="rating-label">${rating.label}</div>
      <div class="rating-sub">${pct}% overall &middot; ${totalCorrect}/${totalDecisions} calls correct across ${state.results.length} screen${state.results.length === 1 ? '' : 's'}</div>
    </div>
    <div class="card">
      <div class="section-title">Screen by screen</div>
      ${rows}
    </div>
    <button class="btn btn-primary btn-lg btn-block" onclick="App.playAgain()">Play again</button>
  `;
}

/* ---------------------------------------------------------------
   Actions
   --------------------------------------------------------------- */
const App = {
  dismissResume() { state._justResumed = false; saveState(); renderApp(); },

  confirmRestart() {
    if (window.confirm('Start over completely? This clears your current game.')) {
      state = defaultState();
      saveState();
      renderApp();
    }
  },

  setRoundCount(n) { state.roundCount = n; saveState(); renderApp(); },

  startGame() {
    state.order = shuffle(SCENARIOS.map((s) => s.id)).slice(0, state.roundCount);
    state.index = 0;
    state.results = [];
    state.screen = 'play';
    App._beginRound();
    saveState(); renderApp();
  },

  _beginRound() {
    const scenario = currentScenario();
    state.selections = {};
    state.submitted = false;
    state.displayOrder = shuffle(scenario.issues.map((_, i) => i));
  },

  toggleOption(i) {
    if (state.submitted) return;
    state.selections[i] = !state.selections[i];
    saveState(); renderApp();
  },

  submitRound() {
    const scenario = currentScenario();
    state.submitted = true;
    const stats = computeRoundStats(scenario, state.selections);
    state.results.push({ scenarioId: scenario.id, title: scenario.title, ...stats });
    saveState(); renderApp();
  },

  nextRound() {
    state.index += 1;
    if (state.index >= state.order.length) {
      state.screen = 'result';
    } else {
      App._beginRound();
    }
    saveState(); renderApp();
  },

  playAgain() {
    const roundCount = state.roundCount;
    state = defaultState();
    state.roundCount = roundCount;
    saveState(); renderApp();
  },
};

function tagLabel(id) { const t = TAGS.find((t) => t.id === id); return t ? t.label : id; }

renderApp();
