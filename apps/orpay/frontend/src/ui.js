// Shared UI pieces: one icon set, money formatting for display, a number
// pad, slide-to-confirm, the success screen with a shareable receipt, and
// loading skeletons.

// Line icons (24px grid, 2px stroke, round caps), drawn in currentColor.
const P = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  pools: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  escrow: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  out: '<path d="M7 17 17 7M9 7h8v8"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>',
  words: '<path d="M4 6h16M4 12h10M4 18h7"/>',
  finger: '<path d="M12 11v3M8.5 9a4 4 0 0 1 7 2.5V14a8 8 0 0 1-1 4M7 12v2a5 5 0 0 0 .5 2.2M12 4a8 8 0 0 1 8 8v2M4 14v-2a8 8 0 0 1 3-6.2"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8S10 3 7.5 4.5 9 8 12 8zM12 8s2-5 4.5-3.5S15 8 12 8z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  logout: '<path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 17l5-5-5-5M15 12H4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  at: '<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  share: '<path d="M12 3v13M7 8l5-5 5 5M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  del: '<path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zM16 10l-4 4M12 10l4 4"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
}
export const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name] ?? ''}</svg>`

// "₦248,500.00" → whole part big, kobo small.
export function moneyHTML(formatted) {
  const m = /^(.*?)([.,]\d{2})(\D*)$/.exec(formatted)
  return m ? `<span class="money">${m[1]}<small>${m[2]}</small>${m[3]}</span>` : `<span class="money">${formatted}</span>`
}

export const haptic = (ms = 12) => {
  try {
    navigator.vibrate?.(ms)
  } catch {}
}

// Big number pad bound to a text input (works alongside the keyboard).
export function numpad(input, onChange) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del']
  const pad = document.createElement('div')
  pad.className = 'numpad'
  pad.innerHTML = keys.map((k) => `<button type="button" data-k="${k}" aria-label="${k === 'del' ? 'Delete' : k}">${k === 'del' ? icon('del') : k}</button>`).join('')
  pad.onclick = (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k
    if (!k) return
    haptic(6)
    let v = input.value.replace(/,/g, '')
    if (k === 'del') v = v.slice(0, -1)
    else if (k === '.' && v.includes('.')) return
    else if (/\.\d{2}$/.test(v)) return
    else v = (v === '0' && k !== '.' ? '' : v) + k
    const [w, d] = v.split('.')
    input.value = (w ? Number(w).toLocaleString('en-NG') : v.startsWith('.') ? '0' : '') + (d !== undefined ? '.' + d : '')
    onChange?.()
  }
  return pad
}

// Slide-to-confirm: drag the knob to the end (or press Enter/Space on it).
export function slider(label, onConfirm) {
  const el = document.createElement('div')
  el.className = 'slide'
  el.innerHTML = `<span class="slide-label">${label}</span><button type="button" class="slide-knob" aria-label="${label}">${icon('chevron')}</button>`
  const knob = el.querySelector('.slide-knob')
  let start = 0, x = 0, dragging = false, done = false
  const max = () => el.clientWidth - knob.offsetWidth - 8
  const set = (v) => {
    x = Math.max(0, Math.min(max(), v))
    knob.style.transform = `translateX(${x}px)`
    el.style.setProperty('--p', String(x / max()))
  }
  const finish = () => {
    dragging = false
    if (x >= max() * 0.9 && !done) {
      done = true
      set(max())
      haptic(20)
      el.classList.add('done')
      onConfirm(() => {
        done = false
        el.classList.remove('done')
        set(0)
      })
    } else set(0)
  }
  knob.onpointerdown = (e) => {
    if (done) return
    dragging = true
    start = e.clientX - x
    knob.setPointerCapture(e.pointerId)
  }
  knob.onpointermove = (e) => dragging && set(e.clientX - start)
  knob.onpointerup = finish
  knob.onpointercancel = finish
  knob.onkeydown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !done) {
      e.preventDefault()
      set(max())
      finish()
    }
  }
  return el
}

// Full-screen success moment with a receipt card that can be shared.
export function success({ title, amount, lines = [], shareText }) {
  haptic([14, 60, 24])
  const el = document.createElement('div')
  el.className = 'success'
  el.innerHTML = `
    <div class="success-card" role="dialog" aria-live="polite">
      <div class="success-tick"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="m15 27 7 7 15-15"/></svg></div>
      <p class="success-title">${title}</p>
      <p class="success-amount">${amount}</p>
      <dl class="receipt">${lines.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
      <div class="row">
        ${navigator.share && shareText ? `<button class="ghost" data-share>${icon('share')} Share receipt</button>` : ''}
        <button class="primary" data-done>Done</button>
      </div>
    </div>`
  document.body.append(el)
  requestAnimationFrame(() => el.classList.add('in'))
  const close = () => {
    el.classList.remove('in')
    setTimeout(() => el.remove(), 250)
  }
  el.querySelector('[data-done]').onclick = close
  el.onclick = (e) => e.target === el && close()
  const sh = el.querySelector('[data-share]')
  if (sh) sh.onclick = () => navigator.share({ title: 'ORPay receipt', text: shareText }).catch(() => {})
  return close
}

// Grey placeholder rows while data loads.
export const skeletonRows = (n = 3) =>
  Array.from({ length: n }, () => '<li class="sk-row"><span class="sk sk-ico"></span><span class="sk-lines"><span class="sk sk-l1"></span><span class="sk sk-l2"></span></span><span class="sk sk-amt"></span></li>').join('')
export const skeletonCard = () => '<section class="card"><span class="sk sk-title"></span>' + `<ul class="sk-list">${skeletonRows(3)}</ul></section>`
