// "Install the app" prompt. Android/desktop Chrome hand us an install event we
// can trigger from a button; iPhone Safari has none, so we show the two taps
// (Share → Add to Home Screen) instead. Nothing shows once installed, inside
// the native app, or for two weeks after "Not now".

const DISMISS = 'orpay.installDismissed'
let deferred = null
const listeners = new Set()

export const isInstalled = () =>
  matchMedia('(display-mode: standalone)').matches || navigator.standalone === true || !!window.Capacitor
export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream
const isSafari = () => /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent)

addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferred = e
  listeners.forEach((f) => f())
})
addEventListener('appinstalled', () => {
  deferred = null
  listeners.forEach((f) => f())
})

export const canInstall = () => !isInstalled() && (!!deferred || (isIOS() && isSafari()))
export const onInstallChange = (f) => listeners.add(f)

function dismissed() {
  try {
    return Date.now() - Number(localStorage.getItem(DISMISS) || 0) < 14 * 864e5
  } catch {
    return false
  }
}

// Run the install flow. Resolves true if installed (or instructions shown).
export async function install() {
  if (deferred) {
    deferred.prompt()
    const { outcome } = await deferred.userChoice.catch(() => ({ outcome: 'dismissed' }))
    deferred = null
    listeners.forEach((f) => f())
    return outcome === 'accepted'
  }
  if (isIOS()) {
    iosSheet()
    return true
  }
  return false
}

function iosSheet() {
  const el = document.createElement('div')
  el.className = 'ask in'
  el.innerHTML = `<div class="ask-card" role="dialog" aria-modal="true" aria-label="Install ORPay">
    <h3>Install ORPay on your iPhone</h3>
    <ol class="ios-steps">
      <li><span>1</span>Tap the <b>Share</b> button <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v13M7 8l5-5 5 5M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5"/></svg> in Safari's toolbar</li>
      <li><span>2</span>Choose <b>Add to Home Screen</b></li>
      <li><span>3</span>Tap <b>Add</b>. ORPay opens full screen like an app</li>
    </ol>
    <div class="ask-actions"><button type="button" class="primary">Got it</button></div>
  </div>`
  el.onclick = (e) => (e.target === el || e.target.closest('button')) && el.remove()
  document.body.append(el)
}

// A slim banner placed inside `host` (e.g. the wallet home).
export function installBanner(host) {
  if (!host || !canInstall() || dismissed()) return
  const el = document.createElement('div')
  el.className = 'install-banner'
  el.innerHTML = `<img src="/icon-192.png" alt=""><span><b>Install ORPay</b><small>Opens like an app, faster, works offline</small></span>
    <button type="button" class="primary small" data-go>Install</button><button type="button" class="link" data-no aria-label="Not now">Not now</button>`
  el.querySelector('[data-go]').onclick = async () => {
    if (await install()) el.remove()
  }
  el.querySelector('[data-no]').onclick = () => {
    try {
      localStorage.setItem(DISMISS, String(Date.now()))
    } catch {}
    el.remove()
  }
  host.prepend(el)
}
