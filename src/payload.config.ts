import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig, type Plugin } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { editors } from './access'
import { Estimates } from './collections/Estimates'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { CaseStudies, Posts, Testimonials } from './collections/Showcase'
import { Users } from './collections/Users'
import { inquiryEndpoint, inquiryTokenEndpoint } from './endpoints/inquiry'
import { GrowthOffer } from './globals/GrowthOffer'
import { Navigation } from './globals/Navigation'
import { PackageGuide } from './globals/PackageGuide'
import { PricingCatalog } from './globals/PricingCatalog'
import { SiteSettings } from './globals/SiteSettings'
import { Theme } from './globals/Theme'
import { UiStringsGlobals } from './globals/UiStrings'
import { revalidateCollection } from './hooks/revalidate'
import { defaultLocale, localeLabels, locales } from './i18n/config'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const plugins: Plugin[] = [
  seoPlugin({
    collections: ['pages', 'posts', 'case-studies'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle: ({ doc }) => `${(doc as { title?: string })?.title ?? ''} — BOTZ`,
    generateURL: ({ doc, locale }) => `${serverURL}/${locale ?? defaultLocale}/${(doc as { slug?: string })?.slug ?? ''}`,
    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: 'noindex',
        type: 'checkbox',
        label: 'Hide from search engines (noindex)',
      },
      {
        name: 'canonical',
        type: 'text',
        label: 'Canonical URL override',
        admin: { description: 'Leave empty: each language version points to itself.' },
      },
    ],
  }),
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      admin: { group: 'Website', description: 'Old addresses that forward to new ones. Created automatically when a published page changes its address.' },
      access: { read: editors, create: editors, update: editors, delete: editors },
      hooks: { afterChange: [revalidateCollection] },
    },
  }),
]

if (process.env.S3_BUCKET) {
  plugins.push(
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET,
      config: {
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT || undefined,
        forcePathStyle: Boolean(process.env.S3_ENDPOINT),
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  )
}

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · BOTZ Admin', icons: [{ rel: 'icon', url: '/favicon.ico' }] },
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      graphics: {
        Logo: '@/admin/components/Brand#AdminLogo',
        Icon: '@/admin/components/Brand#AdminIcon',
      },
      beforeDashboard: ['@/admin/components/Dashboard#Dashboard'],
      afterNavLinks: ['@/admin/components/NavLinks#NavLinks'],
      views: {
        translations: { Component: '@/admin/views/Translations#TranslationsView', path: '/translations' },
        help: { Component: '@/admin/views/Help#HelpView', path: '/help' },
      },
    },
    livePreview: {
      collections: ['pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Pages, Media, CaseStudies, Testimonials, Posts, Leads, Estimates, Users],
  globals: [PricingCatalog, PackageGuide, SiteSettings, Theme, Navigation, GrowthOffer, ...UiStringsGlobals],
  localization: {
    locales: locales.map((code) => ({ code, label: localeLabels[code] })),
    defaultLocale,
    fallback: false,
  },
  endpoints: [inquiryEndpoint, inquiryTokenEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  csrf: [serverURL],
  cors: [serverURL],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./data/botz.db',
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    },
    // Development syncs the schema automatically; production applies committed migrations on start.
    push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_DB_PUSH !== 'false',
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'no-reply@localhost',
        defaultFromName: process.env.SMTP_FROM_NAME || 'BOTZ Website',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        },
      })
    : undefined,
  upload: { limits: { fileSize: 50 * 1024 * 1024 } },
  sharp,
  plugins,
  telemetry: false,
})
