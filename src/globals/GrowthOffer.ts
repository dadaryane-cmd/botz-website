import type { GlobalConfig } from 'payload'
import { editors } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

/**
 * One place for the numbers that change: the founding-client offer (switch it off once the spots
 * are taken) and BOTZ's own channel metrics, updated monthly. Empty numbers show as “[X]”
 * placeholders on the site, so nothing is ever invented.
 */
export const GrowthOffer: GlobalConfig = {
  slug: 'growth-offer',
  label: 'Growth & offer',
  admin: {
    group: 'Website',
    description: 'Founding-client offer (on/off, spots, discount) and our own channel numbers. Update the numbers monthly.',
  },
  access: { read: ({ req }) => Boolean(req.user), update: editors, readVersions: editors },
  versions: { max: 30 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'offer',
          label: 'Founding-client offer',
          description: 'Shown as a banner near the packages, a badge on package cards and a card in the home hero.',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true, label: 'Show the offer (untick once all spots are taken)' },
            {
              type: 'row',
              fields: [
                { name: 'spots', type: 'number', defaultValue: 5, min: 1, admin: { width: '25%', description: 'Number of founding spots' } },
                { name: 'discount', type: 'number', min: 1, max: 100, admin: { width: '25%', description: 'Discount in %. Empty shows “[X]”.' } },
                { name: 'months', type: 'number', defaultValue: 3, min: 1, admin: { width: '25%', description: 'How many months the discount lasts' } },
                { name: 'spotsLeft', type: 'number', min: 0, admin: { width: '25%', description: 'Spots still open' } },
              ],
            },
            { name: 'showSpotsLeft', type: 'checkbox', defaultValue: false, label: 'Show “N of 5 spots left”' },
            { name: 'showAudit', type: 'checkbox', defaultValue: true, label: 'Mention the free 20-minute audit' },
            { name: 'showTrial', type: 'checkbox', defaultValue: true, label: 'Mention the 1-month starting term' },
          ],
        },
        {
          name: 'growth',
          label: 'Our own channels',
          description: 'Real numbers for BOTZ’s own Instagram and website (the “We grow BOTZ the same way” section).',
          fields: [
            { name: 'lastUpdated', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
            {
              name: 'metrics',
              type: 'array',
              labels: { singular: 'Metric', plural: 'Metrics' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'channel',
                      type: 'select',
                      required: true,
                      defaultValue: 'instagram',
                      options: [
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'Website', value: 'website' },
                      ],
                      admin: { width: '25%' },
                    },
                    { name: 'label', type: 'text', localized: true, required: true, admin: { width: '45%', description: 'e.g. Followers' } },
                    { name: 'value', type: 'text', required: true, admin: { width: '30%', description: 'e.g. 1,240 — or [placeholder]' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
