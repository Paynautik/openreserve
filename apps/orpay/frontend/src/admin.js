// Admin dashboard: partner requests and arbiter applications to review,
// open disputes, and network volume on one screen. Admin wallets only; the
// backend refuses everyone else.
import { api, formatMoney } from './orp.js'
import { ask, icon, skeletonCard } from './ui.js'

let ctx

export function initAdmin(c) {
  ctx = c
}

const sum = (m) => {
  const parts = Object.entries(m ?? {}).filter(([, v]) => BigInt(v) > 0n).map(([a, v]) => formatMoney(v, a))
  return parts.length ? parts.join(' + ') : formatMoney(0, 'NGN')
}
const when = (t) => new Date(t).toLocaleDateString([], { day: 'numeric', month: 'short' })

export async function renderAdmin() {
  const root = ctx.root()
  root.innerHTML = skeletonCard()
  let d
  try {
    d = await api.adminOverview(ctx.state.seed)
  } catch (err) {
    root.innerHTML = `<section class="card"><h2>Admin</h2><p class="error">${ctx.esc(err.message)}</p></section>`
    return
  }
  const addrs = [...d.disputes.flatMap((x) => [x.buyer, x.seller, x.arbiter]), ...d.arbiters.pending.map((a) => a.address), ...d.apps.pending.map((a) => a.owner)]
  await ctx.resolveNames(addrs).catch(() => {})
  const who = (a) => (ctx.nameOf(a) ? `@${ctx.esc(ctx.nameOf(a))}` : `<span class="mono">${ctx.short(a)}</span>`)
  const es = d.chain?.escrows ?? {}
  const ci = d.chain?.circles ?? {}
  const tile = (label, value, note = '', alert = false) => `<div class="tile${alert ? ' alert' : ''}"><span>${label}</span><strong>${value}</strong>${note ? `<small>${note}</small>` : ''}</div>`
  const todo = d.apps.pending.length + d.arbiters.pending.length + d.disputes.length

  root.innerHTML = `
    <section class="card admin-head">
      <div class="section-head"><h2>Admin</h2><button class="link" id="adm-refresh">${icon('clock')} Refresh</button></div>
      <p class="muted small-text">${todo ? `${todo} item${todo === 1 ? '' : 's'} need${todo === 1 ? 's' : ''} you` : 'Nothing waiting for you'} · updated ${new Date(d.generated_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
      <div class="tiles admin-tiles">
        ${tile('Open disputes', String(d.disputes.length), d.disputes.length ? 'Need an arbiter' : 'None', d.disputes.length > 0)}
        ${tile('Partner requests', String(d.apps.pending.length), `${d.apps.counts.approved ?? 0} approved`, d.apps.pending.length > 0)}
        ${tile('Arbiter applications', String(d.arbiters.pending.length), '', d.arbiters.pending.length > 0)}
        ${tile('Webhook failures', String(d.webhook_failures_24h), 'last 24 hours', d.webhook_failures_24h > 0)}
        ${tile('Held in escrow', sum(es.held), `${es.open ?? 0} open · ${es.completed ?? 0} completed`)}
        ${tile('Saving in circles', sum(ci.saving_now), `${ci.active ?? 0} active · ${ci.members ?? 0} members`)}
        ${tile('Paid checkouts', sum(d.checkouts.paid_total), `${d.checkouts.paid} paid · ${sum(d.checkouts.paid_this_week)} this week`)}
        ${tile('Users', String(d.users), 'with a @username')}
      </div>
    </section>

    <section class="card">
      <h2>Open disputes</h2>
      ${d.disputes_error ? `<p class="error small-text">${ctx.esc(d.disputes_error)}</p>` : ''}
      <ul class="x-list admin-list">${d.disputes.length ? d.disputes.map((x) => `
        <li data-escrow="${x.id}" class="clickable">
          <span class="who"><strong>${formatMoney(x.balance, x.asset ?? '')} ${x.app ? `· ${ctx.esc(x.app)}` : ''}</strong>
          <small>${who(x.buyer)} vs ${who(x.seller)} · arbiter ${who(x.arbiter)} · opened ${when(x.created_at)}</small></span>
          <span class="chev">${icon('chevron')}</span>
        </li>`).join('') : '<li class="empty">No open disputes.</li>'}</ul>
    </section>

    <section class="card">
      <h2>Partner requests</h2>
      <ul class="x-list admin-list">${d.apps.pending.length ? d.apps.pending.map((a) => `
        <li>
          <span class="who"><strong>${ctx.esc(a.name)}</strong>
          <small><a href="${ctx.esc(a.website)}" target="_blank" rel="noopener">${ctx.esc(a.website.replace(/^https?:\/\//, ''))}</a> · ${ctx.esc(a.contact_email)} · by ${who(a.owner)} · ${when(a.created_at)}</small>
          ${a.description ? `<small class="desc">${ctx.esc(a.description)}</small>` : ''}</span>
          <span class="row-actions"><button class="ghost small" data-app-reject="${a.id}">Reject</button><button class="primary small" data-app-approve="${a.id}">Approve</button></span>
        </li>`).join('') : '<li class="empty">No partner requests waiting.</li>'}</ul>
    </section>

    <section class="card">
      <h2>Arbiter applications</h2>
      <ul class="x-list admin-list">${d.arbiters.pending.length ? d.arbiters.pending.map((a) => `
        <li>
          <span class="who"><strong>${who(a.address)} · fee ${(a.fee_bps / 100).toFixed(1)}%</strong>
          <small class="desc">${ctx.esc(a.bio || 'No bio')}</small></span>
          <span class="row-actions"><button class="ghost small" data-arb-reject="${a.address}">Reject</button><button class="primary small" data-arb-approve="${a.address}">Approve</button></span>
        </li>`).join('') : '<li class="empty">No applications waiting.</li>'}</ul>
    </section>
    ${d.checkouts.test ? `<p class="muted small-text center">${d.checkouts.test} sandbox checkout${d.checkouts.test === 1 ? '' : 's'} excluded from volume.</p>` : ''}`

  ctx.$('#adm-refresh').onclick = renderAdmin
  root.querySelectorAll('[data-escrow]').forEach((li) => (li.onclick = () => ctx.openEscrow(li.dataset.escrow)))
  const act = async (b, fn, done) => {
    b.disabled = true
    try {
      await fn()
      ctx.toast(done)
      renderAdmin()
    } catch (err) {
      ctx.toast(err.message, 'err')
      b.disabled = false
    }
  }
  root.querySelectorAll('[data-app-approve]').forEach((b) => (b.onclick = () => act(b, () => api.reviewApp(ctx.state.seed, b.dataset.appApprove, 'approve'), 'Partner approved')))
  root.querySelectorAll('[data-app-reject]').forEach((b) => (b.onclick = async () => {
    const note = await ask('Shown to the company.', { title: 'Reason to reject', ok: 'Reject', danger: true, input: 'e.g. Website does not match the company' })
    if (note !== null) act(b, () => api.reviewApp(ctx.state.seed, b.dataset.appReject, 'reject', note), 'Request rejected')
  }))
  root.querySelectorAll('[data-arb-approve]').forEach((b) => (b.onclick = () => act(b, () => api.reviewArbiter(ctx.state.seed, b.dataset.arbApprove, 'approve'), 'Arbiter approved')))
  root.querySelectorAll('[data-arb-reject]').forEach((b) => (b.onclick = async () => {
    if (await ask('They can apply again later.', { title: 'Reject this arbiter?', ok: 'Reject', danger: true })) act(b, () => api.reviewArbiter(ctx.state.seed, b.dataset.arbReject, 'reject'), 'Application rejected')
  }))
}
