/* ============================================================
   To-X-or-UI — game engine
   Plain JS, single global `state` object + immediate-mode render.
   No build step, no dependencies, no server required.
   ============================================================ */

const STORAGE_KEY = 'toxorui_v1';
const PLAYER_COLORS = ['#d4622a', '#2f6f8f', '#7a4fb5', '#2f8f5b', '#b5504f', '#a67c1b', '#3b6ea5', '#8f5b2f'];
const PRESETS = [
  { id: 'quick',   label: 'Quick',     review: 30, write: 60 },
  { id: 'standard',label: 'Standard',  review: 60, write: 90 },
  { id: 'deep',    label: 'Deep Dive', review: 90, write: 150 },
];

function uid() { return 'p' + Math.random().toString(36).slice(2, 9); }

function defaultState() {
  return {
    screen: 'setup', // setup | review | submit | reveal | summary
    players: [
      { id: uid(), name: '', color: PLAYER_COLORS[0] },
      { id: uid(), name: '', color: PLAYER_COLORS[1] },
    ],
    reviewSeconds: 60,
    writeSeconds: 90,
    scenarioMode: 'random', // 'random' or a scenario id
    usedScenarioIds: [],
    round: null,
    history: [], // { scenarioId, title }
    draft: { tags: [], note: '', showMockup: false },
    showDesignerNotes: false,
    _justResumed: false,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.screen || !Array.isArray(parsed.players)) return null;
    return parsed;
  } catch (e) { return null; }
}

let saveTimeout = null;
function saveState(immediate) {
  const doSave = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore quota/private-mode errors */ }
  };
  if (immediate) { doSave(); return; }
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(doSave, 150);
}

let state = loadState() || defaultState();
if (state.screen && state.screen !== 'setup') state._justResumed = true;
// Never resume with a live countdown — always pause on (re)load so a
// stale tab / refresh can't silently burn through someone's time.
if (state.round) {
  state.round.reviewRunning = false;
  state.round.writeRunning = false;
}
if (!state.draft) state.draft = { tags: [], note: '', showMockup: false };

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function formatTime(sec) {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m + ':' + String(s).padStart(2, '0');
}

function scenarioById(id) { return SCENARIOS.find((s) => s.id === id); }
function tagLabel(id) { const t = TAGS.find((t) => t.id === id); return t ? t.label : id; }

function initials(name) {
  const n = (name || '').trim();
  return n ? n[0].toUpperCase() : '?';
}

function pickRandomScenario() {
  let pool = SCENARIOS.filter((s) => !state.usedScenarioIds.includes(s.id));
  if (pool.length === 0) { state.usedScenarioIds = []; pool = SCENARIOS.slice(); }
  return pool[Math.floor(Math.random() * pool.length)];
}

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
   Render
   --------------------------------------------------------------- */
function renderApp() {
  mountQueue = [];
  const root = document.getElementById('app');
  const resumeBanner = state._justResumed ? `
    <div class="resume-banner">
      <span>👋 Welcome back — picking up your game right where it left off. Timers are paused; hit play when you're ready.</span>
      <button class="btn btn-ghost btn-sm" onclick="App.dismissResume()">Got it</button>
    </div>` : '';

  const showRestart = state.screen !== 'setup' || (state.players.some(p => p.name.trim()) || state.history.length);

  const header = `
    <div class="brand row-between" style="width:100%;">
      <div style="display:flex;align-items:baseline;gap:10px;">
        <div class="logo">T<span class="x">o</span>-X-or-UI</div>
        <div class="sub">Spot the flaws. Then fight about it.</div>
      </div>
      ${showRestart ? `<button class="btn btn-ghost btn-sm" onclick="App.confirmRestart()">↺ Start over</button>` : ''}
    </div>`;

  let body = '';
  switch (state.screen) {
    case 'setup': body = renderSetup(); break;
    case 'review': body = renderReview(); break;
    case 'submit': body = renderSubmit(); break;
    case 'reveal': body = renderReveal(); break;
    case 'summary': body = renderSummary(); break;
    default: body = renderSetup();
  }

  root.innerHTML = `<div class="wrap">${header}${resumeBanner}${body}
    <footer class="credit">Local pass-and-play &middot; nothing leaves this browser</footer>
  </div>`;

  mountQueue.forEach((fn) => fn());
  mountQueue = [];
}

