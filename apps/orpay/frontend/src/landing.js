// Public landing page for visitors without a wallet on this device.
// Structure: nav, hero with wallet preview, trust strip, features, escrow
// flow, transparency, developers, call to action.
import './landing.css'
import { API_BASE } from './orp.js'

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
  <div class="lp">
    <nav class="lp-nav">
      <a class="logo" href="#top" aria-label="ORPay"><span class="logo-or">OR</span><span class="logo-pay">Pay</span></a>
      <div class="lp-links">
        <a href="#product">Product</a><a href="#escrow">Escrow</a><a href="#developers">Developers</a><a href="/explorer.html">Explorer</a><a href="#" class="lp-menu-only" data-signin>${signInLabel}</a>
      </div>
      <div class="lp-nav-cta">
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
          <p class="lp-lead">Send naira, save with your ajo and buy safely with escrow. Every payment is visible on-chain.</p>
          <div class="lp-cta">
            <button class="lp-btn ink lg" data-start>Get started free</button>
            <a class="lp-btn ghost lg" href="#how">How escrow works</a>
          </div>
          <p class="lp-built"><img src="/favicon.png" alt="">Built on the <b>OpenReserve Protocol</b> · ₦20 flat fee</p>
        </div>

        <div class="lp-phone-wrap" aria-hidden="true">
          <span class="lp-halo"></span>
          <div class="lp-phone">
            <i class="side a"></i><i class="side b"></i><i class="side c"></i><i class="side d"></i>
            <div class="lp-screen">
              <div class="lp-status"><b>9:41</b><span class="island"></span><span class="lp-sig"><i></i><i></i><i></i><i></i><span class="batt"><span></span></span></span></div>
              <div class="lp-apphead"><span class="logo"><span class="logo-or">OR</span><span class="logo-pay">Pay</span></span><span class="me">RG</span></div>
              <div class="lp-bal">
                <small>Available balance</small>
                <strong>₦248,500</strong>
                <span>+₦45,000 today</span>
              </div>
              <div class="lp-actions">
                <span><i class="c1">${svg(I.up)}</i>Send</span>
                <span><i class="c2">${svg(I.down)}</i>Receive</span>
                <span><i class="c3">${svg(I.escrow)}</i>Escrow</span>
                <span><i class="c4">${svg(I.ajo)}</i>Ajo</span>
              </div>
              <div class="lp-recent-head"><b>Recent activity</b><span>See all</span></div>
              <div class="lp-tx"><i class="in">${svg(I.down)}</i><span><b>Ajo payout</b><small>Today · 9:42 AM</small></span><em class="pos">+₦45,000</em></div>
              <div class="lp-tx"><i class="out">${svg(I.escrow)}</i><span><b>Escrow · iPhone 14</b><small>Yesterday · 4:20 PM</small></span><em>−₦42,000</em></div>
              <div class="lp-tabs"><span class="on">Home</span><span>Pools</span><span>Escrow</span><span>Profile</span></div>
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
        <article class="lp-feat reveal"><i class="c1">${svg(I.up)}</i><h3>Send</h3><p>By @username or QR. ₦20 flat.</p></article>
        <article class="lp-feat reveal"><i class="c2">${svg(I.down)}</i><h3>Receive</h3><p>Money lands in real time.</p></article>
        <article class="lp-feat reveal"><i class="c4">${svg(I.ajo)}</i><h3>Ajo</h3><p>See who paid and who's next.</p></article>
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

    <section class="lp-how" id="how">
      <div class="lp-wrap lp-sec">
        <div class="lp-head">
          <p class="lp-kicker">Escrow in three steps</p>
          <h2>From deal to done.</h2>
        </div>
        <div class="lp-step-grid">
          <article><span>01 / AGREE</span><h3>Set the terms</h3><p>The seller shares a link with the price and milestones. The buyer reviews and accepts.</p></article>
          <article><span>02 / LOCK</span><h3>Money is held</h3><p>Funds lock on-chain. The seller ships knowing the money is real.</p></article>
          <article><span>03 / RELEASE</span><h3>Inspect, then pay</h3><p>The buyer checks the goods and releases. Problems go to a neutral arbiter.</p></article>
        </div>
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
    </footer>
  </div>`

  app.querySelectorAll('[data-start]').forEach((b) => (b.onclick = onStart))
  const menu = app.querySelector('#lp-menu'), links = app.querySelector('.lp-links')
  menu.onclick = () => menu.setAttribute('aria-expanded', String(links.classList.toggle('open')))
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => (links.classList.remove('open'), menu.setAttribute('aria-expanded', 'false'))))
  app.querySelectorAll('[data-signin]').forEach((b) => (b.onclick = (e) => (e.preventDefault(), onSignIn())))

  const io = 'IntersectionObserver' in window && new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: 0.15 })
  app.querySelectorAll('.reveal').forEach((el, i) => (io ? ((el.style.transitionDelay = `${(i % 4) * 70}ms`), io.observe(el)) : el.classList.add('in')))

  fetch(API_BASE + '/v1/status').then((r) => r.json()).then((st) => {
    const el = document.getElementById('lp-live')
    if (el && st.height > 0) el.textContent = `Live on OpenReserve · block ${st.height.toLocaleString()}`
  }).catch(() => {})
}
