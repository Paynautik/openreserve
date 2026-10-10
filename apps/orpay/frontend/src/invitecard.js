// Renders a circle invite as a PNG (for WhatsApp/status) with the circle's
// name, amount, members, cadence and a QR code to join.
import { renderSVG } from 'uqr'

const W = 1080, H = 1350

function loadSVG(svg) {
  return new Promise((ok, fail) => {
    const img = new Image()
    img.onload = () => ok(img)
    img.onerror = fail
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  })
}

function round(g, x, y, w, h, r) {
  g.beginPath()
  g.roundRect(x, y, w, h, r)
}

export async function inviteCardBlob({ name, amount, members, slots, cadence, organiser, url }) {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  const font = (w, s) => `${w} ${s}px Inter, system-ui, -apple-system, "Segoe UI", sans-serif`

  // Background: deep indigo with soft glows.
  const bg = g.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#0b1030')
  bg.addColorStop(0.55, '#1e1b4b')
  bg.addColorStop(1, '#312e81')
  g.fillStyle = bg
  g.fillRect(0, 0, W, H)
  for (const [x, y, r, col] of [[W, 0, 620, 'rgba(34,211,238,.28)'], [0, H, 700, 'rgba(139,92,246,.35)']]) {
    const rg = g.createRadialGradient(x, y, 0, x, y, r)
    rg.addColorStop(0, col)
    rg.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = rg
    g.fillRect(0, 0, W, H)
  }

  // Brand.
  g.fillStyle = '#fff'
  g.font = font(800, 54)
  g.fillText('OR', 90, 140)
  const orW = g.measureText('OR').width
  g.fillStyle = '#a5b4fc'
  g.fillText('Pay', 90 + orW, 140)
  g.fillStyle = 'rgba(255,255,255,.12)'
  round(g, W - 390, 92, 300, 64, 32)
  g.fill()
  g.fillStyle = '#c7d2fe'
  g.font = font(600, 28)
  g.fillText('Saving circle invite', W - 366, 134)

  // Title + amount.
  g.fillStyle = '#c7d2fe'
  g.font = font(500, 36)
  g.fillText(`${organiser} invited you to join`, 90, 290)
  g.fillStyle = '#fff'
  g.font = font(800, 84)
  let title = name
  while (g.measureText(title).width > W - 180 && title.length > 4) title = title.slice(0, -2)
  if (title !== name) title = title.slice(0, -1) + '…'
  g.fillText(title, 90, 390)
  g.fillStyle = '#a5b4fc'
  g.font = font(500, 34)
  g.fillText('Each member pays', 90, 480)
  g.fillStyle = '#fff'
  g.font = font(800, 110)
  g.fillText(amount, 90, 590)

  // Stats row.
  const stats = [['Members', `${members} of ${slots}`], ['Rounds', cadence]]
  stats.forEach(([k, v], i) => {
    const x = 90 + i * 460
    g.fillStyle = 'rgba(255,255,255,.08)'
    round(g, x, 650, 430, 150, 28)
    g.fill()
    g.fillStyle = '#a5b4fc'
    g.font = font(500, 30)
    g.fillText(k, x + 34, 708)
    g.fillStyle = '#fff'
    g.font = font(700, 46)
    g.fillText(v, x + 34, 768)
  })

  // QR panel.
  g.fillStyle = '#fff'
  round(g, 90, 860, 340, 340, 32)
  g.fill()
  const qr = await loadSVG(renderSVG(url, { border: 1 }))
  g.drawImage(qr, 110, 880, 300, 300)
  g.fillStyle = '#fff'
  g.font = font(700, 44)
  g.fillText('Scan to join', 480, 950)
  g.fillStyle = '#c7d2fe'
  g.font = font(500, 32)
  ;['Everyone sees who paid', "and who's next. Every payment", 'is on the OpenReserve chain.'].forEach((t, i) => g.fillText(t, 480, 1010 + i * 46))

  g.fillStyle = '#67e8f9'
  g.font = font(600, 30)
  g.fillText(url.replace(/^https?:\/\//, '').slice(0, 52), 90, 1270)

  return new Promise((ok) => c.toBlob(ok, 'image/png'))
}

// Share the card as an image where supported, else download it.
export async function shareInviteCard(opts) {
  const blob = await inviteCardBlob(opts)
  const file = new File([blob], `${opts.name.replace(/[^\w-]+/g, '-').toLowerCase() || 'circle'}-invite.png`, { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: `Join ${opts.name} on ORPay`, text: `Join my saving circle on ORPay: ${opts.url}` }).catch(() => {})
    return 'shared'
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = file.name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  return 'downloaded'
}
