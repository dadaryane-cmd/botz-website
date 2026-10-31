/**
 * Pages CMS configuration (https://pagescms.org): which content files can be edited and with
 * which form fields. `npm run cms` writes it to /.pages.yml at the repository root, where
 * Pages CMS reads it.
 *
 * Pages CMS saves only the fields declared here, so every key in the content JSON must be
 * declared (tests/cms.test.js checks this). Layout keys editors should not change are `hidden`.
 */
import { readFileSync } from 'node:fs'
import {
  CONTRACT_LENGTHS,
  INQUIRY_SERVICES,
  PACKAGE_CATEGORIES,
  PAGES,
  SOCIAL_NETWORKS,
} from '../public/js/config.js'

const CONTENT = 'site/public/content'
const readContent = (file) =>
  JSON.parse(readFileSync(new URL(`../public/content/${file}`, import.meta.url)))

/* ---------- field helpers ---------- */

/** Text in all three languages: one line, or a paragraph with `long`. */
const text = (name, label, { long = false, description } = {}) => ({
  name,
  label,
  component: long ? 'paragraph' : 'line',
  ...(description && { description }),
})
const string = (name, label, extra = {}) => ({ name, label, type: 'string', ...extra })
const number = (name, label, extra = {}) => ({ name, label, type: 'number', ...extra })
const contractLength = (name, label) =>
  number(name, label, { description: `One of ${CONTRACT_LENGTHS.join(', ')}.` })
const boolean = (name, label) => ({ name, label, type: 'boolean' })
const select = (name, label, values, extra = {}) => ({
  name,
  label,
  type: 'select',
  ...extra,
  options: { values, ...extra.options },
})
const object = (name, label, fields) => ({ name, label, type: 'object', fields })
const list = (field, summary) => ({
  ...field,
  list: summary ? { collapsible: { collapsed: true, summary } } : true,
})
const readonly = (field) => ({ ...field, readonly: true })
const hidden = (field) => ({ ...field, hidden: true })

const HIGHLIGHT_HINT =
  'Wrap words in *asterisks* to show them in the accent colour. In page titles, {logo} shows the BOTZ logo.'
const heading = (name = 'heading', label = 'Heading') =>
  text(name, label, { description: HIGHLIGHT_HINT })
const link = (name, label) => ({ name, label, component: 'link' })
const button = (name, label) => ({ name, label, component: 'button' })

/** Section placement decided by the developer (anchor, background, width): kept, not shown. */
const layout = [
  hidden(string('id', 'Anchor')),
  hidden(string('background', 'Background')),
  hidden(string('width', 'Width')),
]

/* ---------- page sections ---------- */

