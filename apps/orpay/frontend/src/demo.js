// Demo mode (?demo): the real wallet UI on sample data. Every request the app
// makes is answered here on the device; nothing reaches a server and nothing
// can be sent. Used on the public site while the network is not hosted.

const now = Date.now()
const H = 3600_000
const N = (naira) => String(BigInt(Math.round(naira * 100)) * 10_000n) // naira -> micro
const hex = (c) => c.repeat(64)
const PEOPLE = { [hex('a')]: 'adaeze', [hex('b')]: 'tunde', [hex('c')]: 'gadgethub', [hex('d')]: 'ngozi', [hex('e')]: 'amaka', [hex('f')]: 'bisi' }
const POOL = hex('1')
const ESCROW = hex('2')
const MSG = 'Demo mode: nothing is sent. Create a free wallet to do this for real.'

let me = ''

function status() {
  return {
    chain_id: 'openreserve-demo', height: 18432, tip_time: now, min_fee: 1000, supply: 0, burned: 0, accounts: 1280, mempool_size: 0,
    assets: [{ symbol: 'NGN', name: 'Nigerian naira', issuer: hex('9'), min_fee: 20000000, decimals: 2, supply: 0 }],
  }
}

function pool() {
  const members = [hex('d'), hex('b'), hex('e'), me, hex('f')]
  return {
    id: POOL, name: 'Market women savings', asset: 'NGN', creator: hex('d'), members, contribution: N(20000),
    joined: members.map(() => true), status: 'active', round: 2, paid: [true, true, true, false, false], claimed: [true, true, false, false, false],
    balance: N(60000), round_secs: 7 * 24 * 3600, started_at: now - 15 * 24 * H, deposit: '0',
  }
}

function poolHistory() {
  const p = pool()
  const tx = (from, op, t, extra = {}) => ({ id: Math.random().toString(16).slice(2).padEnd(64, '0'), height: 18000 + Math.round(t / H), time: now - t, tx: { from, pool: { op, id: POOL, ...extra }, amount: op === 'contribute' ? p.contribution : 0, asset: 'NGN' } })
  const out = [tx(hex('d'), 'create', 16 * 24 * H)]
  for (const m of p.members.slice(1)) out.push(tx(m, 'join', 15.5 * 24 * H))
  for (let r = 0; r < 3; r++) {
    const base = (14 - r * 7) * 24 * H
    for (const m of p.members) if (r < 2 || [hex('d'), hex('b'), hex('e')].includes(m)) out.push(tx(m, 'contribute', base - 3 * H))
    if (r < 2) out.push(tx(p.members[r], 'claim', base - 6 * H))
  }
  return out.sort((a, b) => a.time - b.time)
}

function escrow() {
  return {
    id: ESCROW, ref: 'Order 1042', asset: 'NGN', buyer: me, seller: hex('c'), arbiter: hex('a'), milestones: [N(420000)], released: 0,
    balance: N(420000), status: 'dispatched', created_at: now - 2 * 24 * H, ship_by: now + 2 * 24 * H, review_secs: 3 * 24 * 3600,
    dispatched_at: now - 20 * H, tracking: 'GIG Logistics · GL48210', paid_seller: '0', paid_buyer: '0', arbiter_bps: 200,
  }
}

function history() {
  const t = (id, hoursAgo, tx) => ({ id: id.padEnd(64, '0'), height: 18432 - hoursAgo, time: now - hoursAgo * H, tx: { asset: 'NGN', fee: 20000000, ...tx } })
  return [
    t('d1', 1, { from: hex('a'), to: me, amount: N(45000), memo: 'Thanks for the fabric' }),
    t('d2', 5, { from: me, to: hex('b'), amount: N(12000), memo: 'Lunch' }),
    t('d3', 20, { from: hex('c'), escrow: { op: 'dispatch', id: ESCROW }, amount: 0 }),
    t('d4', 48, { from: me, escrow: { op: 'create', ref: 'Order 1042' }, amount: N(420000) }),
    t('d5', 50, { from: me, pool: { op: 'contribute', id: POOL }, amount: N(20000) }),
    t('d6', 70, { from: hex('f'), to: me, amount: N(8500), memo: 'Data bundle' }),
  ].map((e) => (e.id === 'd4'.padEnd(64, '0') ? { ...e, id: ESCROW } : e))
}

