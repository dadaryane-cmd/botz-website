import { catalog } from '../../content/index.js'
import { formatAmd } from '../../lib/format.js'
import { ui } from '../../lib/i18n.js'
import { findPackage, shortPrice } from '../../pricing/engine.js'
import { getSelection } from '../../pricing/selection.js'
import { createFollower } from './follower.js'

/** "115,000 ֏ per month" for the chosen contract length, "299,000 ֏ one-time", or "Unavailable". */
function tipText({ kind, amount }) {
  if (kind === 'unavailable') return ui('pricing', 'unavailableShort')
  const unit = kind === 'oneTime' ? ui('pricing', 'oneTime') : ui('pricing', 'perMonth')
  return `${formatAmd(amount)} ${unit}`
}

/**
 * Over a package card, a label beside the mouse gives that package's price for the contract
 * length chosen above the cards. It is read afresh each time the mouse comes onto a card, so a
 * new length shows at once.
 */
export function setUpPriceTip() {
  const tip = createFollower('cursor-price-tip', { offsetX: 18, offsetY: 18, keepInView: true })
  document.addEventListener('pointerover', (event) => {
    const card = event.pointerType === 'mouse' && event.target.closest('[data-package]')
    const pkg = card && findPackage(catalog, card.dataset.package)
    if (!pkg) {
      tip.hide()
      return
    }
    tip.element.textContent = tipText(shortPrice(pkg, getSelection().months))
    tip.show(event)
  })
  document.documentElement.addEventListener('pointerleave', () => tip.hide())
}
