import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { pagesConfig } from '../cms/config.js'
import { CONFIG_FILE, renderConfig } from '../scripts/build-cms-config.js'

const repoRoot = new URL('../../', import.meta.url)

/** A field with its `component` reference replaced by the component's definition. */
function resolve(field) {
  if (!field.component) return field
  const { component, ...overrides } = field
  return resolve({ ...pagesConfig.components[component], ...overrides })
}

/** Fail on any key in `data` that has no field: Pages CMS would drop it on the next save. */
function assertDeclared(data, fields, path) {
  for (const [key, value] of Object.entries(data ?? {})) {
    const declared = fields.find((field) => field.name === key)
    assert.ok(declared, `${path}.${key} is not declared in cms/config.js`)
    const field = resolve(declared)
    const items = field.list ? value : [value]
    if (!Array.isArray(items)) assert.fail(`${path}.${key} should be a list`)
    items.forEach((item, index) => {
      const itemPath = field.list ? `${path}.${key}[${index}]` : `${path}.${key}`
      if (field.type === 'object') assertDeclared(item, field.fields, itemPath)
      if (field.type === 'block') {
        const { [field.blockKey]: blockName, ...rest } = item
        const block = field.blocks.find((definition) => definition.name === blockName)
        assert.ok(block, `${itemPath}: unknown block "${blockName}"`)
        assertDeclared(rest, block.fields, `${itemPath}<${blockName}>`)
      }
    })
  }
}

const entries = (items) =>
  items.flatMap((item) => (item.type === 'group' ? entries(item.items) : [item]))

describe('Pages CMS configuration', () => {
  it('.pages.yml matches cms/config.js (run `npm run cms` after changing it)', () => {
    assert.equal(readFileSync(CONFIG_FILE, 'utf8'), renderConfig())
  })

  for (const entry of entries(pagesConfig.content)) {
    it(`declares every field of ${entry.path}`, () => {
      const data = JSON.parse(readFileSync(new URL(entry.path, repoRoot), 'utf8'))
      assertDeclared(data, entry.fields, entry.name)
    })
  }
})