function answer(method, path) {
  const p = path.split('?')[0]
  if (method !== 'GET' && method !== 'HEAD') return [400, { error: MSG }]
  if (p === '/v1/status') return [200, status()]
  if (p === '/api/config') return [200, { faucet: false }]
  if (p === '/pay/config') return [200, { asset: 'NGN', providers: ['paystack'], default_provider: 'paystack', test_mode: true, withdraw_fee: 50000000 }]
  let m
  if ((m = /^\/v1\/accounts\/([0-9a-f]{64})$/.exec(p))) return [200, { address: m[1], balance: 75_000_000, assets: { NGN: N(248500) }, nonce: 7, next_nonce: 7 }]
  if ((m = /^\/v1\/accounts\/([0-9a-f]{64})\/txs$/.exec(p))) return [200, history()]
  if (/^\/v1\/accounts\/[0-9a-f]{64}\/pools$/.test(p)) return [200, [pool()]]
  if (/^\/v1\/accounts\/[0-9a-f]{64}\/escrows$/.test(p)) return [200, [escrow()]]
  if (/^\/v1\/accounts\/[0-9a-f]{64}\/recovery$/.test(p)) return [200, {}]
  if (p === `/v1/pools/${POOL}`) return [200, { pool: pool(), pot: N(100000), history: poolHistory() }]
  if (p === `/v1/escrows/${ESCROW}`) return [200, { escrow: escrow(), history: history().filter((e) => e.tx.escrow).reverse() }]
  if ((m = /^\/api\/addresses\/([0-9a-f]{64})$/.exec(p))) return m[1] === me ? [200, { username: 'you' }] : PEOPLE[m[1]] ? [200, { username: PEOPLE[m[1]] }] : [404, { error: 'not found' }]
  if ((m = /^\/api\/users\/([^/]+)$/.exec(p))) {
    const a = Object.keys(PEOPLE).find((k) => PEOPLE[k] === decodeURIComponent(m[1]).replace(/^@/, ''))
    return a ? [200, { username: PEOPLE[a], address: a }] : [404, { error: 'No such user' }]
  }
  if (p === '/api/apps') return [200, { apps: [], is_admin: false }]
  if (p === '/api/arbiters') return [200, []]
  if (p === '/api/escrow-links' || p === '/api/ajo-invites' || p === '/api/referrals') return [200, []]
  if (/^\/api\/escrows\/[0-9a-f]{64}\/messages$/.test(p)) return [200, [{ from: hex('c'), text: 'Shipped this morning. Waybill GL48210 📦', time: new Date(now - 20 * H).toISOString(), photos: [] }]]
  return [404, { error: 'Not available in the demo' }]
}

export const isDemo = () => {
  try {
    return new URLSearchParams(location.search).has('demo') || sessionStorage.getItem('orpay.demo') === '1'
  } catch {
    return false
  }
}

export function installDemo(address) {
  me = address
  try {
    sessionStorage.setItem('orpay.demo', '1')
  } catch {}
  const real = window.fetch.bind(window)
  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href)
    const isApi = /^\/(v1|api|pay)\//.test(url.pathname)
    if (!isApi) return real(input, init)
    const [code, body] = answer((init.method || 'GET').toUpperCase(), url.pathname + url.search)
    await new Promise((r) => setTimeout(r, 120))
    return new Response(JSON.stringify(body), { status: code, headers: { 'Content-Type': 'application/json' } })
  }
  // Server-sent/web sockets are not used; push and notifications stay off.
}

export function exitDemo() {
  try {
    sessionStorage.removeItem('orpay.demo')
  } catch {}
  location.href = '/?home'
}
