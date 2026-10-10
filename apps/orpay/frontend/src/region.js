// Which country the user is in, worked out on the device (time zone first,
// then the browser's language region). No IP lookup, nothing is sent.
// Used to show the local name for saving circles: ajo, susu, chama.

const ZONES = { 'Africa/Lagos': 'NG', 'Africa/Accra': 'GH', 'Africa/Nairobi': 'KE' }
const OVERRIDE = 'orpay.country'

export function country() {
  try {
    const o = localStorage.getItem(OVERRIDE)
    if (o) return o
  } catch {}
  try {
    const z = ZONES[Intl.DateTimeFormat().resolvedOptions().timeZone]
    if (z) return z
  } catch {}
  for (const l of navigator.languages ?? [navigator.language]) {
    const r = /-([A-Z]{2})\b/i.exec(l ?? '')?.[1]?.toUpperCase()
    if (r && ['NG', 'GH', 'KE'].includes(r)) return r
  }
  return ''
}

// Local name for a saving circle, or null to keep "saving circle".
const TERMS = { NG: 'ajo', GH: 'susu', KE: 'chama' }
export const circleTerm = () => TERMS[country()] ?? null

const cap = (s) => s[0].toUpperCase() + s.slice(1)
const an = (s) => (/^[aeiou]/.test(s) ? 'an' : 'a')

// English interface phrases rewritten with the local name. Applied by the
// i18n layer before any language dictionary.
export function regionPhrases() {
  const t = circleTerm()
  if (!t) return {}
  const T = cap(t)
  return {
    // Short labels (tabs, buttons) use the local word; headings pair it with
    // the English so newcomers know what it is: "Ajo / Saving circles".
    Circles: T, 'Saving circles': `${T} / Saving circles`, 'Saving circle': `${T} / Saving circle`, 'saving circle': t,
    'New saving circle': `New ${t}`, 'New circle': `New ${t}`,
    'Start your first saving circle': `Start your first ${t}`, 'Start a circle': `Start ${an(t)} ${t}`,
    'Create circle': `Create ${t}`, 'Join circle': `Join ${t}`, 'Join this circle': `Join this ${t}`,
    'Share circle': `Share ${t}`, 'Circle name': `${T} name`, 'Circle payments due': `${T} payments due`,
    'Created a saving circle': `Created ${an(t)} ${t}`, 'Joined a saving circle': `Joined ${an(t)} ${t}`,
    'Received circle payout': `Received ${t} payout`, 'Circle payout': `${T} payout`,
    '← Circles': `← ${T}`, 'Delete this circle': `Delete this ${t}`, 'This circle is full': `This ${t} is full`,
    'Joined the circle': `Joined the ${t}`, 'Circle link copied': `${T} link copied`, 'Circle deleted': `${T} deleted`,
    'Delete circle?': `Delete ${t}?`, 'Your progress': 'Your progress',
    'Payments, circle turns, escrow updates': `Payments, ${t} turns, escrow updates`,
  }
}
