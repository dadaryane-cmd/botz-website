/**
 * Every page, keyed by the data-page attribute of its HTML file.
 */
import { home } from './home.js'
import { services } from './services.js'
import { smm } from './smm.js'
import { seo } from './seo.js'
import { websiteCreation } from './website-creation.js'
import { pricing } from './pricing.js'
import { about } from './about.js'
import { contact } from './contact.js'

export const pages = {
  home,
  services,
  smm,
  seo,
  website: websiteCreation,
  pricing,
  about,
  contact,
}
