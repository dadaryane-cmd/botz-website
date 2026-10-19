import type { Block, Field } from 'payload'
import { blockSettings, linkFields } from '@/fields/shared'

const heading = (required = false): Field => ({ name: 'heading', type: 'text', localized: true, required })
const eyebrow: Field = { name: 'eyebrow', type: 'text', localized: true, admin: { description: 'Small label above the heading' } }
const intro: Field = { name: 'intro', type: 'textarea', localized: true }

const categoryOptions = [
  { label: 'SMM', value: 'smm' },
  { label: 'SEO', value: 'seo' },
  { label: 'SMM + SEO', value: 'bundle' },
  { label: 'Website', value: 'website' },
  { label: 'Add-ons', value: 'addon' },
]
const durationOptions = ['1', '3', '6', '9', '12'].map((v) => ({ label: `${v} month${v === '1' ? '' : 's'}`, value: v }))

const buttons: Field = {
  name: 'buttons',
  type: 'array',
  maxRows: 3,
  labels: { singular: 'Button', plural: 'Buttons' },
  fields: linkFields(),
}

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'mark',
      options: [
        { label: 'Living flame background (home)', value: 'flame' },
        { label: 'Animated B mark', value: 'mark' },
        { label: 'Oversized title', value: 'title' },
        { label: 'Title with image/video', value: 'media' },
      ],
    },
    eyebrow,
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'Wrap words in *asterisks* to highlight them in orange.' },
    },
    { name: 'subheading', type: 'textarea', localized: true },
    buttons,
    {
      name: 'proofLine',
      type: 'text',
      localized: true,
      admin: { description: 'One short line under the buttons, e.g. “Founders with 6+ years in SEO and social media”.' },
    },
    {
      name: 'sideCard',
      type: 'select',
      defaultValue: 'offer',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Founding-client offer (from Growth & offer)', value: 'offer' },
        { label: 'Sample monthly report preview', value: 'sample' },
      ],
      admin: {
        condition: (_, s) => s?.variant === 'flame',
        description: 'Card on the right side of the hero on large screens. The offer card hides itself when the offer is switched off.',
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, s) => s?.variant === 'media' },
    },
    {
      name: 'tickerItems',
      type: 'array',
      label: 'Moving ticker words',
      admin: { description: 'Optional words that scroll under the hero (e.g. service names).' },
      fields: [{ name: 'text', type: 'text', localized: true, required: true }],
    },
    {
      name: 'burnWords',
      type: 'array',
      label: 'Words on falling papers',
      admin: {
        condition: (_, s) => s?.variant === 'flame',
        description:
          'Short phrases (one to three words) handwritten on scraps of paper that tumble down the hero and burn in the fire — the things clients leave behind with BOTZ. Leave empty to turn the effect off.',
      },
      fields: [{ name: 'text', type: 'text', localized: true, required: true, maxLength: 28 }],
    },
    blockSettings,
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Text', plural: 'Text sections' },
  interfaceName: 'RichTextBlock',
  fields: [eyebrow, heading(), { name: 'content', type: 'richText', localized: true }, blockSettings],
}

export const SplitTextBlock: Block = {
  slug: 'split',
  labels: { singular: 'Statement + text', plural: 'Statement + text' },
  interfaceName: 'SplitBlock',
  fields: [
    eyebrow,
    { name: 'statement', type: 'textarea', localized: true, required: true, admin: { description: 'Large statement. Use *asterisks* for orange words.' } },
    { name: 'body', type: 'textarea', localized: true },
    {
      name: 'points',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
    buttons,
    blockSettings,
  ],
}

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  labels: { singular: 'Image / video', plural: 'Images / videos' },
  interfaceName: 'MediaBlockType',
  fields: [
    { name: 'media', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', localized: true },
    {
      name: 'aspect',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Original', value: 'auto' },
        { label: '16:9', value: '16/9' },
        { label: '4:3', value: '4/3' },
        { label: 'Square', value: '1/1' },
      ],
    },
    blockSettings,
  ],
}

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: 'Service cards', plural: 'Service cards' },
  interfaceName: 'ServicesBlock',
  fields: [
    eyebrow,
    heading(),
    intro,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', localized: true, required: true, admin: { width: '50%' } },
            {
              name: 'service',
              type: 'select',
              options: categoryOptions,
              admin: { width: '25%', description: 'Used for icon, pricing link and contact routing' },
            },
            { name: 'index', type: 'text', admin: { width: '25%', description: 'Optional label, e.g. 01' } },
          ],
        },
        { name: 'text', type: 'textarea', localized: true },
        {
          name: 'highlights',
          type: 'array',
          maxRows: 6,
          fields: [{ name: 'text', type: 'text', localized: true, required: true }],
        },
        { name: 'link', type: 'group', fields: linkFields({ required: false }) },
      ],
    },
    blockSettings,
  ],
}