/* ---------------------------------------------------------------
   Setup screen (also reused to configure round 2, 3, ...)
   --------------------------------------------------------------- */
function renderSetup() {
  const roundNum = state.history.length + 1;
  const heading = state.history.length === 0
    ? `<h1 class="title">Set up the game</h1><p class="lede">2 or more players, one screen. Everyone reviews the same design, writes up what's wrong with it, then you debate it out loud.</p>`
    : `<h1 class="title">Round ${roundNum} setup</h1><p class="lede">Same crew, fresh design. Adjust anything below, or just hit start.</p>`;

  const playerRows = state.players.map((p, i) => `
    <div class="player-row">
      <div class="avatar" id="avatar-${p.id}" style="background:${p.color}">${initials(p.name)}</div>
      <input type="text" value="${esc(p.name)}" placeholder="Player ${i + 1} name"
        oninput="App.onPlayerNameInput('${p.id}', this.value)" maxlength="24" />
      ${state.players.length > 2 ? `<button class="remove-btn" title="Remove" onclick="App.removePlayer('${p.id}')">&times;</button>` : ''}
    </div>`).join('');

  const activePreset = PRESETS.find((p) => p.review === state.reviewSeconds && p.write === state.writeSeconds);

  const presetRow = PRESETS.map((p) => `
    <button class="preset ${activePreset && activePreset.id === p.id ? 'active' : ''}" onclick="App.applyPreset('${p.id}')">
      ${p.label} <span style="opacity:.7">(${p.review}s / ${p.write}s)</span>
    </button>`).join('');

  const scenarioTiles = [
    `<button class="scenario-pick ${state.scenarioMode === 'random' ? 'active' : ''}" onclick="App.setScenarioMode('random')">
      <div class="name">🎲 Surprise us</div><div class="tag">Random each round</div>
    </button>`,
    ...SCENARIOS.map((s) => `
      <button class="scenario-pick ${state.scenarioMode === s.id ? 'active' : ''}" onclick="App.setScenarioMode('${s.id}')">
        <div class="name">${esc(s.title)}</div><div class="tag">${esc(s.tagline)}</div>
      </button>`),
  ].join('');

  const validNames = state.players.filter((p) => true).length >= 2;

  return `
    ${heading}
    <div class="card">
      <div class="section-title">Players (${state.players.length})</div>
      ${playerRows}
      ${state.players.length < 8 ? `<button class="btn btn-ghost btn-sm" onclick="App.addPlayer()">+ Add player</button>` : `<div class="hint">Max 8 players.</div>`}
    </div>

    <div class="card">
      <div class="section-title">Timers</div>
      <div class="preset-row">${presetRow}</div>
      <div class="duo-fields" style="margin-top:12px;">
        <div class="field">
          <label>Review time (everyone looks, seconds)</label>
          <input type="number" min="10" max="600" value="${state.reviewSeconds}" oninput="App.onSecondsInput('reviewSeconds', this.value)" />
        </div>
        <div class="field">
          <label>Write time (per player, seconds)</label>
          <input type="number" min="15" max="600" value="${state.writeSeconds}" oninput="App.onSecondsInput('writeSeconds', this.value)" />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">Design to review</div>
      <div class="scenario-grid">${scenarioTiles}</div>
    </div>

    <button class="btn btn-primary btn-lg btn-block" ${validNames ? '' : 'disabled'} onclick="App.startRound()">
      Start Round ${roundNum} →
    </button>
    ${!validNames ? `<div class="hint center" style="margin-top:8px;">Need at least 2 players.</div>` : ''}

    <div class="card" style="margin-top:22px;">
      <div class="section-title">How to play</div>
      <div class="stack" style="font-size:13px;color:var(--text-dim);line-height:1.5;">
        <div>1. Everyone looks at the same screen together while a timer runs.</div>
        <div>2. Pass the device — each player privately tags issues and writes a short critique, hidden from the others.</div>
        <div>3. Once everyone's submitted (or time's up), all answers are revealed side by side. Debate it.</div>
        <div>4. Play another round with a new design, or wrap up.</div>
      </div>
    </div>
  `;
}

