/* ============================================================
   To-X-or-UI — Scenario data
   Each scenario is a fake, self-contained product screen with a
   handful of real UX/UI problems baked in on purpose, plus a set
   of decoy "issues" that sound plausible but are not actually true
   of this screen. The player checks off every option they believe
   is a real problem; each one is scored true/false.
   ============================================================ */

// Heuristic categories used to label the *real* issues in the reveal.
// Purely descriptive — not shown for decoy options.
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
    issues: [
      { correct: true, tag: 'trust',       text: 'A "processing & handling fee" appears out of nowhere at the final step, in near-invisible light gray.', explain: 'Real issue — classic surprise-fee dark pattern, and it\'s styled to be as unnoticeable as possible.' },
      { correct: true, tag: 'darkpattern', text: 'Auto-renewal / subscription terms are disclosed in 10px near-white text most people will never read.' , explain: 'Real issue — the terms that matter most are the hardest to see on the page.' },
      { correct: true, tag: 'cta',         text: '"Place Order" is styled like a disabled button even though it should be clickable.', explain: 'Real issue — gray-on-gray reads as "not ready yet," which makes people hesitate or abandon.' },
      { correct: true, tag: 'copy',        text: 'Field values are styled as light gray text, indistinguishable from placeholder vs. real input.', explain: 'Real issue — it\'s genuinely unclear whether anything was actually typed into these fields.' },
      { correct: true, tag: 'nav',         text: '"Back to shipping" looks like a low-priority link that risks losing entered payment info with no warning.', explain: 'Real issue — a destructive-ish navigation action given no visual weight or confirmation.' },
      { correct: false, text: 'There is no progress indicator showing what step of checkout you\'re on.', explain: 'Not true — Cart / Shipping / Payment / Done is right at the top.' },
      { correct: false, text: 'The page gives no way to see an order summary or subtotal before paying.', explain: 'Not true — Subtotal and Total are both shown clearly above the button.' },
      { correct: false, text: 'The total price is hidden until after the order is placed.', explain: 'Not true — the $48.50 total is displayed plainly before you click anything.' },
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
    issues: [
      { correct: true, tag: 'feedback',    text: 'The password field is flagged red with just the word "Error" — no explanation of what to fix.', explain: 'Real issue — a bare "Error" tells the user nothing actionable.' },
      { correct: true, tag: 'darkpattern', text: 'The consent checkbox bundles marketing emails and partner offers together with the required Terms/Privacy agreement.', explain: 'Real issue — pre-checked, bundled consent is a textbook dark pattern.' },
      { correct: true, tag: 'contrast',    text: 'Field labels double as placeholder text, so users lose the label the moment they start typing.', explain: 'Real issue — no persistent label means users can forget what a field was for mid-entry.' },
      { correct: true, tag: 'cta',         text: 'The "Sign Up" button and the "Log in" link are styled in the same washed-out gray as disabled elements.', explain: 'Real issue — nothing visually signals which action is primary.' },
      { correct: true, tag: 'a11y',        text: 'The error state relies on a red border and one faint word, with no icon or clearer text for low-vision users.', explain: 'Real issue — color-only, low-contrast error signaling fails accessibility basics.' },
      { correct: false, text: 'The form doesn\'t ask for an email address at all.', explain: 'Not true — there\'s a dedicated "Email address" field.' },
      { correct: false, text: 'There is no password field — only plain text inputs.', explain: 'Not true — a password field is present (it\'s just styled like the others).' },
      { correct: false, text: 'The "Log in" link for existing users is missing from the page.', explain: 'Not true — it\'s there at the bottom, just very low-contrast.' },
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
    issues: [
      { correct: true, tag: 'nav',         text: 'Five icon-only tabs with no text labels and no obvious meaning.', explain: 'Real issue — users must guess or tap-and-check what each icon does.' },
      { correct: true, tag: 'a11y',        text: 'Tap targets are roughly 22px with almost no spacing between them.', explain: 'Real issue — well under the ~44px recommended minimum touch target.' },
      { correct: true, tag: 'hierarchy',   text: 'The active tab is barely distinguishable from inactive tabs at a glance.', explain: 'Real issue — dark vs. light gray is a weak signal, especially in bright light.' },
      { correct: true, tag: 'contrast',    text: 'The notification badge is a pale pink dot on white.', explain: 'Real issue — very low contrast, easy to miss entirely.' },
      { correct: true, tag: 'consistency', text: 'Icon shapes are inconsistent (circle, diamond, squares) with no unifying visual language.', explain: 'Real issue — mixed metaphors make the nav harder to learn.' },
      { correct: false, text: 'The Steps and Calories cards use completely different fonts and styles from each other.', explain: 'Not true — both cards share the same consistent card style.' },
      { correct: false, text: 'There\'s no way to see today\'s stats at all on this screen.', explain: 'Not true — Steps and Calories are both shown right at the top.' },
      { correct: false, text: 'The bottom navigation bar overlaps and covers the content above it.', explain: 'Not true — it sits in its own fixed bar below the content, not overlapping it.' },
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
    issues: [
      { correct: true, tag: 'hierarchy',   text: 'All four KPI tiles and the chart compete for attention equally.', explain: 'Real issue — nothing tells the viewer which number matters most right now.' },
      { correct: true, tag: 'copy',        text: 'The chart legend is outsourced to "see report page 4" instead of being shown next to the data.', explain: 'Real issue — the explanation the chart needs isn\'t actually on the chart.' },
      { correct: true, tag: 'consistency', text: 'Bar colors appear to be random rather than tied to a consistent meaning.', explain: 'Real issue — rainbow bars with no legend give color no real function.' },
      { correct: true, tag: 'cogload',     text: 'A dense, unstyled table of raw account data is dropped in with no grouping or visual separation.', explain: 'Real issue — no zebra striping, sorting affordance, or headers to help scan it.' },
      { correct: true, tag: 'a11y',        text: 'Status meaning is conveyed only by background color tint, with no icon or text cue.', explain: 'Real issue — colorblind users lose the signal entirely.' },
      { correct: false, text: 'The dashboard uses light gray text throughout, making the key numbers hard to read.', explain: 'Not true — the KPI numbers themselves are bold and dark, clearly legible.' },
      { correct: false, text: 'The Revenue figure isn\'t visible without scrolling down the page.', explain: 'Not true — it\'s the very first tile, visible immediately.' },
      { correct: false, text: 'All four KPI tiles use the exact same color with no visual differentiation.', explain: 'Not true — each tile has a distinct red/green/blue/yellow tint.' },
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
    issues: [
      { correct: true, tag: 'cta',         text: 'All three "Choose" buttons are identical in style.', explain: 'Real issue — nothing visually pushes people toward the recommended plan despite the badge.' },
      { correct: true, tag: 'copy',        text: 'Prices show only a bare number with no currency symbol or "/month".', explain: 'Real issue — ambiguous and easy to misread.' },
      { correct: true, tag: 'hierarchy',   text: 'The "Most Popular" ribbon badge overlaps the card corner awkwardly.', explain: 'Real issue — easy to miss against the plan content it\'s meant to highlight.' },
      { correct: true, tag: 'darkpattern', text: 'Auto-renewal terms are in barely-visible near-white text at the very bottom.', explain: 'Real issue — unlikely to be read before purchase.' },
      { correct: true, tag: 'consistency', text: 'Feature lists are inconsistent in depth, making plans hard to compare.', explain: 'Real issue — one line per plan doesn\'t give enough to compare fairly.' },
      { correct: false, text: 'There\'s no visual indicator anywhere for which plan is recommended.', explain: 'Not true — there is a "Most Popular" badge (it\'s just poorly placed).' },
      { correct: false, text: 'The three plans are stacked in a single column, hard to compare side by side.', explain: 'Not true — they\'re laid out side by side in a row.' },
      { correct: false, text: 'None of the plans display a price.', explain: 'Not true — each card shows a number (9 / 29 / 79).' },
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
    issues: [
      { correct: true, tag: 'a11y',        text: 'Both toggle states use gray-on-gray — only the knob position differs.', explain: 'Real issue — invisible to colorblind users and hard to scan quickly.' },
      { correct: true, tag: 'hierarchy',   text: '"Save changes" and "Delete account" sit side by side with nearly equal visual weight.', explain: 'Real issue — one accidental misclick away from an irreversible action.' },
      { correct: true, tag: 'feedback',    text: 'There\'s no confirmation step implied before a destructive account deletion.', explain: 'Real issue — no "are you sure?" safety net for a permanent action.' },
      { correct: true, tag: 'cogload',     text: 'Unrelated settings are dumped into one flat list with no section grouping.', explain: 'Real issue — notifications, security, privacy, and beta flags all read as equally important.' },
      { correct: true, tag: 'consistency', text: 'It\'s unclear from the toggle styling alone which state actually means "on."', explain: 'Real issue — the on/off pattern isn\'t self-evident without more visual contrast.' },
      { correct: false, text: 'The page has no way to toggle any settings — only static text.', explain: 'Not true — there are working toggle switches for each setting.' },
      { correct: false, text: '"Delete account" is hidden off-screen and requires scrolling to find.', explain: 'Not true — it sits immediately visible next to "Save changes."' },
      { correct: false, text: 'There is no button to save your changes.', explain: 'Not true — a "Save changes" button is right there.' },
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
    issues: [
      { correct: true, tag: 'nav',         text: 'Filters live behind an unlabeled gray square icon with no hint filtering is possible.', explain: 'Real issue — nothing signals that this control does anything.' },
      { correct: true, tag: 'feedback',    text: 'There\'s no indication of which filters or sort option are currently active.', explain: 'Real issue — the faint "Sort: Best" chip is easy to overlook and unconfirmed.' },
      { correct: true, tag: 'hierarchy',   text: 'Price is the only strongly emphasized element per result; duration and stops are tiny gray text.', explain: 'Real issue — factors that matter to the decision are visually buried.' },
      { correct: true, tag: 'a11y',        text: 'Pagination controls are tiny, low-contrast, and disconnected from the results.', explain: 'Real issue — easy to overlook or mis-tap.' },
      { correct: true, tag: 'copy',        text: '"Sort: Best" doesn\'t explain what "Best" is optimizing for.', explain: 'Real issue — ambiguous criteria with no visible way to change it.' },
      { correct: false, text: 'The search results show zero flights — an empty results list.', explain: 'Not true — two flight options are listed.' },
      { correct: false, text: 'There is no price shown for either flight option.', explain: 'Not true — $612 and $401 are both displayed prominently.' },
      { correct: false, text: 'The page provides no way to sort or filter results at all.', explain: 'Not true — a sort chip and a filter icon both exist (they\'re just poorly surfaced, not absent).' },
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
    issues: [
      { correct: true, tag: 'copy',        text: 'A dense wall of jargon-heavy text is front-loaded before the user has done anything yet.', explain: 'Real issue — "block-based," "bi-directional links," and "graph view" all at once, day one.' },
      { correct: true, tag: 'cta',         text: '"Skip" is bold and dark while "Continue" is faint outlined gray.', explain: 'Real issue — visually inverted priority nudges people to bail on setup.' },
      { correct: true, tag: 'nav',         text: 'There\'s no visible way to go back to a previous step.', explain: 'Real issue — and the progress dots don\'t indicate how many steps remain in total.' },
      { correct: true, tag: 'cogload',     text: 'Four different concepts are explained on a single onboarding screen before any hands-on interaction.', explain: 'Real issue — too much to absorb before the user has touched anything.' },
      { correct: true, tag: 'hierarchy',   text: 'The heading, paragraph, and actions all sit with similar spacing and weight.', explain: 'Real issue — no visual anchor for what to do next.' },
      { correct: false, text: 'There is no way to continue or proceed from this screen.', explain: 'Not true — a Continue option exists (it\'s just visually weak).' },
      { correct: false, text: 'The screen is fully blank, with no text or instructions at all.', explain: 'Not true — there\'s a heading and a full paragraph of copy.' },
      { correct: false, text: 'There\'s no progress indicator showing onboarding steps at all.', explain: 'Not true — progress dots are shown (they just don\'t convey total step count well).' },
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
    issues: [
      { correct: true, tag: 'darkpattern', text: 'A red urgency banner stacks two unverifiable manufactured-scarcity claims.', explain: 'Real issue — "Only 2 left!" and "47 people viewing" together, both commonly fabricated.' },
      { correct: true, tag: 'copy',        text: 'The strikethrough math doesn\'t line up with the "save 15%" badge.', explain: 'Real issue — $68→$52 is closer to 24% off, not 15% — an easy trust-breaking inconsistency.' },
      { correct: true, tag: 'nav',         text: '"Reviews (128)" is styled as plain gray text, not visually distinct as a tappable link.', explain: 'Real issue — nothing marks it as clickable.' },
      { correct: true, tag: 'responsive',  text: 'The Add to Cart button sits after a large empty gap, likely pushed below the fold.', explain: 'Real issue — on a real phone this would require scrolling just to buy.' },
      { correct: true, tag: 'hierarchy',   text: 'Thumbnail images overlap each other slightly with negative margin.', explain: 'Real issue — reads as a layout bug rather than an intentional gallery style.' },
      { correct: false, text: 'The product has no price shown anywhere on the page.', explain: 'Not true — $68 and $52 are both clearly shown.' },
      { correct: false, text: 'There is no Add to Cart button on this page at all.', explain: 'Not true — the button exists, it\'s just positioned poorly.' },
      { correct: false, text: 'The image gallery has no thumbnails, only the main photo.', explain: 'Not true — three thumbnails are shown beneath the main image.' },
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
    issues: [
      { correct: true, tag: 'trust',    text: 'There\'s no branding, logo, or visual continuity with the rest of the product.', explain: 'Real issue — it\'s unclear the user is even still on the same site.' },
      { correct: true, tag: 'copy',     text: 'The message exposes raw technical/API details to end users.', explain: 'Real issue — "/api/v2/page?id=undefined" means nothing to a normal visitor.' },
      { correct: true, tag: 'nav',      text: 'There is no link back to the homepage, no search box, and no suggested next step.', explain: 'Real issue — a complete dead end.' },
      { correct: true, tag: 'feedback', text: 'Nothing distinguishes "you mistyped a URL" from "something broke on our end."', explain: 'Real issue — same generic message either way.' },
      { correct: true, tag: 'a11y',     text: 'Low-contrast light gray text is the only content on the page, with no heading structure.', explain: 'Real issue — hard to read and offers no semantic structure.' },
      { correct: false, text: 'The page displays a large, colorful illustration of a broken robot or similar mascot.', explain: 'Not true — there\'s no illustration at all, just a line of text.' },
      { correct: false, text: 'There\'s a search bar prominently placed to help users find what they need.', explain: 'Not true — no search bar exists on this page.' },
      { correct: false, text: 'The error message is written in large, bold, high-contrast black text.', explain: 'Not true — it\'s small, light gray, monospace text.' },
    ],
  },
];
