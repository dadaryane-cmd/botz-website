import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { describe, it } from 'node:test'

// Published at the site's root by the build (scripts/build-site.js), exactly as written here.
const folder = new URL('../verification/', import.meta.url)
const files = existsSync(folder) ? readdirSync(folder) : []

describe('search engine verification files', () => {
  for (const file of files.filter((name) => name.startsWith('google'))) {
    it(`${file} holds the line Google checks for`, () => {
      assert.match(file, /^google[0-9a-f]+\.html$/)
      const text = readFileSync(new URL(file, folder), 'utf8').trim()
      assert.equal(text, `google-site-verification: ${file}`)
    })
  }
})
