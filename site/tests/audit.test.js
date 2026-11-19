import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { auditEmail, pageLink, validateAudit } from '../public/js/forms/audit.js'

const valid = { name: 'Ani', phone: '+374 91 000000', link: '@ani.salon', note: '' }

describe('free audit request', () => {
  it('needs a name, a phone number and the page to look at', () => {
    assert.deepEqual(validateAudit(valid), {})
    assert.deepEqual(validateAudit({ name: '', phone: '', link: '' }), {
      name: 'required',
      phone: 'required',
      link: 'required',
    })
  })

  it('says when the phone number or the page cannot be right', () => {
    const errors = validateAudit({ ...valid, phone: 'call me', link: 'my salon page' })
    assert.deepEqual(errors, { phone: 'invalidPhone', link: 'invalidLink' })
  })

  it('accepts an Instagram handle, a bare domain or a full address', () => {
    for (const link of ['@botz', 'botz.am', 'instagram.com/botz', 'https://botz.am/en/']) {
      assert.deepEqual(validateAudit({ ...valid, link }), {}, link)
    }
  })

  it('turns the page into a link the team can open', () => {
    assert.equal(pageLink('@ani.salon'), 'https://www.instagram.com/ani.salon')
    assert.equal(pageLink('botz.am'), 'https://botz.am')
    assert.equal(pageLink('http://example.am/x'), 'http://example.am/x')
  })

  it('becomes an email naming the request, the person and the page', () => {
    const email = auditEmail(valid, { page: '/anvchar-audit/', language: 'hy' })
    assert.equal(email.subject, 'Free audit request: Ani · @ani.salon')
    assert.equal(email.fields['Page to audit'], 'https://www.instagram.com/ani.salon')
    assert.equal(email.fields['What worries them'], '—')
    assert.equal(email.fields.Language, 'HY')
  })
})
