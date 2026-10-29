/**
 * Writes the Pages CMS configuration (cms/config.js) to /.pages.yml at the repository root.
 * Run after changing cms/config.js or adding interface texts: `npm run cms`.
 */
import { writeFileSync } from 'node:fs'
import { pagesConfig } from '../cms/config.js'
import { toYaml } from '../cms/yaml.js'

export const CONFIG_FILE = new URL('../../.pages.yml', import.meta.url)

export const renderConfig = () =>
  `# Generated from site/cms/config.js by \`npm run cms\` — edit that file, not this one.\n${toYaml(pagesConfig)}`

if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileSync(CONFIG_FILE, renderConfig())
  console.log('Wrote .pages.yml')
}