export const PackagePreviewBlock: Block = {
  slug: 'packagePreview',
  labels: { singular: 'Package preview', plural: 'Package previews' },
  interfaceName: 'PackagePreviewBlock',
  fields: [
    eyebrow,
    heading(),
    intro,
    {
      name: 'categories',
      type: 'select',
      hasMany: true,
      options: categoryOptions.filter((c) => c.value !== 'addon'),
      admin: { description: 'Which package groups to preview. Empty = all.' },
    },
    { name: 'duration', type: 'select', defaultValue: '12', options: durationOptions, admin: { description: 'Duration used for the “from” price.' } },
    {
      name: 'showGuideLink',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show a “Not sure where to start?” link to the package finder (#guide) at the top',
    },
    { name: 'link', type: 'group', fields: linkFields({ required: false }) },
    blockSettings,
  ],
}

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: { singular: 'Interactive pricing', plural: 'Interactive pricing' },
  interfaceName: 'PricingBlock',
  fields: [
    eyebrow,
    heading(),
    intro,
    {
      type: 'row',
      fields: [
        { name: 'defaultCategory', type: 'select', defaultValue: 'smm', options: categoryOptions, admin: { width: '33%' } },
        { name: 'defaultDuration', type: 'select', defaultValue: '6', options: durationOptions, admin: { width: '33%' } },
        {
          name: 'lockCategory',
          type: 'checkbox',
          admin: { width: '33%', description: 'Hide the category filter (e.g. on the SMM page)' },
        },
      ],
    },
    { name: 'showAddons', type: 'checkbox', defaultValue: true },
    { name: 'showComparison', type: 'checkbox', defaultValue: true },
    { name: 'showTerms', type: 'checkbox', defaultValue: true, label: 'Show general package terms' },
    blockSettings,
  ],
}

export const ComparisonBlock: Block = {
  slug: 'comparison',
  labels: { singular: 'Package comparison', plural: 'Package comparisons' },
  interfaceName: 'ComparisonBlock',
  fields: [
    eyebrow,
    heading(),
    intro,
    { name: 'category', type: 'select', defaultValue: 'smm', options: categoryOptions.filter((c) => c.value !== 'addon') },
    {
      name: 'packageKeys',
      type: 'text',
      hasMany: true,
      admin: { description: 'Optional: 2–3 package keys (e.g. smm-start). Empty = first packages of the category.' },
    },
    { name: 'defaultDuration', type: 'select', defaultValue: '6', options: durationOptions },
    blockSettings,
  ],
}

export const ProcessBlock: Block = {
  slug: 'process',
  labels: { singular: 'Process steps', plural: 'Process steps' },
  interfaceName: 'ProcessBlock',
  fields: [
    eyebrow,
    heading(),
    intro,
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
    blockSettings,
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  interfaceName: 'FaqBlock',
  fields: [
    eyebrow,
    heading(),
    intro,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', localized: true, required: true },
        { name: 'answer', type: 'textarea', localized: true, required: true },
        { name: 'openByDefault', type: 'checkbox', defaultValue: false, label: 'Open by default' },
      ],
    },
    { name: 'structuredData', type: 'checkbox', defaultValue: true, label: 'Add FAQ structured data for search engines' },
    blockSettings,
  ],
}

export const ContactBlock: Block = {
  slug: 'contact',
  labels: { singular: 'Contact section', plural: 'Contact sections' },
  interfaceName: 'ContactBlock',
  fields: [
    eyebrow,
    heading(),
    intro,
    { name: 'showPeople', type: 'checkbox', defaultValue: true, label: 'Show Mariam / Edgar contact cards' },
    { name: 'showForm', type: 'checkbox', defaultValue: true },
    { name: 'showDirect', type: 'checkbox', defaultValue: true, label: 'Show phone, WhatsApp and email' },
    { name: 'defaultService', type: 'select', options: categoryOptions },
    blockSettings,
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  interfaceName: 'CtaBlock',
  fields: [
    { name: 'heading', type: 'text', localized: true, required: true, admin: { description: 'Use *asterisks* for orange words.' } },
    { name: 'text', type: 'textarea', localized: true },
    buttons,
    blockSettings,
  ],
}

export const GuideBlock: Block = {
  slug: 'guide',
  labels: { singular: 'Find my package guide', plural: 'Find my package guides' },
  interfaceName: 'GuideBlock',
  fields: [eyebrow, heading(), intro, blockSettings],
}

export const CollectionListBlock: Block = {
  slug: 'collectionList',
  labels: { singular: 'Portfolio / testimonials / blog list', plural: 'Collection lists' },
  interfaceName: 'CollectionListBlock',
  admin: { },
  fields: [
    eyebrow,
    heading(),
    intro,
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'caseStudies',
      options: [
        { label: 'Portfolio & case studies', value: 'caseStudies' },
        { label: 'Testimonials', value: 'testimonials' },
        { label: 'Blog posts', value: 'posts' },
      ],
    },
    { name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 24 },
    {
      name: 'note',
      type: 'ui',
      admin: {
        components: {
          Field: '@/admin/components/HiddenUntilPublishedNote#HiddenUntilPublishedNote',
        },
      },
    },
    blockSettings,
  ],
}