const sectionBlocks = [
  {
    name: 'hero',
    label: 'Page title',
    fields: [
      heading(),
      text('subheading', 'Subheading', { long: true }),
      list(button('buttons', 'Buttons'), '{label.en}'),
      hidden(string('variant', 'Variant')),
      ...layout,
    ],
  },
  {
    name: 'sign',
    label: 'Cinema banner',
    fields: [
      text('title', 'Headline', { long: true, description: 'Each line is one row of the board.' }),
      text('tagline', 'Tagline', { long: true, description: 'Each line is one row of the board.' }),
    ],
  },
  {
    name: 'split',
    label: 'Statement with key points',
    fields: [
      heading('statement', 'Statement'),
      text('body', 'Text', { long: true }),
      list(
        object('points', 'Key points', [
          text('title', 'Title'),
          text('text', 'Text', { long: true }),
        ]),
        '{title.en}',
      ),
      ...layout,
    ],
  },
  {
    name: 'services',
    label: 'Services',
    fields: [
      heading(),
      text('intro', 'Intro', { long: true }),
      list(
        object('items', 'Services', [
          text('title', 'Title'),
          // Shows the founder(s) who handle this service (from Founders).
          select('service', 'Service', INQUIRY_SERVICES),
          list(text('highlights', 'What it includes')),
          link('link', 'Link'),
        ]),
        '{title.en}',
      ),
      ...layout,
    ],
  },
  {
    name: 'serviceDetail',
    label: 'Service explained',
    fields: [
      heading('title', 'Service name'),
      select('service', 'Service (shows who handles it)', INQUIRY_SERVICES),
      text('problem', 'What it solves', { long: true }),
      text('approach', 'How we work', { long: true }),
      list(text('deliverables', 'What we do')),
      link('link', 'Link (e.g. to its prices)'),
      ...layout,
    ],
  },
  {
    name: 'comparison',
    label: 'Price comparison table',
    fields: [
      heading(),
      text('intro', 'Intro', { long: true }),
      select('categories', 'Package groups', PACKAGE_CATEGORIES, { options: { multiple: true } }),
      ...layout,
    ],
  },
  {
    name: 'team',
    label: 'Team',
    fields: [
      // The people themselves come from Founders (people.json).
      heading(),
      text('intro', 'Intro', { long: true }),
      link('link', 'Link under the cards'),
      hidden(string('variant', 'Variant')),
      ...layout,
    ],
  },
  {
    name: 'samples',
    label: 'Sample PDFs',
    fields: [
      heading(),
      text('intro', 'Intro', { long: true }),
      list(
        object('items', 'Samples', [
          text('title', 'Title'),
          text('text', 'Text', { long: true }),
          { name: 'file', label: 'PDF', type: 'file', options: { media: 'downloads' } },
        ]),
        '{title.en}',
      ),
      ...layout,
    ],
  },
  {
    name: 'finder',
    label: 'Package finder',
    fields: [heading(), text('intro', 'Intro', { long: true }), ...layout],
  },
  {
    name: 'packagePreview',
    label: 'Price overview',
    fields: [
      heading(),
      text('intro', 'Intro', { long: true }),
      select('categories', 'Package groups', PACKAGE_CATEGORIES, { options: { multiple: true } }),
      contractLength('duration', 'Contract length shown (months)'),
      button('link', 'Button'),
      boolean('showGuideLink', 'Show the package finder link'),
      ...layout,
    ],
  },
  {
    name: 'process',
    label: 'Process steps',
    fields: [
      heading(),
      list(
        object('steps', 'Steps', [text('title', 'Title'), text('text', 'Text', { long: true })]),
        '{title.en}',
      ),
      ...layout,
    ],
  },
  {
    name: 'faq',
    label: 'Questions & answers',
    fields: [
      heading(),
      list(
        object('items', 'Questions', [
          text('question', 'Question'),
          text('answer', 'Answer', { long: true }),
          boolean('openByDefault', 'Open by default'),
        ]),
        '{question.en}',
      ),
      link('link', 'Link to more questions'),
      ...layout,
    ],
  },
  {
    name: 'contact',
    label: 'Contact & inquiry form',
    fields: [
      heading(),
      text('intro', 'Intro', { long: true }),
      select('service', 'Service preselected in the form', INQUIRY_SERVICES),
      ...layout,
    ],
  },
  {
    name: 'pricing',
    label: 'Pricing tool',
    fields: [
      heading(),
      select('defaultCategory', 'Package group shown first', PACKAGE_CATEGORIES),
      contractLength('defaultDuration', 'Contract length selected first (months)'),
      boolean('lockCategory', 'Show only this package group'),
      boolean('showAddons', 'Show add-ons'),
      ...layout,
    ],
  },
  {
    name: 'cta',
    label: 'Call to action',
    fields: [
      heading(),
      text('text', 'Text', { long: true }),
      list(button('buttons', 'Buttons'), '{label.en}'),
      ...layout,
    ],
  },
]

const PAGE_LABELS = {
  home: 'Home',
  services: 'Services',
  pricing: 'Pricing',
  about: 'About',
  contact: 'Contact',
}

