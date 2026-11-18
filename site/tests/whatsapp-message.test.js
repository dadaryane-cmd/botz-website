import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { initLanguage } from '../public/js/lib/i18n.js'
import { whatsappEstimateMessage } from '../public/js/pricing/whatsapp-message.js'

describe('whatsappEstimateMessage', () => {
  it('opens an empty chat when nothing is chosen', () => {
    assert.equal(whatsappEstimateMessage(''), '')
  })

  it('names the chosen package between a greeting and a question, in the page language', () => {
    initLanguage('en/')
    const summary = 'SMM Gold, 6 months — 145,000 ֏ per month'
    assert.equal(
      whatsappEstimateMessage(summary),
      `Hello! I'm interested in:\n${summary}\nCould we discuss it?`,
    )
    initLanguage('')
    assert.match(whatsappEstimateMessage(summary), /^Բարև։ Ինձ հետաքրքրում է՝\nSMM Gold/)
  })
})
