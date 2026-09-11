/* ============================================================
   To-X-or-UI — Scenario data
   Each scenario is a fake, self-contained product screen with a
   handful of UX/UI problems baked in on purpose. Players review
   the SAME screen, then write up what's wrong with it.
   ============================================================ */

// Generic critique categories players can tag their answer with.
// These are heuristics, not scenario-specific "correct answers".
const TAGS = [
  { id: 'hierarchy',   label: 'Visual Hierarchy' },
  { id: 'contrast',    label: 'Contrast & Readability' },
  { id: 'nav',         label: 'Navigation & Findability' },
  { id: 'consistency', label: 'Consistency' },
  { id: 'feedback',    label: 'Feedback & Error Handling' },
  { id: 'a11y',        label: 'Accessibility' },
  { id: 'copy',        label: 'Copy & Content Clarity' },
  { id: 'responsive',  label: 'Mobile / Responsive Layout' },
  { id: 'trust',       label: 'Trust & Credibility' },
  { id: 'cogload',     label: 'Cognitive Load' },
  { id: 'cta',         label: 'Call-to-Action Clarity' },
  { id: 'darkpattern', label: 'Dark Patterns' },
];

// Small helper so every mockup gets the same iframe boilerplate.
function frame(bodyHtml, extraStyle = '') {
  return `<!doctype html><html><head><meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #fff; color: #111; }
    ${extraStyle}
  </style></head><body>${bodyHtml}</body></html>`;
}