const pageEntry = (key) => ({
  name: `page-${key}`,
  label: PAGE_LABELS[key],
  type: 'file',
  path: `${CONTENT}/pages/${key}.json`,
  format: 'json',
  fields: [
    object('meta', 'Search engines & browser tab', [
      text('title', 'Page title'),
      text('description', 'Description', { long: true }),
    ]),
    { name: 'sections', label: 'Sections', component: 'sections' },
  ],
})

/* ---------- site-wide content ---------- */

const packageKeys = readContent('catalog.json').packages.map((pkg) => pkg.key)
const peopleKeys = readContent('people.json').people.map((person) => person.key)

const catalogEntry = {
  name: 'catalog',
  label: 'Packages & prices',
  description: 'Prices in AMD. Leave a contract length empty if the package is not offered for it.',
  type: 'file',
  path: `${CONTENT}/catalog.json`,
  format: 'json',
  fields: [
    list(
      object('packages', 'Packages', [
        readonly(string('key', 'Key')),
        readonly(select('category', 'Group', PACKAGE_CATEGORIES)),
        text('name', 'Name'),
        text('tagline', 'Tagline'),
        list(text('includes', "What's included")),
        text('note', 'Note under the list', { long: true }),
        boolean('recommended', 'Recommended'),
        object(
          'prices',
          'Monthly price by contract length',
          CONTRACT_LENGTHS.map((months) =>
            number(`m${months}`, `${months} ${months === 1 ? 'month' : 'months'}`),
          ),
        ),
        number('oneTimePrice', 'One-time price (website creation)'),
        readonly(
          select('components', 'Combines (bundles)', packageKeys, { options: { multiple: true } }),
        ),
        select('contact', 'Contact person', [...peopleKeys, 'either']),
      ]),
      '{name.en}',
    ),
    list(
      object('addons', 'Add-ons', [
        readonly(string('key', 'Key')),
        text('name', 'Name'),
        number('price', 'Price'),
        boolean('priceIsFrom', 'Price is a minimum ("from")'),
        number('units', 'Items in the bundle'),
        select('contact', 'Contact person', peopleKeys),
      ]),
      '{name.en}',
    ),
  ],
}

const finderEntry = {
  name: 'finder',
  label: 'Package finder',
  type: 'file',
  path: `${CONTENT}/finder.json`,
  format: 'json',
  fields: [
    list(
      object('questions', 'Questions', [
        readonly(string('key', 'Key')),
        readonly(string('role', 'Role')),
        text('label', 'Question'),
        text('help', 'Help text'),
        list(
          object('options', 'Answers', [
            readonly(string('value', 'Value')),
            text('label', 'Answer'),
            number('budgetMax', 'Budget limit (AMD)'),
            number('months', 'Months'),
          ]),
          '{label.en}',
        ),
      ]),
      '{label.en}',
    ),
    list(
      object('rules', 'Scoring rules', [
        readonly(string('key', 'Key')),
        select('packageKey', 'Package', packageKeys),
        number('points', 'Points'),
        list(
          object('when', 'When the answers are', [
            string('question', 'Question key'),
            list(string('values', 'Answer values')),
          ]),
        ),
        text('reason', 'Reason shown to the visitor', { long: true }),
      ]),
      '{key}',
    ),
  ],
}

const siteEntry = {
  name: 'site',
  label: 'Contact details',
  type: 'file',
  path: `${CONTENT}/site.json`,
  format: 'json',
  fields: [
    text('name', 'Agency name'),
    text('titleSuffix', 'Browser tab suffix'),
    text('description', 'Default description', { long: true }),
    string('phoneDisplay', 'Phone (as shown)'),
    string('phoneE164', 'Phone (international, no spaces)', { pattern: '^\\+[0-9]{8,15}$' }),
    string('whatsapp', 'WhatsApp number (digits only)', { pattern: '^[0-9]{8,15}$' }),
    string('email', 'Public email'),
    string('formEmail', 'Inquiry form sends to', {
      description: 'Changing this needs a new FormSubmit activation (see site/README.md).',
    }),
    text('location', 'City'),
    text('hours', 'Working hours'),
    list(
      object('social', 'Social media', [
        select('network', 'Network', SOCIAL_NETWORKS),
        string('url', 'Page link', { description: 'Leave empty until the page is open.' }),
      ]),
      '{network}',
    ),
  ],
}

