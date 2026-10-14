import type { Field, GlobalBeforeChangeHook, GlobalConfig } from 'payload'
import { APIError } from 'payload'
import { editors } from '@/access'
import { colorField } from '@/fields/shared'
import { revalidateGlobal } from '@/hooks/revalidate'
import { contrast } from '@/lib/color'

export const themeDefaults = {
  light: {
    bg: '#FDF6EC',
    surface: '#F4EADB',
    text: '#141414',
    muted: '#5C5650',
    border: '#E0D3C0',
    accent: '#FF4F0F',
    accentText: '#B83300',
    onAccent: '#141414',
    inverseBg: '#0E0E0F',
    inverseText: '#FDF6EC',
  },
  dark: {
    bg: '#0E0E0F',
    surface: '#1A1A1C',
    text: '#F7F2EA',
    muted: '#ABA49B',
    border: '#2E2D2F',
    accent: '#FF5A1F',
    accentText: '#FF7A45',
    onAccent: '#0E0E0F',
    inverseBg: '#FDF6EC',
    inverseText: '#141414',
  },
}

const palette = (mode: 'light' | 'dark'): Field => {
  const d = themeDefaults[mode]
  return {
    name: mode,
    type: 'group',
    label: mode === 'light' ? 'Light theme colours' : 'Dark theme colours',
    fields: [
      { type: 'row', fields: [colorField('bg', 'Background', d.bg), colorField('surface', 'Soft surface', d.surface), colorField('border', 'Lines', d.border)] },
      { type: 'row', fields: [colorField('text', 'Text', d.text), colorField('muted', 'Secondary text', d.muted), colorField('accent', 'Brand orange (fills)', d.accent)] },
      {
        type: 'row',
        fields: [
          colorField('accentText', 'Orange for text', d.accentText, 'Orange used for words on the background; must stay readable.'),
          colorField('onAccent', 'Text on orange', d.onAccent),
          colorField('inverseBg', 'Inverse section background', d.inverseBg),
        ],
      },
      { type: 'row', fields: [colorField('inverseText', 'Inverse section text', d.inverseText)] },
    ],
  }
}

/** Refuse colour combinations that would make text unreadable (WCAG AA, 4.5:1; 3:1 for large accent words). */
const checkContrast: GlobalBeforeChangeHook = ({ data }) => {
  const problems: string[] = []
  for (const mode of ['light', 'dark'] as const) {
    const p = { ...themeDefaults[mode], ...(data?.[mode] ?? {}) }
    const pairs: [string, string, string, number][] = [
      ['Text on background', p.text, p.bg, 4.5],
      ['Text on soft surface', p.text, p.surface, 4.5],
      ['Secondary text on background', p.muted, p.bg, 4.5],
      ['Orange text on background', p.accentText, p.bg, 3],
      ['Text on orange', p.onAccent, p.accent, 4.5],
      ['Inverse text', p.inverseText, p.inverseBg, 4.5],
    ]
    for (const [label, fg, bg, min] of pairs) {
      const ratio = contrast(fg, bg)
      if (ratio < min) problems.push(`${mode} theme – ${label}: contrast ${ratio.toFixed(2)}:1 (needs ${min}:1)`)
    }
  }
  if (problems.length) throw new APIError(`Colours are not readable enough: ${problems.join(' • ')}`, 400)
  return data
}

export const fontOptions = {
  display: [
    { label: 'Unbounded (wide, bold — default)', value: 'unbounded' },
    { label: 'Manrope ExtraBold', value: 'manrope' },
    { label: 'Noto Sans Black', value: 'noto' },
  ],
  body: [
    { label: 'Manrope (default)', value: 'manrope' },
    { label: 'Golos Text', value: 'golos' },
    { label: 'Noto Sans', value: 'noto' },
  ],
}

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Design & brand',
  admin: { group: 'Website', description: 'Logos, colours for both themes, fonts, buttons and animation.' },
  access: { read: ({ req }) => Boolean(req.user), update: editors, readVersions: editors },
  versions: { max: 30 },
  hooks: { beforeChange: [checkContrast], afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'logos',
          label: 'Logos',
          description: 'Leave empty to use the supplied BOTZ logos. Uploads replace them everywhere.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'logoLight', type: 'upload', relationTo: 'media', label: 'Logo for light theme', admin: { width: '50%' } },
                { name: 'logoDark', type: 'upload', relationTo: 'media', label: 'Logo for dark theme', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'mark', type: 'upload', relationTo: 'media', label: 'B mark (mobile & hero)', admin: { width: '50%' } },
                { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon (square PNG, 512×512)', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Colours',
          fields: [
            {
              name: 'defaultMode',
              type: 'select',
              defaultValue: 'system',
              label: 'Theme for new visitors',
              options: [
                { label: 'Follow device setting', value: 'system' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ],
              admin: { description: 'Visitors can switch any time; their choice is remembered.' },
            },
            palette('light'),
            palette('dark'),
          ],
        },
        {
          name: 'type',
          label: 'Typography & shapes',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'displayFont', type: 'select', defaultValue: 'unbounded', options: fontOptions.display, admin: { width: '50%' } },
                { name: 'bodyFont', type: 'select', defaultValue: 'manrope', options: fontOptions.body, admin: { width: '50%' } },
              ],
            },
            {
              name: 'fontNote',
              type: 'ui',
              admin: {
                components: { Field: '@/admin/components/Notes#FontNote' },
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'headingScale',
                  type: 'select',
                  defaultValue: 'xl',
                  options: [
                    { label: 'Calm', value: 'md' },
                    { label: 'Large', value: 'lg' },
                    { label: 'Oversized', value: 'xl' },
                  ],
                  admin: { width: '33%' },
                },
                { name: 'buttonRadius', type: 'number', defaultValue: 999, min: 0, max: 999, admin: { width: '33%', description: 'px (999 = pill)' } },
                { name: 'cardRadius', type: 'number', defaultValue: 28, min: 0, max: 48, admin: { width: '33%', description: 'px' } },
              ],
            },
            {
              name: 'buttonStyle',
              type: 'select',
              defaultValue: 'solid',
              options: [
                { label: 'Solid orange', value: 'solid' },
                { label: 'Solid dark / light', value: 'contrast' },
              ],
            },
          ],
        },
        {
          name: 'motion',
          label: 'Animation',
          fields: [
            {
              name: 'intensity',
              type: 'select',
              required: true,
              defaultValue: 'expressive',
              options: [
                { label: 'Off', value: 'off' },
                { label: 'Subtle', value: 'subtle' },
                { label: 'Expressive', value: 'expressive' },
              ],
              admin: { description: 'Visitors who ask their device for reduced motion always get no animation.' },
            },
          ],
        },
      ],
    },
  ],
}