/* ---------------------------------------------------------------
   Review screen — shared, simultaneous look at the design
   --------------------------------------------------------------- */
function renderReview() {
  const scenario = scenarioById(state.round.scenarioId);
  const pct = Math.max(0, Math.min(100, (state.round.reviewTimeLeft / state.reviewSeconds) * 100));
  const low = state.round.reviewTimeLeft <= 10;

  return `
    <div class="top-actions">
      <span class="pill">Round ${state.history.length + 1} &middot; Review together</span>
    </div>
    <div class="card">
      <h2 class="title">Everyone look — together 👀</h2>
      <p class="lede">Put the device where everyone can see it, or pass it around. Study the screen. Don't lock in your opinion yet — you'll each write your own critique next, in private.</p>
      ${mockupBlock(scenario)}
      <div class="timer-bar-wrap" style="margin-top:20px;">
        <div class="timer-num ${low ? 'low' : ''}" id="timer-num">${formatTime(state.round.reviewTimeLeft)}</div>
        <div class="timer-track"><div class="timer-fill ${low ? 'low' : ''}" id="timer-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" onclick="App.toggleReviewTimer()">${state.round.reviewRunning ? '⏸ Pause' : '▶ Play'}</button>
        <button class="btn btn-primary" onclick="App.beginSubmitPhase()">Skip to writing →</button>
      </div>
    </div>
  `;
}

/* ---------------------------------------------------------------
   Submit screen — hot-seat, one player at a time, hidden from rest
   --------------------------------------------------------------- */
function renderSubmit() {
  const scenario = scenarioById(state.round.scenarioId);
  const players = state.players;
  const i = state.round.currentPlayerIndex;
  const current = players[i];

  const dots = players.map((p, idx) => {
    const cls = idx < i ? 'done' : idx === i ? 'current' : '';
    return `<div class="dot ${cls}" title="${esc(p.name || 'Player ' + (idx + 1))}"></div>`;
  }).join('');

  if (!state.round.hotseatConfirmed) {
    return `
      <div class="top-actions"><span class="pill">Round ${state.history.length + 1} &middot; Private write-up</span></div>
      <div class="progress-dots">${dots}</div>
      <div class="card hotseat">
        <div class="avatar-lg" style="background:${current.color}">${initials(current.name)}</div>
        <h2>Pass the device to ${esc(current.name || 'Player ' + (i + 1))}</h2>
        <p>Everyone else, look away 👀 — this critique is private until the reveal.</p>
        <button class="btn btn-primary btn-lg" onclick="App.confirmHotseat()">I'm ${esc(current.name || 'ready')} — start my turn →</button>
      </div>
    `;
  }

  const pct = Math.max(0, Math.min(100, (state.round.writeTimeLeft / state.writeSeconds) * 100));
  const low = state.round.writeTimeLeft <= 10;
  const chips = TAGS.map((t) => `
    <button class="tag-chip ${state.draft.tags.includes(t.id) ? 'selected' : ''}" onclick="App.toggleDraftTag('${t.id}')">${t.label}</button>
  `).join('');

  return `
    <div class="top-actions"><span class="pill">${esc(current.name || 'Player ' + (i + 1))}'s turn</span></div>
    <div class="progress-dots">${dots}</div>
    <div class="card">
      <div class="timer-bar-wrap">
        <div class="timer-num ${low ? 'low' : ''}" id="timer-num">${formatTime(state.round.writeTimeLeft)}</div>
        <div class="timer-track"><div class="timer-fill ${low ? 'low' : ''}" id="timer-fill" style="width:${pct}%"></div></div>
        <button class="btn-icon" title="${state.round.writeRunning ? 'Pause' : 'Play'}" onclick="App.toggleWriteTimer()">${state.round.writeRunning ? '⏸' : '▶'}</button>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="App.toggleDraftMockup()">${state.draft.showMockup ? '🙈 Hide design' : '👁 View design again'}</button>
      ${state.draft.showMockup ? mockupBlock(scenario, { height: 320 }) : ''}
      <div class="divider"></div>
      <div class="section-title">What's wrong with it? (tap all that apply)</div>
      <div class="tag-grid" style="margin-bottom:16px;">${chips}</div>
      <div class="field">
        <label>Your critique</label>
        <textarea placeholder="What would you change, and why?" oninput="App.onNoteInput(this.value)">${esc(state.draft.note)}</textarea>
      </div>
      <button class="btn btn-primary btn-lg btn-block" onclick="App.commitAnswerAndAdvance(false)">Submit critique →</button>
      <div class="hint center">If time runs out, whatever you've written is submitted automatically.</div>
    </div>
  `;
}

