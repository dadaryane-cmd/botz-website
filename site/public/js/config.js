/** Site-wide constants. */

/** Pages with a content file in /content/pages, by their <html data-page> value. */
export const PAGES = ['home', 'services', 'pricing', 'about', 'contact']

export const LANGUAGES = ['hy', 'en', 'ru']
export const DEFAULT_LANGUAGE = 'hy'
export const LANGUAGE_LABELS = { hy: 'Հայ', en: 'Eng', ru: 'Рус' }

/** Contract lengths in months, as offered in the price list. */
export const CONTRACT_LENGTHS = [1, 3, 6, 9, 12]
export const DEFAULT_CONTRACT_LENGTH = 6
export const MAX_ADDON_QUANTITY = 20

export const PACKAGE_CATEGORIES = ['smm', 'seo', 'bundle', 'website']
export const INQUIRY_SERVICES = ['smm', 'seo', 'bundle', 'website', 'addon', 'other']
/** Everything a founder can be responsible for: the inquiry services plus strategy work. */
export const SERVICE_AREAS = [...INQUIRY_SERVICES, 'strategy']

/** Social networks the footer has icons for (content/site.json → social). */
export const SOCIAL_NETWORKS = ['instagram', 'facebook', 'tiktok']

export const STORAGE_PREFIX = 'botz.'
export const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/'
