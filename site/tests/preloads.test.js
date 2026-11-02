import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { LANGUAGES } from '../public/js/config.js'
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

describe('head.js (runs before the page paints)', () => {
  const script = readFileSync(join(PUBLIC_DIR, 'js/head.js'), 'utf8')

  it('knows the same languages as the site', () => {
    const listed = script.match(/const LANGUAGES = \[([^\]]+)\]/)[1].match(/\w+/g)
    assert.deepEqual(listed, LANGUAGES)
  })

  it('loads only fonts the site declares, for every language', () => {
    const declared = readFileSync(join(PUBLIC_DIR, 'css/base/fonts.css'), 'utf8')
    const list = script.match(/const FIRST_SCREEN_FONTS = \{([\s\S]+?)\n {2}\}/)[1]
    for (const language of LANGUAGES) {
      const entry = list.match(new RegExp(`${language}: \\[([\\s\\S]+?)\\n {4}\\]`))
      assert.ok(entry, `no fonts listed for ${language}`)
      for (const [, family] of entry[1].matchAll(/\['([^']+)'/g)) {
        assert.ok(declared.includes(`font-family: '${family}'`), `${language}: ${family}`)
      }
    }
  })
})
