/**
 * schema.org descriptions (JSON-LD) that tell search engines what the site is: the agency
 * (a local professional service in Yerevan, with its founders), the website, where each page
 * sits (breadcrumbs), each article, and the questions and answers of the full FAQ.
 */
import { fileUrl, inLanguage } from './addresses.js'

/** The agency's id: every page refers to the same agency. */
const organizationId = (siteUrl) => `${siteUrl}#organization`

const person = (member, language) => ({
  '@type': 'Person',
  name: inLanguage(member.name, language),
  jobTitle: inLanguage(member.role, language),
})

/** The agency, on every page. */
export function organization({ site, people, language, siteUrl }) {
  const sameAs = site.social.map((profile) => profile.url).filter(Boolean)
  return {
    '@type': 'ProfessionalService',
    '@id': organizationId(siteUrl),
    name: inLanguage(site.name, language),
    alternateName: 'BOTZ',
    description: inLanguage(site.description, language),
    url: siteUrl,
    logo: fileUrl(siteUrl, 'images/apple-touch-icon.png'),
    image: fileUrl(siteUrl, 'images/og-default.png'),
    telephone: site.phoneE164,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: inLanguage(site.location, language),
      addressCountry: 'AM',
    },
    areaServed: { '@type': 'Country', name: 'Armenia' },
    ...(site.openingHours && { openingHours: site.openingHours }),
    founder: people.map((member) => person(member, language)),
    ...(sameAs.length > 0 && { sameAs }),
  }
}

/** The website itself, on the home page. */
export const website = ({ site, language, siteUrl }) => ({
  '@type': 'WebSite',
  '@id': `${siteUrl}#website`,
  url: siteUrl,
  name: inLanguage(site.name, language),
  inLanguage: language,
  publisher: { '@id': organizationId(siteUrl) },
})

/** Where the page sits: [{ name, url }] from the home page down to the page. */
export const breadcrumbs = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((step, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: step.name,
    item: step.url,
  })),
})

/** An article. `image` and `url` are full addresses. */
export function blogPosting({ post, author, language, url, image, siteUrl }) {
  return {
    '@type': 'BlogPosting',
    headline: inLanguage(post.title, language),
    description: inLanguage(post.description, language),
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: language,
    mainEntityOfPage: url,
    image,
    ...(author && { author: person(author, language) }),
    publisher: { '@id': organizationId(siteUrl) },
  }
}

/** Questions and answers ({ question, answer } in every language). */
export const faqPage = (items, language) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: inLanguage(item.question, language),
    acceptedAnswer: { '@type': 'Answer', text: inLanguage(item.answer, language) },
  })),
})

/** All of a page's descriptions, as one JSON-LD document. */
export const schemaDocument = (nodes) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter(Boolean),
})
