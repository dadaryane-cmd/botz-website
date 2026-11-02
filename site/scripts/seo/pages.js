/**
 * What search engines are told about each published page, in each language, from the content
 * files: the pages in content/pages and the published articles. Used for the <head> tags and the
 * sitemap (scripts/build-site.js).
 */
import { BLOG_PAGE, HOME_PAGE } from '../../public/js/lib/urls.js'
import { alternates, fileUrl, inLanguage, pageUrl } from './addresses.js'
import {
  blogPosting,
  breadcrumbs,
  faqPage,
  organization,
  schemaDocument,
  service,
  website,
} from './schema.js'

const SHARE_IMAGE = 'images/og-default.png'

/** The page's file in the shells and in content links ("about.html"; the home page index.html). */
const pageFile = (key) => (key === HOME_PAGE ? 'index.html' : `${key}.html`)

/**
 * Every published page: the site's pages ({ key, file, page }), then the articles
 * ({ post, lastModified }, with their date for the sitemap).
 */
export function publishedPages({ pages, posts }) {
  return [
    ...Object.entries(pages).map(([key, page]) => ({ key, file: pageFile(key), page })),
    ...posts.map((post) => ({ post, lastModified: post.updated ?? post.date })),
  ]
}

/** A page's name as the menu shows it ("Pricing"), else null. */
function menuName(navigation, key, language) {
  const links = navigation.header.flatMap((item) => [item, ...(item.children ?? [])])
  const link = links.find((candidate) => candidate.href === pageFile(key))
  return link ? inLanguage(link.label, language) : null
}

/** The full questions-and-answers lists of a page (a short list links to the full one). */
const fullFaqItems = (page) =>
  page.sections
    .filter((section) => section.type === 'faq' && !section.link?.href)
    .flatMap((section) => section.items)

/** The page's services (serviceDetail sections), each with its packages from the price list. */
function services({ page, catalog, language, url, siteUrl }) {
  return page.sections
    .filter((section) => section.type === 'serviceDetail')
    .map((section) =>
      service({
        section,
        packages: catalog.packages.filter((pkg) => pkg.category === section.service),
        language,
        url: section.id ? `${url}#${section.id}` : url,
        siteUrl,
      }),
    )
}

/**
 * The tags' content for one page in one language (see seoTags in head-tags.js).
 * `content`: { site, people, navigation, catalog, routes }.
 */
export function pageDescription(entry, language, content) {
  const { site, people, navigation, catalog, routes } = content
  const siteUrl = site.url
  const url = pageUrl(siteUrl, routes, entry, language)
  const crumb = (key, name) => ({ name, url: pageUrl(siteUrl, routes, { key }, language) })
  const home = crumb(HOME_PAGE, menuName(navigation, HOME_PAGE, language))
  const agency = organization({ site, people, language, siteUrl })
  const shared = {
    language,
    url,
    alternates: alternates(siteUrl, routes, entry),
    siteName: inLanguage(site.name, language),
    verification: {
      google: site.googleVerification,
      yandex: site.yandexVerification,
      bing: site.bingVerification,
    },
  }

  if (entry.post) {
    const { post } = entry
    const heading = inLanguage(post.title, language)
    const image = fileUrl(siteUrl, post.cover || SHARE_IMAGE)
    const author = people.find((member) => member.key === post.author)
    const blog = crumb(BLOG_PAGE, menuName(navigation, BLOG_PAGE, language))
    return {
      ...shared,
      heading,
      title: heading + inLanguage(site.titleSuffix, language),
      description: inLanguage(post.description, language),
      image,
      type: 'article',
      published: post.date,
      schema: schemaDocument([
        agency,
        breadcrumbs([home, blog, { name: heading, url }]),
        blogPosting({ post, author, language, url, image, siteUrl }),
      ]),
    }
  }

  const { page, key } = entry
  const heading = inLanguage(page.meta.title, language)
  const isHome = key === HOME_PAGE
  const faqItems = fullFaqItems(page)
  return {
    ...shared,
    heading,
    title: heading + inLanguage(site.titleSuffix, language),
    description: inLanguage(page.meta.description, language),
    image: fileUrl(siteUrl, SHARE_IMAGE),
    type: 'website',
    schema: schemaDocument([
      agency,
      isHome && website({ site, language, siteUrl }),
      !isHome && breadcrumbs([home, { name: menuName(navigation, key, language) || heading, url }]),
      ...services({ page, catalog, language, url, siteUrl }),
      faqItems.length > 0 && faqPage(faqItems, language),
    ]),
  }
}
