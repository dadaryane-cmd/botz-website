/** Site-wide constants. */

/** Pages with a content file in /content/pages, by their <html data-page> value. */
export const PAGES = ['home', 'services', 'pricing', 'about', 'blog', 'contact']

/** The article page (post.html, written as post-<slug>.html for each article when publishing). */
export const ARTICLE_PAGE = 'post'

/** Site-wide content files in /content, loaded on every page (and preloaded in its HTML). */
export const SITE_CONTENT = ['site', 'people', 'navigation', 'catalog', 'finder', 'ui']

export const LANGUAGES = ['hy', 'en', 'ru']
export const DEFAULT_LANGUAGE = 'hy'
export const LANGUAGE_LABELS = { hy: 'Հայ', en: 'Eng', ru: 'Рус' }
/** Each language's name in that language (the language menu, the editor's fields). */
export const LANGUAGE_NAMES = { hy: 'Հայերեն', en: 'English', ru: 'Русский' }

/**
 * Contract lengths in months, as offered in the price list. There is no 1-month contract:
 * social media and search take a few months to show results.
 */
export const CONTRACT_LENGTHS = [3, 6, 9, 12]
export const DEFAULT_CONTRACT_LENGTH = 6
export const MAX_ADDON_QUANTITY = 20

export const PACKAGE_CATEGORIES = ['smm', 'seo', 'bundle', 'website']
/** What an inquiry can be about, in the order of the Services page; founders handle these too. */
export const INQUIRY_SERVICES = ['smm', 'seo', 'website', 'strategy', 'bundle', 'addon', 'other']

/** Social networks the footer has icons for (content/site.json → social). */
export const SOCIAL_NETWORKS = ['instagram', 'facebook', 'tiktok']

export const STORAGE_PREFIX = 'botz.'
export const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/'