const SCENARIOS = [
  {
    id: 'checkout',
    title: 'Checkout — "QuickCart"',
    tagline: 'A one-page checkout for an online store.',
    height: 620,
    html: frame(`
      <div style="max-width:640px;margin:0 auto;padding:20px;">
        <div style="font-weight:700;font-size:20px;margin-bottom:16px;">QuickCart</div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#999;margin-bottom:18px;">
          <span>Cart</span><span>Shipping</span><span style="color:#111;font-weight:600;">Payment</span><span>Done</span>
        </div>
        <div style="border:1px solid #eee;border-radius:8px;padding:16px;margin-bottom:14px;">
          <div style="font-size:13px;color:#bbb;margin-bottom:6px;">Card number</div>
          <div style="border:1px solid #ddd;border-radius:6px;padding:10px;color:#ccc;font-size:14px;">4242 4242 4242 4242</div>
        </div>
        <div style="border:1px solid #eee;border-radius:8px;padding:16px;margin-bottom:14px;">
          <div style="font-size:13px;color:#bbb;margin-bottom:6px;">Promo</div>
          <div style="border:1px solid #ddd;border-radius:6px;padding:10px;color:#ccc;font-size:14px;">Enter code</div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 2px;">
          <span>Subtotal</span><span>$42.00</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#ddd;padding:2px 2px;">
          <span>Processing & handling fee</span><span>$6.50</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:16px;padding:8px 2px;border-top:1px solid #eee;margin-top:6px;">
          <span>Total</span><span>$48.50</span>
        </div>
        <div style="font-size:10px;color:#eee;margin:6px 2px 16px;">By continuing you agree to auto-renew your subscription monthly at $48.50 until cancelled.</div>
        <button style="width:100%;padding:14px;border:none;border-radius:8px;background:#e5e5e5;color:#bbb;font-size:15px;font-weight:600;">Place Order</button>
        <div style="text-align:center;margin-top:10px;">
          <span style="color:#0645AD;font-size:12px;">&larr; Back to shipping</span>
        </div>
      </div>
    `),
    notes: [
      { tag: 'trust',       text: 'A "processing & handling fee" appears out of nowhere at the final step, in near-invisible light gray — classic surprise-fees dark pattern.' },
      { tag: 'darkpattern', text: 'Auto-renewal / subscription terms are disclosed in 10px near-white text most people will never read.' },
      { tag: 'cta',         text: '"Place Order" is styled like a disabled button (gray on gray) even though it should be clickable — people will assume the form is incomplete and hesitate or give up.' },
      { tag: 'copy',        text: 'Field values ("4242 4242...", "Enter code") are styled as light gray text indistinguishable from placeholder vs. real input — unclear if anything was actually typed.' },
      { tag: 'nav',         text: '"Back to shipping" looks like a small, low-priority link — going back likely risks losing entered payment info with no warning.' },
    ],
  },

  {
    id: 'signup',
    title: 'Sign Up — "Nimbus"',
    tagline: 'Account creation form for a productivity app.',
    height: 640,
    html: frame(`
      <div style="max-width:420px;margin:0 auto;padding:28px 24px;">
        <div style="font-weight:700;font-size:20px;margin-bottom:22px;">Create your account</div>
        <div style="margin-bottom:16px;">
          <div style="border:1px solid #ddd;border-radius:6px;padding:12px;color:#aaa;font-size:14px;">Full name</div>
        </div>
        <div style="margin-bottom:16px;">
          <div style="border:1px solid #ddd;border-radius:6px;padding:12px;color:#aaa;font-size:14px;">Email address</div>
        </div>
        <div style="margin-bottom:6px;">
          <div style="border:1px solid #e33;border-radius:6px;padding:12px;color:#aaa;font-size:14px;">Password</div>
        </div>
        <div style="color:#e88;font-size:11px;margin-bottom:16px;">Error</div>
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:20px;">
          <div style="width:14px;height:14px;background:#333;border-radius:2px;flex-shrink:0;margin-top:2px;"></div>
          <div style="font-size:11px;color:#999;line-height:1.4;">I agree to receive marketing emails, product updates, partner offers, and the Terms of Service and Privacy Policy.</div>
        </div>
        <button style="width:100%;padding:13px;border:none;border-radius:6px;background:#eee;color:#aaa;font-size:14px;font-weight:600;">Sign Up</button>
        <div style="text-align:center;margin-top:16px;font-size:12px;color:#bbb;">Already have an account? <span style="color:#bbb;">Log in</span></div>
      </div>
    `),
    notes: [
      { tag: 'feedback',   text: 'The password field is flagged red with just the word "Error" — no explanation of what requirement failed or how to fix it.' },
      { tag: 'darkpattern',text: 'The consent checkbox bundles marketing emails, partner offers, and legally-required Terms/Privacy agreement into one pre-checked box.' },
      { tag: 'contrast',   text: 'Field labels double as placeholder text in very light gray, so users lose the label the moment they start typing.' },
      { tag: 'cta',        text: 'The "Sign Up" button and the "Log in" link are both styled in the same washed-out gray as disabled elements — nothing signals which action is primary.' },
      { tag: 'a11y',       text: 'Error state relies on color (red border) alone, with a one-word message too small/faint to be read by low-vision users.' },
    ],
  },

  {
    id: 'mobilenav',
    title: 'Mobile Nav — "Fitly"',
    tagline: 'Bottom navigation bar for a fitness app.',
    height: 560,
    html: frame(`
      <div style="max-width:375px;margin:0 auto;height:520px;position:relative;background:#fafafa;">
        <div style="padding:20px;">
          <div style="font-weight:700;font-size:18px;margin-bottom:14px;">Today</div>
          <div style="background:#fff;border-radius:10px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.06);margin-bottom:12px;">
            <div style="font-size:13px;color:#999;">Steps</div>
            <div style="font-size:22px;font-weight:700;">4,281</div>
          </div>
          <div style="background:#fff;border-radius:10px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.06);">
            <div style="font-size:13px;color:#999;">Calories</div>
            <div style="font-size:22px;font-weight:700;">612</div>
          </div>
        </div>
        <div style="position:absolute;bottom:0;left:0;right:0;height:58px;background:#fff;border-top:1px solid #eee;display:flex;align-items:center;justify-content:space-around;padding:0 8px;">
          <div style="width:22px;height:22px;background:#222;border-radius:4px;"></div>
          <div style="width:22px;height:22px;background:#ddd;border-radius:50%;margin-left:2px;"></div>
          <div style="width:22px;height:22px;background:#ddd;border-radius:4px;transform:rotate(45deg);margin-left:2px;"></div>
          <div style="width:22px;height:22px;background:#ddd;border-radius:4px;margin-left:2px;position:relative;">
            <div style="position:absolute;top:-3px;right:-3px;width:8px;height:8px;background:#f5c6c6;border-radius:50%;"></div>
          </div>
          <div style="width:22px;height:22px;background:#ddd;border-radius:4px;margin-left:2px;"></div>
        </div>
      </div>
    `, `body{overflow:hidden;}`),
    notes: [
      { tag: 'nav',        text: 'Five icon-only tabs with no text labels and no obvious meaning (a diamond? a rounded square?) — users must guess or tap-and-check.' },
      { tag: 'a11y',       text: 'Tap targets are ~22px with almost no spacing between them — well under the ~44px recommended minimum touch target.' },
      { tag: 'hierarchy',  text: 'The active tab (dark square) is barely distinguishable from inactive tabs (light gray) at a glance, especially in bright light.' },
      { tag: 'contrast',   text: 'The notification badge is a pale pink dot on white — very low contrast, easy to miss entirely.' },
      { tag: 'consistency',text: 'Icon shapes are inconsistent (circle, diamond, squares) suggesting different metaphors with no unifying visual language.' },
    ],
  },

  {
    id: 'dashboard',
    title: 'Dashboard — "MetricHub"',
    tagline: 'An analytics overview page for a SaaS product.',
    height: 640,
    html: frame(`
      <div style="padding:20px;">
        <div style="display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap;">
          <div style="flex:1;min-width:120px;background:#fef3f3;border:1px solid #f3c;padding:10px;border-radius:6px;">
            <div style="font-size:10px;color:#c33;">Revenue</div><div style="font-size:13px;font-weight:600;">$12,904</div>
          </div>
          <div style="flex:1;min-width:120px;background:#eefcf3;border:1px solid #3c9;padding:10px;border-radius:6px;">
            <div style="font-size:10px;color:#393;">Signups</div><div style="font-size:13px;font-weight:600;">842</div>
          </div>
          <div style="flex:1;min-width:120px;background:#eef3fe;border:1px solid #36c;padding:10px;border-radius:6px;">
            <div style="font-size:10px;color:#339;">Churn</div><div style="font-size:13px;font-weight:600;">4.2%</div>
          </div>
          <div style="flex:1;min-width:120px;background:#fefceb;border:1px solid #cc3;padding:10px;border-radius:6px;">
            <div style="font-size:10px;color:#996;">Tickets</div><div style="font-size:13px;font-weight:600;">37</div>
          </div>
        </div>
        <div style="display:flex;gap:14px;">
          <div style="flex:2;background:#fff;border:1px solid #eee;border-radius:8px;padding:14px;">
            <div style="font-size:12px;color:#999;margin-bottom:8px;">Weekly Active Users</div>
            <div style="display:flex;align-items:flex-end;gap:6px;height:100px;">
              <div style="flex:1;background:#f66;height:40%;"></div>
              <div style="flex:1;background:#6c6;height:70%;"></div>
              <div style="flex:1;background:#66f;height:55%;"></div>
              <div style="flex:1;background:#cc6;height:90%;"></div>
              <div style="flex:1;background:#c6c;height:30%;"></div>
              <div style="flex:1;background:#6cc;height:65%;"></div>
            </div>
          </div>
          <div style="flex:1;background:#fff;border:1px solid #eee;border-radius:8px;padding:14px;font-size:11px;color:#999;">
            Legend: see report page 4 for series definitions.
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:14px;font-size:12px;">
          <tr><td style="padding:6px;">acct_8827</td><td style="padding:6px;">active</td><td style="padding:6px;">$412</td><td style="padding:6px;">2024-01-02</td></tr>
          <tr><td style="padding:6px;">acct_1923</td><td style="padding:6px;">trial</td><td style="padding:6px;">$0</td><td style="padding:6px;">2024-01-04</td></tr>
          <tr><td style="padding:6px;">acct_5510</td><td style="padding:6px;">past_due</td><td style="padding:6px;">$88</td><td style="padding:6px;">2024-01-05</td></tr>
        </table>
      </div>
    `),
    notes: [
      { tag: 'hierarchy',  text: 'All four KPI tiles and the chart compete for attention equally — nothing tells the viewer which number matters most right now.' },
      { tag: 'copy',       text: 'The chart legend is outsourced to "see report page 4" instead of being shown next to the data it explains.' },
      { tag: 'consistency',text: 'Bar colors appear to be random/rainbow rather than tied to a consistent meaning across the dashboard.' },
      { tag: 'cogload',    text: 'A dense, unstyled table of raw account IDs and statuses is dropped in with no grouping, sorting affordance, or visual separation (no zebra striping).' },
      { tag: 'a11y',       text: 'Status meaning is conveyed only by background color tint (red/green/blue/yellow tiles) with no icon or text cue for colorblind users.' },
    ],
  },

  {
    id: 'pricing',
    title: 'Pricing — "Stacko"',
    tagline: 'Plan comparison page for a dev tool.',
    height: 620,
    html: frame(`
      <div style="padding:24px;">
        <div style="text-align:center;font-weight:700;font-size:20px;margin-bottom:20px;">Choose your plan</div>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
          <div style="width:170px;border:1px solid #eee;border-radius:10px;padding:16px;">
            <div style="font-weight:600;">Basic</div>
            <div style="font-size:22px;font-weight:700;margin:8px 0;">9</div>
            <div style="font-size:11px;color:#999;">5 projects</div>
            <button style="width:100%;margin-top:14px;padding:10px;border:1px solid #ccc;border-radius:6px;background:#fff;">Choose</button>
          </div>
          <div style="width:170px;border:1px solid #eee;border-radius:10px;padding:16px;position:relative;overflow:hidden;">
            <div style="position:absolute;top:10px;right:-26px;background:#ffd166;color:#fff;font-size:10px;padding:2px 30px;transform:rotate(45deg);">Most Popular</div>
            <div style="font-weight:600;">Pro</div>
            <div style="font-size:22px;font-weight:700;margin:8px 0;">29</div>
            <div style="font-size:11px;color:#999;">Unlimited projects</div>
            <button style="width:100%;margin-top:14px;padding:10px;border:1px solid #ccc;border-radius:6px;background:#fff;">Choose</button>
          </div>
          <div style="width:170px;border:1px solid #eee;border-radius:10px;padding:16px;">
            <div style="font-weight:600;">Team</div>
            <div style="font-size:22px;font-weight:700;margin:8px 0;">79</div>
            <div style="font-size:11px;color:#999;">Everything + SSO</div>
            <button style="width:100%;margin-top:14px;padding:10px;border:1px solid #ccc;border-radius:6px;background:#fff;">Choose</button>
          </div>
        </div>
        <div style="text-align:center;font-size:10px;color:#ccc;margin-top:18px;">Plans renew automatically each month at the listed rate until cancelled in account settings.</div>
      </div>
    `),
    notes: [
      { tag: 'cta',        text: 'All three "Choose" buttons are identical in style — nothing visually pushes people toward the recommended "Pro" plan despite the badge.' },
      { tag: 'copy',       text: 'Prices show only a bare number ("9", "29", "79") with no currency symbol or "/month" — ambiguous and easy to misread.' },
      { tag: 'hierarchy',  text: 'The "Most Popular" ribbon badge overlaps the card corner awkwardly and is easy to miss against the plan content.' },
      { tag: 'darkpattern',text: 'Auto-renewal terms are in barely-visible 10px near-white text at the very bottom, unlikely to be read before purchase.' },
      { tag: 'consistency',text: 'Feature lists are inconsistent in depth (one line vs. detailed) making plans hard to compare side by side.' },
    ],
  },

  {
    id: 'settings',
    title: 'Account Settings — "Orbit"',
    tagline: 'A settings page for a collaboration tool.',
    height: 640,
    html: frame(`
      <div style="max-width:520px;margin:0 auto;padding:24px;">
        <div style="font-weight:700;font-size:18px;margin-bottom:18px;">Account</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f2f2f2;">
          <div style="font-size:13px;">Email notifications</div>
          <div style="width:34px;height:18px;border-radius:10px;background:#ddd;position:relative;"><div style="width:14px;height:14px;background:#fff;border-radius:50%;position:absolute;top:2px;left:2px;box-shadow:0 1px 2px rgba(0,0,0,.2);"></div></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f2f2f2;">
          <div style="font-size:13px;">Two-factor authentication</div>
          <div style="width:34px;height:18px;border-radius:10px;background:#bbb;position:relative;"><div style="width:14px;height:14px;background:#fff;border-radius:50%;position:absolute;top:2px;right:2px;box-shadow:0 1px 2px rgba(0,0,0,.2);"></div></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f2f2f2;">
          <div style="font-size:13px;">Public profile</div>
          <div style="width:34px;height:18px;border-radius:10px;background:#ddd;position:relative;"><div style="width:14px;height:14px;background:#fff;border-radius:50%;position:absolute;top:2px;left:2px;box-shadow:0 1px 2px rgba(0,0,0,.2);"></div></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f2f2f2;">
          <div style="font-size:13px;">Beta features</div>
          <div style="width:34px;height:18px;border-radius:10px;background:#bbb;position:relative;"><div style="width:14px;height:14px;background:#fff;border-radius:50%;position:absolute;top:2px;right:2px;box-shadow:0 1px 2px rgba(0,0,0,.2);"></div></div>
        </div>
        <div style="margin-top:22px;display:flex;gap:10px;">
          <button style="padding:10px 16px;border:none;border-radius:6px;background:#333;color:#fff;font-size:13px;">Save changes</button>
          <button style="padding:10px 16px;border:none;border-radius:6px;background:#c0392b;color:#fff;font-size:13px;">Delete account</button>
        </div>
      </div>
    `),
    notes: [
      { tag: 'a11y',       text: 'Both toggles use gray-on-gray for on/off — the only difference is the knob position (left vs. right), invisible to colorblind users and hard to scan quickly.' },
      { tag: 'hierarchy',  text: '"Save changes" and "Delete account" sit side by side with nearly equal visual weight, one accidental misclick away from an irreversible action.' },
      { tag: 'feedback',   text: 'No confirmation step or "are you sure?" dialog implied before a destructive account deletion.' },
      { tag: 'cogload',    text: 'Unrelated settings (notifications, security, privacy, beta flags) are dumped into one flat list with no section grouping or headers.' },
      { tag: 'consistency',text: 'It is unclear from the mockup alone which toggle state (left/right, light/dark) actually means "on" — the pattern is not self-evident.' },
    ],
  },

  {
    id: 'search',
    title: 'Search Results — "Hopscotch Travel"',
    tagline: 'Flight search results with filters.',
    height: 640,
    html: frame(`
      <div style="padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <div style="font-weight:700;font-size:16px;">Flights: TLV &rarr; JFK</div>
          <div style="width:20px;height:20px;background:#eee;border-radius:4px;"></div>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:16px;">
          <div style="font-size:11px;color:#ccc;border:1px solid #eee;border-radius:14px;padding:5px 12px;">Sort: Best</div>
        </div>
        <div style="border:1px solid #eee;border-radius:8px;padding:14px;margin-bottom:10px;display:flex;justify-content:space-between;">
          <div>
            <div style="font-size:13px;font-weight:600;">El Al · Direct</div>
            <div style="font-size:11px;color:#999;">10:20 → 15:40</div>
          </div>
          <div style="font-size:15px;font-weight:700;">$612</div>
        </div>
        <div style="border:1px solid #eee;border-radius:8px;padding:14px;margin-bottom:10px;display:flex;justify-content:space-between;">
          <div>
            <div style="font-size:13px;font-weight:600;">United · 1 stop</div>
            <div style="font-size:11px;color:#999;">06:05 → 19:55</div>
          </div>
          <div style="font-size:15px;font-weight:700;">$401</div>
        </div>
        <div style="text-align:center;margin-top:20px;">
          <span style="font-size:11px;color:#ddd;">‹</span>
          <span style="font-size:11px;color:#ddd;margin:0 4px;">1</span>
          <span style="font-size:11px;color:#ddd;margin:0 4px;">2</span>
          <span style="font-size:11px;color:#ddd;margin:0 4px;">3</span>
          <span style="font-size:11px;color:#ddd;">›</span>
        </div>
      </div>
    `),
    notes: [
      { tag: 'nav',        text: 'Filters live behind an unlabeled gray square icon with no hint that filtering is even possible.' },
      { tag: 'feedback',   text: 'No indication anywhere of which filters or sort option are currently active beyond a faint "Sort: Best" chip.' },
      { tag: 'hierarchy',  text: 'Price is the only strongly emphasized element per result — duration, stops, and airline reputation get equal tiny gray text despite differing importance to the decision.' },
      { tag: 'a11y',       text: 'Pagination controls are tiny, low-contrast, and sit disconnected from the results with generous whitespace, making them easy to overlook or mis-tap.' },
      { tag: 'copy',       text: '"Sort: Best" doesn\'t explain what "Best" is optimizing for (price? duration? a mix?), and there\'s no visible way to change it in this view.' },
    ],
  },

  {
    id: 'onboarding',
    title: 'Onboarding — "Lumen Notes"',
    tagline: 'A first-run setup flow for a notes app.',
    height: 600,
    html: frame(`
      <div style="max-width:420px;margin:0 auto;padding:30px 24px;text-align:center;">
        <div style="display:flex;justify-content:center;gap:6px;margin-bottom:26px;">
          <div style="width:24px;height:4px;background:#333;border-radius:2px;"></div>
          <div style="width:24px;height:4px;background:#eee;border-radius:2px;"></div>
        </div>
        <div style="font-weight:700;font-size:19px;margin-bottom:10px;">Let's set up your workspace</div>
        <div style="font-size:13px;color:#999;line-height:1.6;margin-bottom:26px;text-align:left;">
          Lumen Notes organizes your thoughts using a flexible block-based system inspired by outliners, wikis, and traditional note-taking apps, so you can capture ideas quickly and connect them later using bi-directional links, tags, and a graph view that visualizes relationships between your notes over time as your knowledge base grows.
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:15px;color:#333;font-weight:600;">Skip &rarr;</span>
          <span style="font-size:12px;color:#ccc;border:1px solid #eee;border-radius:6px;padding:8px 14px;">Continue</span>
        </div>
      </div>
    `),
    notes: [
      { tag: 'copy',       text: 'A dense wall of jargon-heavy text ("block-based system", "bi-directional links", "graph view") front-loaded before the user has done anything in the app yet.' },
      { tag: 'cta',        text: '"Skip" is bold and dark while "Continue" (the intended primary path) is faint outlined gray — visually inverted priority nudges people to bail on setup.' },
      { tag: 'nav',        text: 'No visible way to go back to a previous step, and the progress dots don\'t indicate how many steps remain in total.' },
      { tag: 'cogload',    text: 'Explaining four different concepts (blocks, links, tags, graph view) on a single onboarding screen before any hands-on interaction.' },
      { tag: 'hierarchy',  text: 'The step indicator, heading, paragraph, and actions all sit with similar spacing/weight, giving no visual anchor for what to do next.' },
    ],
  },

  {
    id: 'product',
    title: 'Product Page — "Solstice Goods"',
    tagline: 'An e-commerce product detail page.',
    height: 660,
    html: frame(`
      <div style="max-width:600px;margin:0 auto;padding:18px;">
        <div style="background:#f5f5f5;height:180px;border-radius:8px;margin-bottom:10px;position:relative;">
          <div style="position:absolute;bottom:8px;left:8px;background:#ff3b30;color:#fff;font-size:10px;padding:4px 8px;border-radius:4px;">Only 2 left! 47 people viewing</div>
        </div>
        <div style="display:flex;gap:6px;margin-bottom:14px;">
          <div style="width:44px;height:44px;background:#eee;border-radius:4px;margin-left:-2px;"></div>
          <div style="width:44px;height:44px;background:#eee;border-radius:4px;margin-left:-2px;"></div>
          <div style="width:44px;height:44px;background:#eee;border-radius:4px;margin-left:-2px;"></div>
        </div>
        <div style="font-weight:700;font-size:17px;">Ceramic Pour-Over Set</div>
        <div style="font-size:15px;margin:6px 0;"><span style="text-decoration:line-through;color:#999;">$68</span> <span style="font-weight:700;">$52</span> <span style="color:#2a8;font-size:11px;">save 15%</span></div>
        <div style="font-size:12px;color:#999;margin-bottom:16px;">Reviews (128)</div>
        <div style="height:220px;"></div>
        <div style="position:sticky;bottom:0;background:#fff;padding-top:10px;">
          <button style="width:100%;padding:14px;border:none;border-radius:8px;background:#111;color:#fff;font-size:14px;font-weight:600;">Add to Cart</button>
        </div>
      </div>
    `),
    notes: [
      { tag: 'darkpattern',text: 'A red urgency banner stacks two manufactured-scarcity claims ("Only 2 left!" and "47 people viewing") that are unverifiable and commonly fabricated.' },
      { tag: 'copy',       text: 'The strikethrough math doesn\'t add up cleanly ($68 → $52 is ~24% off, but the badge says "save 15%") — an easy trust-breaking inconsistency.' },
      { tag: 'nav',        text: '"Reviews (128)" is styled as plain gray text, not visually distinct as a tappable link to jump to review content.' },
      { tag: 'responsive', text: 'The Add to Cart button is pushed far down after a large empty gap — on a real phone this would likely sit below the fold, requiring scrolling to purchase.' },
      { tag: 'hierarchy',  text: 'Thumbnail images overlap each other slightly with negative margin, making the gallery look broken rather than intentionally styled.' },
    ],
  },

  {
    id: 'error',
    title: '404 Page — "Brightpath"',
    tagline: 'What users see when a page can\'t be found.',
    height: 420,
    html: frame(`
      <div style="height:380px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
        <div style="font-size:13px;color:#bbb;font-family:monospace;">Error 404: resource not found at /api/v2/page?id=undefined</div>
      </div>
    `),
    notes: [
      { tag: 'trust',      text: 'No branding, logo, or any visual continuity with the rest of the product — it\'s unclear the user is even still on the same site.' },
      { tag: 'copy',       text: 'The message exposes raw technical/API details ("/api/v2/page?id=undefined") to end users instead of a plain-language explanation.' },
      { tag: 'nav',        text: 'There is no link back to the homepage, no search box, and no suggested next step — a dead end.' },
      { tag: 'feedback',   text: 'Nothing distinguishes "you mistyped a URL" from "something broke on our end" — same generic message either way.' },
      { tag: 'a11y',       text: 'Low-contrast light gray text on white for the only content on the page, with no heading structure at all.' },
    ],
  },
];
