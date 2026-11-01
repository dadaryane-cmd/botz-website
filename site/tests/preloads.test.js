import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { moduleGraph, PUBLIC_DIR, sitePages, withPreloads } from '../scripts/build-preloads.js'

describe('preloads', () => {
  const modules = moduleGraph()

  it('finds the whole module graph of main.js', () => {
    assert.ok(modules.includes('js/content/index.js'))
    assert.ok(modules.includes('js/components/flame/shaders.js'), 'nested imports are followed')
    for (const file of modules) assert.ok(existsSync(join(PUBLIC_DIR, file)), `missing ${file}`)
  })

  for (const file of sitePages()) {
    it(`${file} preloads its content and modules (run \`npm run preload\` after changes)`, () => {
      const html = readFileSync(join(PUBLIC_DIR, file), 'utf8')
      assert.equal(html, withPreloads(html, modules))
    })
  }
})
