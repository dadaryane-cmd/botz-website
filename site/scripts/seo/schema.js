/**
 * schema.org descriptions (JSON-LD) that tell search engines what the site is: the agency
 * (a local professional service in Yerevan, with its founders), the website, where each page
 * sits (breadcrumbs), each service with its prices, each article, and the questions and answers
 * of the full FAQ.
 */
import { fileUrl, inLanguage } from './addresses.js'

/** The agency's id: every page refers to the same agency. */
const organizationId = (siteUrl) => `${siteUrl}#organization`

/** A founder; profile links (LinkedIn …) tell search engines who stands behind the work. */
const person = (member, language) => ({
  '@type': 'Person',
  name: inLanguage(member.name, language),
  jobTitle: inLanguage(member.role, language),
  ...(member.profiles?.length > 0 && { sameAs: member.profiles }),
})

/** The agency, on every page. Street and postal code once they are filled in (site.json). */
export function organization({ site, people, language, siteUrl }) {
  const sameAs = site.social.map((profile) => profile.url).filter(Boolean)
  const street = inLanguage(site.streetAddress, language)
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
      ...(street && { streetAddress: street }),
      addressLocality: inLanguage(site.location, language),
      ...(site.postalCode && { postalCode: site.postalCode }),
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

/**
 * A package's price in AMD: a monthly range over the contract lengths (the longest is the
 * cheapest), or the one-time starting price (websites).
 */
function packageOffer(pkg, language) {
  const monthly = Object.values(pkg.prices ?? {}).filter(Number.isFinite)
  const priceSpecification =
    monthly.length > 0
      ? {
          '@type': 'UnitPriceSpecification',
          minPrice: Math.min(...monthly),
          maxPrice: Math.max(...monthly),
          priceCurrency: 'AMD',
          unitCode: 'MON',
        }
      : { '@type': 'PriceSpecification', minPrice: pkg.oneTimePrice, priceCurrency: 'AMD' }
  return { '@type': 'Offer', name: inLanguage(pkg.name, language), priceSpecification }
}

/**
 * A service the agency offers (a serviceDetail section: title, the problem it solves and what it
 * includes), with its packages from the price list when it has any. `url` is the section's
 * full address.
 */
export function service({ section, packages, language, url, siteUrl }) {
  const name = inLanguage(section.title, language)
  return {
    '@type': 'Service',
    name,
    serviceType: name,
    description: inLanguage(section.problem, language),
    url,
    provider: { '@id': organizationId(siteUrl) },
    areaServed: { '@type': 'Country', name: 'Armenia' },
    ...(packages.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name,
        itemListElement: packages.map((pkg) => packageOffer(pkg, language)),
      },
    }),
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
