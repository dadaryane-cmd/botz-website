/**
 * The lamp's hidden message: after a quick streak of pulls, a small card invites the visitor
 * to a free audit and fills the contact form's message so the inquiry says where it came from.
 * Shown at most once per page view; closes with ✕, Escape or the button.
 */
import { h } from '../../lib/dom.js'
import { ui } from '../../lib/i18n.js'
import { sectionHref } from '../../lib/page.js'
import { updateSelection } from '../../pricing/selection.js'

let shown = false

export function showEasterEgg() {
  if (shown) return
  shown = true

  const onKeydown = (event) => {
    if (event.key === 'Escape') close()
  }
  const goToAudit = () => {
    updateSelection({ note: ui('easterEgg', 'message') })
    close()
  }

  const card = h(
    'aside',
    { class: 'easter-egg', role: 'status', 'aria-live': 'polite' },
    h('p', { class: 'easter-egg-title' }, ui('easterEgg', 'title')),
    h('p', null, ui('easterEgg', 'text')),
    h(
      'a',
      {
        class: 'btn btn-primary btn-small',
        href: sectionHref('contact', 'contact.html'),
        onclick: goToAudit,
      },
      ui('easterEgg', 'cta'),
    ),
    h(
      'button',
      {
        type: 'button',
        class: 'easter-egg-close',
        'aria-label': ui('easterEgg', 'close'),
        onclick: close,
      },
      '×',
    ),
  )

  function close() {
    document.removeEventListener('keydown', onKeydown)
    card.classList.remove('is-visible')
    // Leave time for the slide-out before removing it.
    setTimeout(() => card.remove(), 300)
  }

  document.body.append(card)
  document.addEventListener('keydown', onKeydown)
  // Next frame, so the slide-in transition runs from the hidden state.
  requestAnimationFrame(() => card.classList.add('is-visible'))
}
