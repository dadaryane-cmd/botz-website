import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { auditEmail } from '../public/js/forms/audit.js'
import { estimateRequestEmail } from '../public/js/forms/estimate-request.js'
import { inquiryEmail } from '../public/js/forms/inquiry.js'
import { hubspotBody, isHubspotSetUp } from '../public/js/services/hubspot.js'

const context = { pageUri: 'https://example.com/en/', pageName: 'BOTZ' }
const contact = (name, value) => ({ objectTypeId: '0-1', name, value })
const property = (body, name) => body.fields.find((field) => field.name === name)?.value

describe('HubSpot', () => {
  it('is used only once both ids are filled in', () => {
    assert.equal(isHubspotSetUp({ hubspotPortalId: '123', hubspotFormId: 'abc' }), true)
    assert.equal(isHubspotSetUp({ hubspotPortalId: '123' }), false)
    assert.equal(isHubspotSetUp({}), false)
  })

  it('makes an inquiry a contact, with the rest of it as the message', () => {
    const email = inquiryEmail(
      { name: 'Ani', contact: '+374 91 123456', service: 'seo', message: 'More visitors' },
      { serviceLabel: 'SEO', contactName: 'Edgar', estimate: '', page: '/en/', language: 'en' },
    )
    const body = hubspotBody(email, context)
    assert.deepEqual(body.fields.slice(0, 2), [
      contact('firstname', 'Ani'),
      contact('phone', '+374 91 123456'),
    ])
    // No email was given, so none is sent (an empty one would be refused).
    assert.equal(property(body, 'email'), undefined)
    assert.equal(
      property(body, 'message'),
      [
        'New inquiry: Ani · SEO',
        'Service: SEO',
        'Preferred contact: Edgar',
        'Message: More visitors',
        'Page: /en/',
        'Language: EN',
      ].join('\n'),
    )
    assert.deepEqual(body.context, context)
  })

  it('takes the email address when the visitor gave one', () => {
    const email = inquiryEmail(
      { name: 'Ani', contact: 'ani@example.com', service: 'smm', message: '' },
      { serviceLabel: 'SMM', contactName: 'Mariam', estimate: '', page: '/', language: 'hy' },
    )
    assert.equal(property(hubspotBody(email, context), 'email'), 'ani@example.com')
  })

  it('reads the phone from the audit and estimate requests too', () => {
    const audit = auditEmail(
      { name: 'Ani', phone: '091 123456', link: '@cafe', note: '' },
      { page: '/audit', language: 'ru' },
    )
    assert.equal(property(hubspotBody(audit, context), 'phone'), '091 123456')
    assert.match(property(hubspotBody(audit, context), 'message'), /Page to audit: https:\/\//)

    const estimate = estimateRequestEmail('091 123456', {
      summary: 'SMM Pro',
      link: 'https://example.com/pricing',
      page: '/pricing',
      language: 'en',
    })
    const body = hubspotBody(estimate, context)
    assert.equal(property(body, 'phone'), '091 123456')
    assert.equal(property(body, 'firstname'), undefined)
  })
})