const peopleEntry = {
  name: 'people',
  label: 'Founders',
  type: 'file',
  path: `${CONTENT}/people.json`,
  format: 'json',
  fields: [
    list(
      object('people', 'People', [
        readonly(string('key', 'Key')),
        text('name', 'Name'),
        text('role', 'Role'),
        text('bio', 'Short bio (About page)', { long: true }),
        {
          name: 'photo',
          label: 'Photo (square works best)',
          type: 'image',
          options: { media: 'images' },
        },
        text('contactLabel', 'Link text, e.g. "Write to Mariam"'),
        select('services', 'Handles inquiries about', INQUIRY_SERVICES, {
          options: { multiple: true },
        }),
      ]),
      '{name.en}',
    ),
  ],
}

const navigationEntry = {
  name: 'navigation',
  label: 'Menu & footer',
  type: 'file',
  path: `${CONTENT}/navigation.json`,
  format: 'json',
  fields: [
    list(
      object('header', 'Menu', [
        text('label', 'Label'),
        string('href', 'Link', { description: 'Leave empty for a group with a submenu.' }),
        list(link('children', 'Submenu links'), '{label.en}'),
      ]),
      '{label.en}',
    ),
    button('cta', 'Menu button'),
    text('footerTagline', 'Footer line under the logo'),
    list(
      object('footerColumns', 'Footer columns', [
        text('title', 'Title'),
        list(link('links', 'Links'), '{label.en}'),
      ]),
      '{title.en}',
    ),
    text('footerNote', 'Footer note', { long: true }),
  ],
}

/** "successTitle" → "Success title", "cat_smm" → "Cat smm" */
const humanize = (key) => {
  const words = key
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .replace(/_/g, ' ')
    .toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

const interfaceEntry = {
  name: 'interface',
  label: 'Buttons & labels',
  description:
    'Short texts used across the site. {name}-style placeholders are filled in automatically: keep them.',
  type: 'file',
  path: `${CONTENT}/ui.json`,
  format: 'json',
  fields: Object.entries(readContent('ui.json')).map(([group, strings]) =>
    object(
      group,
      humanize(group),
      Object.keys(strings).map((key) => text(key, humanize(key))),
    ),
  ),
}

/* ---------- configuration ---------- */

const languageFields = (type) => [
  { name: 'hy', label: 'Հայերեն', type },
  { name: 'en', label: 'English', type },
  { name: 'ru', label: 'Русский', type },
]

export const pagesConfig = {
  media: [
    { name: 'images', label: 'Images', input: 'site/public/images', output: 'images' },
    {
      name: 'downloads',
      label: 'Sample PDFs',
      input: 'site/public/downloads',
      output: 'downloads',
      categories: ['document'],
    },
  ],
  components: {
    // Every page is a list of sections; `type` says which kind each one is.
    sections: { type: 'block', blockKey: 'type', list: true, blocks: sectionBlocks },
    line: { type: 'object', fields: languageFields('string') },
    paragraph: { type: 'object', fields: languageFields('text') },
    link: {
      type: 'object',
      fields: [text('label', 'Label'), string('href', 'Link (e.g. pricing.html or #contact)')],
    },
    button: {
      type: 'object',
      fields: [
        text('label', 'Label'),
        string('href', 'Link (e.g. pricing.html or #contact)'),
        select('style', 'Style', ['primary', 'secondary']),
        text('note', 'Message to prefill in the contact form (optional)', { long: true }),
      ],
    },
  },
  content: [
    { name: 'pages', label: 'Pages', type: 'group', items: PAGES.map(pageEntry) },
    catalogEntry,
    finderEntry,
    siteEntry,
    peopleEntry,
    navigationEntry,
    interfaceEntry,
  ],
}
