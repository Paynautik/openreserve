// Public landing page for visitors without a wallet on this device.
// Structure: nav, hero with wallet preview, trust strip, features, escrow
// flow, transparency, developers, call to action.
import './landing.css'
import { API_BASE } from './orp.js'
import { circleTerm } from './region.js'

const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`
const I = {
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  escrow: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  ajo: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  eye: '<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
}

export function renderLanding(app, { onStart, onSignIn, signInLabel }) {
  document.title = 'ORPay: payments on OpenReserve'
  app.innerHTML = `
  <div class="lp${new URLSearchParams(location.search).get('look') === '2050' ? ' y2050' : ''}">
    <nav class="lp-nav">
      <a class="logo" href="#top" aria-label="ORPay"><span class="logo-or">OR</span><span class="logo-pay">Pay</span></a>
      <div class="lp-links">
        <a href="#product">Product</a><a href="#escrow">Escrow</a><a href="#developers">Developers</a><a href="/explorer.html">Explorer</a><a href="#" class="lp-menu-only" data-signin>${signInLabel}</a>
      </div>
      <div class="lp-nav-cta">
        <button class="lp-theme" id="lp-theme" type="button" aria-label="Switch to dark mode" aria-pressed="false">${svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>')}</button>
        <button class="lp-btn ghost" data-signin>${signInLabel}</button>
        <button class="lp-btn ink" data-start>Get started</button>
        <button class="lp-menu" id="lp-menu" aria-label="Open menu" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      </div>
    </nav>

    <section class="lp-hero" id="top">
            <div class="lp-wrap lp-hero-grid">
        <div class="lp-hero-copy">
          <span class="lp-pill"><span class="dot on"></span><span id="lp-live">Live on the OpenReserve network</span></span>
          <h1>Money moves.<br><span class="lp-grad">Trust stays.</span></h1>
          <p class="lp-lead">Send naira, save in ${circleTerm() ? `${/^[aeiou]/.test(circleTerm()) ? 'an' : 'a'} ${circleTerm()}` : 'a circle'} and buy safely with escrow. Every payment is visible on-chain.</p>
          <div class="lp-cta">
            <button class="lp-btn ink lg" data-start>Get started free</button>
            <a class="lp-btn ghost lg" href="/?demo">Try the demo</a>
          </div>
          <p class="lp-built"><img src="/favicon.png" alt="">Built on the <b>OpenReserve Protocol</b> · transfers from ₦10</p>
        </div>

        <div class="lp-phone-wrap">
          <span class="lp-halo"></span>
          <div class="lp-switch" role="tablist" aria-label="Try ORPay">
            <button role="tab" data-pane="wallet" aria-selected="false">Wallet</button>
            <button role="tab" data-pane="escrow" aria-selected="true">Escrow</button>
            <button role="tab" data-pane="circles" aria-selected="false">Circles</button>
          </div>
          <div class="lp-phone">
            <i class="side a"></i><i class="side b"></i><i class="side c"></i><i class="side d"></i>
            <div class="lp-screen">
              <div class="lp-status"><b>9:41</b><span class="island"></span><span class="lp-sig"><i></i><i></i><i></i><i></i><span class="batt"><span></span></span></span></div>
              <div class="lp-apphead"><span class="logo"><span class="logo-or">OR</span><span class="logo-pay">Pay</span></span><span class="me">RG</span></div>
              <div class="lp-pane" data-pane-body="wallet" hidden>
                <div class="lp-bal">
                  <small>Available balance</small>
                  <strong>₦248,500</strong>
                  <span>+₦45,000 today</span>
                </div>
                <div class="lp-actions">
                  <span><i class="c1">${svg(I.up)}</i>Send</span>
                  <span><i class="c2">${svg(I.down)}</i>Receive</span>
                  <span><i class="c3">${svg(I.escrow)}</i>Escrow</span>
                  <span><i class="c4">${svg(I.ajo)}</i>Circles</span>
                </div>
                <div class="lp-recent-head"><b>Recent activity</b><span>Sample</span></div>
                <div class="lp-tx"><i class="in">${svg(I.down)}</i><span><b>Circle payout</b><small>Today · 9:42 AM</small></span><em class="pos">+₦45,000</em></div>
                <div class="lp-tx"><i class="out">${svg(I.up)}</i><span><b>@adaeze</b><small>Yesterday · fee ₦25</small></span><em>−₦12,000</em></div>
              </div>
              <div class="lp-pane" data-pane-body="circles" hidden>
                <div class="lp-demo">
                  <div class="lp-demo-tag">Interactive demo · no real money</div>
                  <div class="lp-demo-item"><span class="lp-demo-thumb">${svg(I.ajo)}</span><span><b>Market women savings</b><small>₦20,000 each, every week</small></span></div>
                  <div class="lp-circ-top">
                    <svg class="lp-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" class="track"/><circle cx="32" cy="32" r="27" class="fill" id="lp-circ-ring" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/><text x="32" y="31" id="lp-circ-count">3/5</text><text x="32" y="43" class="sub">paid</text></svg>
                    <span><small>Round 3 pot · to @ngozi</small><strong id="lp-circ-pot">₦60,000</strong><small>Next payout Friday</small></span>
                  </div>
                  <ul class="lp-circ-members" id="lp-circ-members"></ul>
                  <button class="lp-demo-btn" id="lp-circ-btn" type="button">Pay my ₦20,000 share</button>
                </div>
              </div>
              <div class="lp-pane" data-pane-body="escrow">
              <div class="lp-demo" id="lp-demo">
                <div class="lp-demo-tag">Interactive demo · no real money</div>
                <div class="lp-demo-item"><span class="lp-demo-prod" aria-hidden="true"><svg viewBox="0 0 40 52"><defs><linearGradient id="lpPhoneScr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset=".6" stop-color="#8b5cf6"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><rect x="6" y="2" width="28" height="48" rx="6" fill="#0b1030"/><rect x="8" y="4" width="24" height="44" rx="4.5" fill="url(#lpPhoneScr)"/><rect x="16" y="6" width="8" height="2.4" rx="1.2" fill="#0b1030"/><circle cx="14" cy="14" r="3" fill="#0b1030" opacity=".55"/></svg></span><span><b>iPhone 14 Pro</b><small>Seller: @gadgethub · <span class="lp-held">in escrow</span></small></span></div>
                <div class="lp-demo-amt"><small id="lp-demo-label">Price</small><strong>₦420,000</strong></div>
                <ol class="lp-demo-steps" id="lp-demo-steps">
                  <li>Agreed</li><li>Funded</li><li>Shipped</li><li>Released</li>
                </ol>
                <p class="lp-demo-msg" id="lp-demo-msg" aria-live="polite"></p>
                <button class="lp-demo-btn" id="lp-demo-btn" type="button"></button>
              </div>
              </div>
              <div class="lp-tabs"><span data-tab-for="wallet">Home</span><span data-tab-for="circles">Circles</span><span class="on" data-tab-for="escrow">Escrow</span><span>Profile</span></div>
              <span class="home-ind"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="lp-strip">
      <div class="lp-wrap">
        <span>${svg('<path d="M4 7h16M4 12h16M4 17h10"/>')}OpenReserve</span>
        <span>${svg(I.escrow)}Secure</span>
        <span>${svg(I.eye)}Transparent</span>
        <span>${svg('<path d="m8 8-4 4 4 4M16 8l4 4-4 4"/>')}API</span>
      </div>
    </section>

    <section class="lp-wrap lp-sec" id="product">
      <div class="lp-head">
        <p class="lp-kicker">Less doubt. More doing.</p>
        <h2>Everything your money<br>needs to move safely.</h2>
      </div>
      <div class="lp-feats">
        <article class="lp-feat reveal"><i class="c1">${svg(I.up)}</i><h3>Send</h3><p>By @username or QR. From ₦10.</p></article>
        <article class="lp-feat reveal"><i class="c2">${svg(I.down)}</i><h3>Receive</h3><p>Money lands in real time.</p></article>
        <article class="lp-feat reveal"><i class="c4">${svg(I.ajo)}</i><h3>Saving circle</h3><p>See who paid and who's next.</p></article>
        <article class="lp-feat reveal"><i class="c3">${svg(I.eye)}</i><h3>Open</h3><p>Every payment on-chain.</p></article>
      </div>
      <article class="lp-escrow reveal" id="escrow">
        <div>
          <span class="lp-escrow-tag">${svg(I.escrow)} Escrow</span>
          <h3>Pay only when it arrives.</h3>
          <p>Money stays locked until the buyer inspects. Not even we can touch it.</p>
          <a href="#how">How it works →</a>
        </div>
        <ol class="lp-escrow-flow" aria-label="Escrow progress">
          <li class="done"><i>${svg(I.check)}</i>Funded</li>
          <li class="done"><i>${svg(I.check)}</i>Shipped</li>
          <li class="now"><i></i>Inspect</li>
          <li><i></i>Release</li>
        </ol>
        <div class="lp-feat-art" aria-hidden="true"><small>Held in escrow</small><b>₦420,000</b><span class="t-steps"><span class="on"></span><span class="on"></span><span class="now"></span><span></span></span><em>Shipped · awaiting inspection</em></div>
      </article>
    </section>

    <section class="lp-wrap lp-sec lp-life2" id="uses">
      <div class="lp-head">
        <p class="lp-kicker">Designed for real life</p>
        <h2>Built for how Africa<br>pays and saves.</h2>
        <p class="lp-sub-note"><span class="dot on"></span>Starting in Nigeria · more countries next</p>
      </div>
      <div class="lp-uses">
        <article class="reveal"><i class="c1">${svg('<path d="M3 7h18l-2 12H5z"/><path d="M8 7a4 4 0 0 1 8 0"/>')}</i><span><b>Online sellers</b><small>Buyers trust you before delivery.</small></span></article>
        <article class="reveal"><i class="c2">${svg('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>')}</i><span><b>Freelancers</b><small>Paid per milestone, funds locked first.</small></span></article>
        <article class="reveal"><i class="c4">${svg(I.ajo)}</i><span><b>Saving circles</b><small>Ajo, susu, chama, done in the open.</small></span></article>
        <article class="reveal"><i class="c3">${svg('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>')}</i><span><b>Rent & deposits</b><small>Held until the keys change hands.</small></span></article>
        <article class="reveal"><i class="c5">${svg('<path d="m8 8-4 4 4 4M16 8l4 4-4 4"/>')}</i><span><b>Businesses</b><small>Escrow and checkout via our API.</small></span></article>
      </div>
    </section>

    <section class="lp-wrap lp-sec lp-trust" id="trust">
      <div class="lp-head">
        <p class="lp-kicker">How trust works</p>
        <h2>Always know where<br>your money is.</h2>
      </div>
      <div class="lp-bento" aria-label="Live from the OpenReserve ledger">
        <article class="b-hero"><span class="b-tag"><i class="b-live"></i>LIVE · ON-CHAIN</span><small>Held safely in escrow right now</small><strong data-stat="held">—</strong><em>Not in anyone's account. Not even ours.</em></article>
        <article><span class="b-tag">AJO</span><strong data-stat="saving">—</strong><small>saving in circles</small></article>
        <article><span class="b-tag">DEALS</span><strong data-stat="completed">—</strong><small>escrows completed</small></article>
        <article><span class="b-tag">ARBITERS</span><strong data-stat="resolved">—</strong><small>disputes settled on the record</small></article>
        <article class="b-fee"><span class="b-tag">FEES</span><strong>₦10<sup>+</sup></strong><small>per transfer · escrow 1.5% on completion</small></article>
        <article class="b-block"><span class="b-tag">BLOCK</span><strong data-stat="height">—</strong><small><a href="/explorer.html">verify on the explorer →</a></small></article>
      </div>
      <div class="lp-trust-grid">
        <article class="reveal"><i>${svg('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>')}</i><span><b>Locked on-chain</b><small>Not in anyone's account. Not even ours.</small></span></article>
        <article class="reveal"><i>${svg('<path d="M12 3v18M5 7h14M7 7l-3 6a3 3 0 0 0 6 0zM17 7l-3 6a3 3 0 0 0 6 0z"/>')}</i><span><b>Neutral arbiters</b><small>They settle disputes, on the record.</small></span></article>
        <article class="reveal"><i>${svg('<path d="M4 7h16M4 12h16M4 17h10"/>')}</i><span><b>Bank-level fees</b><small>From ₦10 a transfer. Escrow 1.5%, only when it completes.</small></span></article>
        <article class="reveal"><i>${svg(I.eye)}</i><span><b>Open to check</b><small>Every payment is on the <a href="/explorer.html">explorer</a>.</small></span></article>
      </div>
    </section>

    <section class="lp-how" id="how">
      <div class="lp-wrap lp-sec">
        <div class="lp-head">
          <p class="lp-kicker">How escrow works</p>
          <h2>From deal to done.</h2>
        </div>
        <ol class="lp-howlist">
          <li><i>1</i><b>Agreement</b><small>Both sides accept the price and terms.</small></li>
          <li><i>2</i><b>Funding</b><small>The buyer's money locks on-chain.</small></li>
          <li><i>3</i><b>Delivery</b><small>The seller ships; the buyer inspects.</small></li>
          <li><i>4</i><b>Release</b><small>The seller is paid. Disputes go to an arbiter.</small></li>
        </ol>
      </div>
    </section>

    <section class="lp-dark" id="developers">
      <div class="lp-wrap lp-sec lp-split">
        <div>
          <p class="lp-eyebrow light">Built for businesses</p>
          <h2>Payments inside<br>your app.</h2>
          <ul class="lp-biz">
            <li>${svg(I.check)}Checkout and escrow APIs</li>
            <li>${svg(I.check)}Signed webhooks</li>
            <li>${svg(I.check)}Your logo beside ours</li>
          </ul>
          <button class="lp-btn white" data-start>Request API access</button>
        </div>
        <pre class="lp-code"><code><span class="k">import</span> { ORPay } <span class="k">from</span> <span class="s">'@openreservepolicy/orpay'</span>

<span class="k">const</span> orpay = <span class="k">new</span> ORPay({ apiKey: process.env.ORPAY_KEY })

<span class="k">const</span> escrow = <span class="k">await</span> orpay.createEscrow({
  seller: <span class="s">'@gadgethub'</span>, currency: <span class="s">'NGN'</span>,
  description: <span class="s">'iPhone 14'</span>,
  milestones: [{ label: <span class="s">'Item'</span>, amount: <span class="s">'420000'</span> }],
})
<span class="c">// the buyer funds escrow.url</span></code></pre>
      </div>
    </section>

    <section class="lp-wrap lp-cta-sec">
      <div class="lp-cta-panel">
        <div>
          <h2>Make your next payment a safe one.</h2>
          <p>Open a free wallet in under a minute.</p>
        </div>
        <button class="lp-btn ink lg" data-start>Create a free wallet</button>
      </div>
    </section>

    <footer class="lp-wrap lp-foot">
      <span class="logo" aria-label="ORPay"><span class="logo-or">OR</span><span class="logo-pay">Pay</span></span>
      <span class="lp-proto"><img src="/favicon.png" alt="">Built on the <b>OpenReserve Protocol</b></span>
      <a href="/explorer.html">Explorer →</a>
      <p class="lp-copy">© ${new Date().getFullYear()} Paynautik. ORPay is a Paynautik product.</p>
    </footer>
  </div>`

  app.querySelectorAll('[data-start]').forEach((b) => (b.onclick = onStart))
  escrowDemo(app)
  themeToggle(app)
  circlesDemo(app)
  phoneSwitcher(app)
  const menu = app.querySelector('#lp-menu'), links = app.querySelector('.lp-links')
  menu.onclick = () => menu.setAttribute('aria-expanded', String(links.classList.toggle('open')))
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => (links.classList.remove('open'), menu.setAttribute('aria-expanded', 'false'))))
  app.querySelectorAll('[data-signin]').forEach((b) => (b.onclick = (e) => (e.preventDefault(), onSignIn())))

  const io = 'IntersectionObserver' in window && new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: 0.15 })
  app.querySelectorAll('.reveal').forEach((el, i) => (io ? ((el.style.transitionDelay = `${(i % 4) * 70}ms`), io.observe(el)) : el.classList.add('in')))

  if (app.querySelector('.lp.y2050')) liveLedger(app)
  fetch(API_BASE + '/v1/status').then((r) => r.json()).then((st) => {
    const el = document.getElementById('lp-live')
    if (el && st.height > 0) el.textContent = `Live on OpenReserve · block ${st.height.toLocaleString()}`
  }).catch(() => {})
}

// Hero phone: click through a simulated escrow deal. Nothing is sent.
function escrowDemo(app) {
  const steps = [
    { label: 'Price', msg: 'You and @gadgethub agreed the price and terms.', btn: 'Pay into escrow' },
    { label: 'Held in escrow', msg: 'Your ₦420,000 is locked. The seller can see it but cannot touch it.', btn: 'Seller ships it →' },
    { label: 'Held in escrow', msg: 'Shipped with GIG Logistics. Inspect it when it arrives.', btn: 'Inspect and release' },
    { label: 'Paid to seller', msg: 'You approved the phone, so the seller got paid. Problem? You could have opened a dispute instead.', btn: 'Replay demo' },
  ]
  const lis = [...app.querySelectorAll('#lp-demo-steps li')]
  const btn = app.querySelector('#lp-demo-btn')
  if (!btn) return
  let at = 0
  const show = () => {
    lis.forEach((li, i) => li.classList.toggle('done', i <= at))
    lis.forEach((li, i) => li.classList.toggle('now', i === at + 1 && at < 3))
    app.querySelector('#lp-demo-label').textContent = steps[at].label
    app.querySelector('#lp-demo-msg').textContent = steps[at].msg
    btn.textContent = steps[at].btn
    app.querySelector('#lp-demo').classList.toggle('released', at === 3)
  }
  btn.onclick = () => {
    at = at === 3 ? 0 : at + 1
    show()
  }
  show()
}

// Wallet / Escrow / Circles tabs above the hero phone.
function phoneSwitcher(app) {
  const tabs = [...app.querySelectorAll('.lp-switch [data-pane]')]
  const pick = (name) => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.pane === name)))
    app.querySelectorAll('[data-pane-body]').forEach((p) => (p.hidden = p.dataset.paneBody !== name))
    app.querySelectorAll('[data-tab-for]').forEach((t) => t.classList.toggle('on', t.dataset.tabFor === name))
  }
  tabs.forEach((t) => (t.onclick = () => pick(t.dataset.pane)))
}

// Circles pane: pay your share and watch the round complete. Simulated.
function circlesDemo(app) {
  const ul = app.querySelector('#lp-circ-members')
  const btn = app.querySelector('#lp-circ-btn')
  if (!ul || !btn) return
  const base = [['@ngozi', true, 'Collects this round'], ['@tunde', true, ''], ['@amaka', true, ''], ['You', false, ''], ['@bisi', false, '']]
  let members, step
  const draw = () => {
    const paid = members.filter((m) => m[1]).length
    ul.innerHTML = members.map(([n, ok, note]) => `<li class="${ok ? 'ok' : ''}"><span>${n}${note ? ` <small>${note}</small>` : ''}</span><em>${ok ? 'Paid' : 'Due'}</em></li>`).join('')
    app.querySelector('#lp-circ-pot').textContent = `₦${(paid * 20000).toLocaleString('en-NG')}`
    app.querySelector('#lp-circ-ring').style.strokeDashoffset = String(100 - (paid / members.length) * 100)
    app.querySelector('#lp-circ-count').textContent = `${paid}/${members.length}`
  }
  const reset = () => {
    members = base.map((m) => [...m])
    step = 0
    btn.textContent = 'Pay my ₦20,000 share'
    draw()
  }
  btn.onclick = () => {
    step++
    if (step === 1) {
      members[3][1] = true
      members[3][2] = '🔥 3 in a row'
      btn.textContent = '@bisi pays →'
    } else if (step === 2) {
      members[4][1] = true
      members[0][2] = 'Collected ₦100,000'
      btn.textContent = 'Replay demo'
    } else return reset()
    draw()
  }
  reset()
}

// Light / dark landing page. Remembers the choice; defaults to the system.
function themeToggle(app) {
  const lp = app.querySelector('.lp')
  const btn = app.querySelector('#lp-theme')
  if (!lp || !btn) return
  const moon = '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'
  const sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
  const set = (dark) => {
    lp.classList.toggle('dark', dark)
    document.body.classList.toggle('lp-dark-body', dark)
    btn.innerHTML = svg(dark ? sun : moon)
    btn.setAttribute('aria-pressed', String(dark))
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode')
  }
  let saved = null
  try {
    saved = localStorage.getItem('orpay.lpTheme')
  } catch {}
  set(saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches)
  btn.onclick = () => {
    const dark = !lp.classList.contains('dark')
    set(dark)
    try {
      localStorage.setItem('orpay.lpTheme', dark ? 'dark' : 'light')
    } catch {}
  }
}

// 2050 look: live numbers from the chain, counting up when they arrive.
function liveLedger(app) {
  const naira = (micro) => '₦' + Math.round(Number(BigInt(micro ?? 0) / 10_000n) / 100).toLocaleString('en-NG')
  const count = (el, to, fmt) => {
    const t0 = performance.now()
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 900)
      el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3))))
      if (k < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  const put = (k, v, fmt = (x) => x.toLocaleString('en-NG')) => {
    const el = app.querySelector(`[data-stat="${k}"]`)
    if (el) count(el, v, fmt)
  }
  const tick = () => {
    fetch(API_BASE + '/v1/stats').then((r) => r.json()).then((st) => {
      const held = Number(BigInt(st.escrows?.held?.NGN ?? 0) / 10_000n) / 100
      const saving = Number(BigInt(st.circles?.saving_now?.NGN ?? 0) / 10_000n) / 100
      put('held', held, (x) => naira(BigInt(x) * 1_000_000n))
      put('saving', saving, (x) => naira(BigInt(x) * 1_000_000n))
      put('completed', st.escrows?.completed ?? 0)
      put('resolved', st.escrows?.resolved ?? 0)
    }).catch(() => {})
    fetch(API_BASE + '/v1/status').then((r) => r.json()).then((s) => {
      const el = app.querySelector('[data-stat="height"]')
      if (el) el.textContent = `#${s.height.toLocaleString('en-NG')}`
    }).catch(() => {})
  }
  tick()
  setInterval(tick, 8000)
}