/* ---------------------------------------------------------------
   Reveal screen
   --------------------------------------------------------------- */
function renderReveal() {
  const scenario = scenarioById(state.round.scenarioId);
  const answers = state.round.answers;

  // tag -> count of players who flagged it, for lightweight context (not scoring)
  const tagCounts = {};
  Object.values(answers).forEach((a) => a.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));

  const answerCards = state.players.map((p) => {
    const a = answers[p.id] || { tags: [], note: '' };
    const tagsHtml = a.tags.length
      ? `<div class="tag-grid tags">${a.tags.map((t) => `<span class="tag-chip readonly selected">${esc(tagLabel(t))}<span class="count">×${tagCounts[t]}</span></span>`).join('')}</div>`
      : '';
    const noteHtml = a.note
      ? `<div class="note">${esc(a.note)}</div>`
      : `<div class="note empty">${a.tags.length ? 'No written notes — tags only.' : 'Nothing submitted.'}</div>`;
    return `
      <div class="answer-card">
        <div class="who"><span class="avatar" style="background:${p.color};width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;color:#fff;">${initials(p.name)}</span>${esc(p.name || 'Player')}</div>
        ${noteHtml}
        ${tagsHtml}
      </div>`;
  }).join('');

  const notesHtml = scenario.notes.map((n) => `
    <div class="designer-note"><b>${esc(tagLabel(n.tag))}:</b> ${esc(n.text)}</div>
  `).join('');

  return `
    <div class="top-actions"><span class="pill">Round ${state.history.length + 1} &middot; Reveal & debate</span></div>
    <div class="card">
      <h2 class="title">The reveal 🔍</h2>
      <p class="lede">Here's what everyone flagged. Talk it through — where do you agree, and where's the actual disagreement?</p>
      ${mockupBlock(scenario, { height: 320 })}
    </div>
    <div class="card">
      <div class="section-title">Everyone's critique</div>
      ${answerCards}
    </div>
    <div class="card">
      <button class="btn btn-ghost btn-block" onclick="App.toggleDesignerNotes()">
        ${state.showDesignerNotes ? '🙈 Hide' : '🕵️ Reveal'} the issues we hid on purpose
      </button>
      ${state.showDesignerNotes ? `
        <div style="margin-top:14px;">
          ${notesHtml}
          <div class="hint">These aren't the only "right" answers — use them as extra conversation starters if the debate stalls.</div>
        </div>` : ''}
    </div>
    <div class="btn-row">
      <button class="btn btn-primary btn-lg" onclick="App.startNextRound()">Start new round →</button>
      <button class="btn btn-danger-ghost btn-lg" onclick="App.endGame()">End game</button>
    </div>
  `;
}

