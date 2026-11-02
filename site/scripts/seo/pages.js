/**
 * What search engines are told about each published page, in each language, from the content
 * files: the pages in content/pages and the published articles. Used for the <head> tags and the
 * sitemap (scripts/build-site.js).
 */
import { postFile } from '../../public/js/blog/posts.js'
import { alternates, fileUrl, inLanguage, pageUrl } from './addresses.js'
import {
  blogPosting,
  breadcrumbs,
  faqPage,
  organization,
  schemaDocument,
  website,
} from './schema.js'

const SHARE_IMAGE = 'images/og-default.png'
const HOME_FILE = 'index.html'
const BLOG_FILE = 'blog.html'

const pageFile = (key) => (key === 'home' ? HOME_FILE : `${key}.html`)

/** Every published page: the site's pages, then the articles (with their date for the sitemap). */
export function publishedPages({ pages, posts }) {
  return [
    ...Object.entries(pages).map(([key, page]) => ({ file: pageFile(key), page })),
    ...posts.map((post) => ({
      file: postFile(post.slug),
      post,
      lastModified: post.updated ?? post.date,
    })),
  ]
}

/** A page's name as the menu shows it ("Pricing"), else its title. */
function menuName(navigation, file, language) {
  const links = navigation.header.flatMap((item) => [item, ...(item.children ?? [])])
  const link = links.find((candidate) => candidate.href === file)
  return link && inLanguage(link.label, language)
}

/** The full questions-and-answers lists of a page (a short list links to the full one). */
const fullFaqItems = (page) =>
  page.sections
    .filter((section) => section.type === 'faq' && !section.link?.href)
    .flatMap((section) => section.items)

/**
 * The tags' content for one page in one language (see seoTags in head-tags.js).
 * `content`: { site, people, navigation }.
 */
export function pageDescription(entry, language, content) {
  const { site, people, navigation } = content
  const siteUrl = site.url
  const url = pageUrl(siteUrl, entry.file, language)
  const crumb = (file, name) => ({ name, url: pageUrl(siteUrl, file, language) })
  const home = crumb(HOME_FILE, menuName(navigation, HOME_FILE, language))
  const agency = organization({ site, people, language, siteUrl })
  const shared = {
    language,
    url,
    alternates: alternates(siteUrl, entry.file),
    siteName: inLanguage(site.name, language),
  }

  if (entry.post) {
    const { post } = entry
    const heading = inLanguage(post.title, language)
    const image = fileUrl(siteUrl, post.cover || SHARE_IMAGE)
    const author = people.find((member) => member.key === post.author)
    const blog = crumb(BLOG_FILE, menuName(navigation, BLOG_FILE, language))
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

  const { page } = entry
  const heading = inLanguage(page.meta.title, language)
  const isHome = entry.file === HOME_FILE
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
      !isHome &&
        breadcrumbs([home, { name: menuName(navigation, entry.file, language) || heading, url }]),
      faqItems.length > 0 && faqPage(faqItems, language),
    ]),
  }
}
