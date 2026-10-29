/** Section `type` (as used in content/pages) → render function. */
import { renderContact } from './contact.js'
import { renderCta } from './cta.js'
import { renderFaq } from './faq.js'
import { renderFinder } from './finder.js'
import { renderHero } from './hero.js'
import { renderPackagePreview } from './package-preview.js'
import { renderPricing } from './pricing.js'
import { renderProcess } from './process.js'
import { renderSamples } from './samples.js'
import { renderServices } from './services.js'
import { renderSplit } from './split.js'
import { renderTeam } from './team.js'

const renderers = {
  contact: renderContact,
  cta: renderCta,
  faq: renderFaq,
  finder: renderFinder,
  hero: renderHero,
  packagePreview: renderPackagePreview,
  pricing: renderPricing,
  process: renderProcess,
  samples: renderSamples,
  services: renderServices,
  split: renderSplit,
  team: renderTeam,
}

export function renderSection(config) {
  const render = renderers[config.type]
  if (!render) {
    console.warn(`Unknown section type "${config.type}"`)
    return null
  }
  return render(config)
}