/* ---------------------------------------------------------------
   Summary screen
   --------------------------------------------------------------- */
function renderSummary() {
  const rows = state.history.map((h, i) => `<div class="row-between" style="padding:8px 0;border-bottom:1px solid var(--border);">
      <span>Round ${i + 1}</span><span>${esc(h.title)}</span>
    </div>`).join('');

  return `
    <div class="card center">
      <h1 class="title">Nice work! 🎉</h1>
      <p class="lede">You reviewed ${state.history.length} design${state.history.length === 1 ? '' : 's'} with ${state.players.length} players.</p>
    </div>
    <div class="card">
      <div class="section-title">Rounds played</div>
      ${rows || '<div class="hint">No rounds recorded.</div>'}
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
    if (window.confirm('Start over completely? This clears players, timers and round history.')) {
      state = defaultState();
      saveState(true);
      renderApp();
    }
  },

  // -- setup --
  onPlayerNameInput(id, val) {
    const p = state.players.find((p) => p.id === id);
    if (!p) return;
    p.name = val.slice(0, 24);
    const av = document.getElementById('avatar-' + id);
    if (av) av.textContent = initials(p.name);
    saveState();
  },
  addPlayer() {
    if (state.players.length >= 8) return;
    state.players.push({ id: uid(), name: '', color: PLAYER_COLORS[state.players.length % PLAYER_COLORS.length] });
    saveState(); renderApp();
  },
  removePlayer(id) {
    if (state.players.length <= 2) return;
    state.players = state.players.filter((p) => p.id !== id);
    saveState(); renderApp();
  },
  applyPreset(id) {
    const p = PRESETS.find((p) => p.id === id);
    if (!p) return;
    state.reviewSeconds = p.review;
    state.writeSeconds = p.write;
    saveState(); renderApp();
  },
  onSecondsInput(field, val) {
    const n = parseInt(val, 10);
    state[field] = isNaN(n) ? state[field] : Math.max(5, Math.min(600, n));
    saveState();
  },
  setScenarioMode(mode) { state.scenarioMode = mode; saveState(); renderApp(); },

  startRound() {
    const named = state.players.filter((p) => true);
    if (named.length < 2) return;
    state.players.forEach((p, i) => { if (!p.name.trim()) p.name = 'Player ' + (i + 1); });

    let scenario;
    if (state.scenarioMode === 'random') {
      scenario = pickRandomScenario();
    } else {
      scenario = scenarioById(state.scenarioMode) || pickRandomScenario();
    }
    state.usedScenarioIds = Array.from(new Set([...state.usedScenarioIds, scenario.id]));

    state.round = {
      scenarioId: scenario.id,
      reviewTimeLeft: state.reviewSeconds,
      reviewRunning: true,
      writeTimeLeft: state.writeSeconds,
      writeRunning: false,
      currentPlayerIndex: 0,
      hotseatConfirmed: false,
      answers: {},
    };
    state.draft = { tags: [], note: '', showMockup: false };
    state.showDesignerNotes = false;
    state.screen = 'review';
    saveState(true); renderApp();
  },

  // -- review --
  toggleReviewTimer() {
    state.round.reviewRunning = !state.round.reviewRunning;
    saveState(); renderApp();
  },
  beginSubmitPhase() {
    state.round.reviewRunning = false;
    state.round.phase = 'submit';
    state.round.writeRunning = false;
    state.round.writeTimeLeft = state.writeSeconds;
    state.round.hotseatConfirmed = false;
    state.draft = { tags: [], note: '', showMockup: false };
    state.screen = 'submit';
    saveState(true); renderApp();
  },

  // -- submit / hotseat --
  confirmHotseat() {
    state.round.hotseatConfirmed = true;
    state.round.writeRunning = true;
    state.draft = { tags: [], note: '', showMockup: false };
    saveState(); renderApp();
  },
  toggleWriteTimer() {
    state.round.writeRunning = !state.round.writeRunning;
    saveState(); renderApp();
  },
  toggleDraftTag(tagId) {
    const i = state.draft.tags.indexOf(tagId);
    if (i === -1) state.draft.tags.push(tagId); else state.draft.tags.splice(i, 1);
    saveState(); renderApp();
  },
  toggleDraftMockup() {
    state.draft.showMockup = !state.draft.showMockup;
    saveState(); renderApp();
  },
  onNoteInput(val) {
    state.draft.note = val;
    saveState();
  },
  commitAnswerAndAdvance(auto) {
    const current = state.players[state.round.currentPlayerIndex];
    state.round.answers[current.id] = {
      tags: state.draft.tags.slice(),
      note: state.draft.note.trim(),
      auto: !!auto,
    };
    state.round.currentPlayerIndex += 1;
    state.round.writeRunning = false;
    state.round.writeTimeLeft = state.writeSeconds;
    state.round.hotseatConfirmed = false;
    state.draft = { tags: [], note: '', showMockup: false };

    if (state.round.currentPlayerIndex >= state.players.length) {
      state.screen = 'reveal';
    }
    saveState(true); renderApp();
  },

  // -- reveal --
  toggleDesignerNotes() { state.showDesignerNotes = !state.showDesignerNotes; saveState(); renderApp(); },
  startNextRound() {
    const scenario = scenarioById(state.round.scenarioId);
    state.history.push({ scenarioId: scenario.id, title: scenario.title });
    state.round = null;
    state.screen = 'setup';
    saveState(true); renderApp();
  },
  endGame() {
    const scenario = scenarioById(state.round.scenarioId);
    state.history.push({ scenarioId: scenario.id, title: scenario.title });
    state.round = null;
    state.screen = 'summary';
    saveState(true); renderApp();
  },

  // -- summary --
  playAgain() {
    const players = state.players;
    const reviewSeconds = state.reviewSeconds;
    const writeSeconds = state.writeSeconds;
    state = defaultState();
    state.players = players;
    state.reviewSeconds = reviewSeconds;
    state.writeSeconds = writeSeconds;
    saveState(true); renderApp();
  },
};

/* ---------------------------------------------------------------
   Timer engine — ticks once per second, updates the DOM directly
   for review/write countdowns so a live textarea never loses focus
   to a full re-render.
   --------------------------------------------------------------- */
function updateTimerDom(seconds, total) {
  const numEl = document.getElementById('timer-num');
  const fillEl = document.getElementById('timer-fill');
  const low = seconds <= 10;
  if (numEl) { numEl.textContent = formatTime(seconds); numEl.classList.toggle('low', low); }
  if (fillEl) {
    fillEl.style.width = Math.max(0, Math.min(100, (seconds / total) * 100)) + '%';
    fillEl.classList.toggle('low', low);
  }
}

setInterval(() => {
  if (!state.round) return;
  if (state.screen === 'review' && state.round.reviewRunning) {
    state.round.reviewTimeLeft = Math.max(0, state.round.reviewTimeLeft - 1);
    if (state.round.reviewTimeLeft <= 0) {
      App.beginSubmitPhase();
    } else {
      updateTimerDom(state.round.reviewTimeLeft, state.reviewSeconds);
      saveState();
    }
  } else if (state.screen === 'submit' && state.round.writeRunning) {
    state.round.writeTimeLeft = Math.max(0, state.round.writeTimeLeft - 1);
    if (state.round.writeTimeLeft <= 0) {
      App.commitAnswerAndAdvance(true);
    } else {
      updateTimerDom(state.round.writeTimeLeft, state.writeSeconds);
      saveState();
    }
  }
}, 1000);

renderApp();