export const TeamBlock: Block = {
  slug: 'team',
  labels: { singular: 'Founders (who’s behind BOTZ)', plural: 'Founders sections' },
  interfaceName: 'TeamBlock',
  fields: [
    eyebrow,
    heading(),
    intro,
    {
      name: 'founders',
      type: 'array',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', localized: true, required: true, admin: { width: '40%' } },
            { name: 'role', type: 'text', localized: true, admin: { width: '40%', description: 'e.g. Social media marketing' } },
            { name: 'years', type: 'text', admin: { width: '20%', description: 'Years of experience, e.g. 6' } },
          ],
        },
        { name: 'photo', type: 'upload', relationTo: 'media', admin: { description: 'Square portrait works best. Empty shows a placeholder.' } },
        { name: 'bio', type: 'textarea', localized: true },
        {
          name: 'certifications',
          type: 'array',
          labels: { singular: 'Certification', plural: 'Certifications' },
          fields: [{ name: 'text', type: 'text', localized: true, required: true }],
        },
      ],
    },
    { name: 'pastWorkHeading', type: 'text', localized: true, admin: { description: 'Heading for the optional past-work row.' } },
    {
      name: 'pastWork',
      type: 'array',
      labels: { singular: 'Past project', plural: 'Past work' },
      admin: {
        description:
          'Work done as freelancers or employees. Only items marked “Permission to show” appear; the row is hidden when none do.',
      },
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'text', type: 'textarea', localized: true },
        { name: 'url', type: 'text', admin: { description: 'Optional link (https://…)' } },
        { name: 'permission', type: 'checkbox', defaultValue: false, label: 'Permission to show (from the client or employer)' },
      ],
    },
    blockSettings,
  ],
}

export const SamplesBlock: Block = {
  slug: 'samples',
  labels: { singular: 'Sample deliverables', plural: 'Sample deliverables' },
  interfaceName: 'SamplesBlock',
  fields: [
    eyebrow,
    heading(),
    intro,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'text', type: 'textarea', localized: true },
        {
          type: 'row',
          fields: [
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              admin: { width: '50%', description: 'Upload the PDF here (preferred).' },
            },
            {
              name: 'filePath',
              type: 'text',
              admin: { width: '50%', description: 'Or a file in /public, e.g. /samples/sample-seo-audit.pdf' },
            },
          ],
        },
      ],
    },
    blockSettings,
  ],
}

export const GrowthBlock: Block = {
  slug: 'growth',
  labels: { singular: 'Our own channels (live case study)', plural: 'Our own channels' },
  interfaceName: 'GrowthBlock',
  admin: {},
  fields: [
    eyebrow,
    heading(),
    intro,
    {
      name: 'note',
      type: 'ui',
      admin: { components: { Field: '@/admin/components/Notes#GrowthNote' } },
    },
    blockSettings,
  ],
}

export const OfferBlock: Block = {
  slug: 'offer',
  labels: { singular: 'Founding-client offer banner', plural: 'Offer banners' },
  interfaceName: 'OfferBlock',
  fields: [
    {
      name: 'note',
      type: 'ui',
      admin: { components: { Field: '@/admin/components/Notes#OfferNote' } },
    },
    { name: 'link', type: 'group', fields: linkFields({ required: false }) },
    blockSettings,
  ],
}

export const allBlocks: Block[] = [
  HeroBlock,
  SplitTextBlock,
  RichTextBlock,
  MediaBlock,
  ServicesBlock,
  TeamBlock,
  SamplesBlock,
  GrowthBlock,
  OfferBlock,
  PackagePreviewBlock,
  PricingBlock,
  ComparisonBlock,
  GuideBlock,
  ProcessBlock,
  FaqBlock,
  ContactBlock,
  CtaBlock,
  CollectionListBlock,
]
