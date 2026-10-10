// Daily send limit, kept on this device. Lowering it is instant; raising or
// removing it needs the wallet password, so someone holding an unlocked
// phone cannot empty the wallet in one go.

const key = (addr) => `orpay.limit.${addr}`

export function getLimit(addr) {
  try {
    const v = JSON.parse(localStorage.getItem(key(addr)) ?? 'null')
    return v ? { asset: v.asset ?? '', amount: BigInt(v.amount) } : null
  } catch {
    return null
  }
}

export function setLimit(addr, limit) {
  try {
    if (limit) localStorage.setItem(key(addr), JSON.stringify({ asset: limit.asset, amount: String(limit.amount) }))
    else localStorage.removeItem(key(addr))
  } catch {}
}

// Total sent today (local time) in the given asset, from wallet history.
export function spentToday(history, addr, asset) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  let sum = 0n
  for (const e of history) {
    if (new Date(e.time) < start) continue
    const tx = e.tx
    if (tx.from !== addr || !tx.to || tx.pool || tx.escrow || tx.kind === 'mint' || tx.kind === 'burn') continue
    if ((tx.asset ?? '') !== asset) continue
    sum += BigInt(tx.amount ?? 0)
  }
  return sum
}

// Returns null when the send is allowed, or how much is left today.
export function overLimit(addr, history, asset, amount) {
  const lim = getLimit(addr)
  if (!lim || lim.asset !== asset) return null
  const left = lim.amount - spentToday(history, addr, asset)
  return BigInt(amount) > left ? (left > 0n ? left : 0n) : null
}
