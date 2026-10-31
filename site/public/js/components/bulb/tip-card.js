/**
 * The lamp's reward: a card with a short marketing tip (content/lamp-tips.json). Every further
 * pull, or "Another tip", shows the next one, and the place in the list is remembered for the
 * next visit. The audit button prefills the contact form's message so the inquiry says where it
 * came from. Once closed (✕, Escape or the audit button) it stays closed on this page.
 */
import { loadJson } from '../../content/load.js'
import { h, replayClass } from '../../lib/dom.js'
import { t, ui } from '../../lib/i18n.js'
import { sectionHref } from '../../lib/page.js'
import { load, save } from '../../lib/storage.js'
import { updateSelection } from '../../pricing/selection.js'
import { nextTipIndex } from './lamp-play.js'

const TIP_SWAP_MS = 400
const CLOSE_MS = 300

/** The open card's changing parts, or null. */
let openCard = null
let closedOnThisPage = false
let tipsRequest = null

/** Loaded on the first tip only: most visitors never pull the cord ten times. */
function loadTips() {
  tipsRequest ??= loadJson('lamp-tips.json')
    .then((file) => file.tips ?? [])
    .catch(() => [])
  return tipsRequest
}

export async function showNextTip() {
  if (closedOnThisPage) return
  const tips = await loadTips()
  if (tips.length === 0 || closedOnThisPage) return

  const index = nextTipIndex(load('lampTip'), tips.length)
  save('lampTip', index)
  openCard ??= renderCard()
  openCard.number.textContent = ui('lamp', 'tipNumber', { number: index + 1 })
  openCard.text.textContent = t(tips[index])
  replayClass(openCard.body, 'is-new', TIP_SWAP_MS)
}

function renderCard() {
  const number = h('p', { class: 'lamp-tip-number' })
  const text = h('p', { class: 'lamp-tip-text' })
  const body = h('div', { class: 'lamp-tip-body', 'aria-live': 'polite' }, number, text)

  const onKeydown = (event) => {
    if (event.key === 'Escape') close()
  }
  const askForAudit = () => {
    updateSelection({ note: ui('lamp', 'auditMessage') })
    close()
  }

  const card = h(
    'aside',
    { class: 'lamp-tip', 'aria-label': ui('lamp', 'tipTitle') },
    h('p', { class: 'lamp-tip-title' }, ui('lamp', 'tipTitle')),
    body,
    h(
      'div',
      { class: 'lamp-tip-actions' },
      h(
        'a',
        {
          class: 'btn btn-primary btn-small',
          href: sectionHref('contact', 'contact.html'),
          onclick: askForAudit,
        },
        ui('lamp', 'audit'),
      ),
      h(
        'button',
        { type: 'button', class: 'btn btn-link btn-small', onclick: showNextTip },
        ui('lamp', 'anotherTip'),
      ),
    ),
    h(
      'button',
      {
        type: 'button',
        class: 'lamp-tip-close',
        'aria-label': ui('lamp', 'close'),
        onclick: close,
      },
      '×',
    ),
  )

  function close() {
    closedOnThisPage = true
    openCard = null
    document.removeEventListener('keydown', onKeydown)
    card.classList.remove('is-visible')
    // Leave time for the slide-out before removing it.
    setTimeout(() => card.remove(), CLOSE_MS)
  }

  document.body.append(card)
  document.addEventListener('keydown', onKeydown)
  // Next frame, so the slide-in transition runs from the hidden state.
  requestAnimationFrame(() => card.classList.add('is-visible'))
  return { body, number, text }
}
