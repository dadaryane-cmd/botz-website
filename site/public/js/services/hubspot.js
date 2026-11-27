import { HUBSPOT_FORMS_ENDPOINT } from '../config.js'
import { postJson } from './post-json.js'

/** HubSpot's code for contacts: each field below is a contact property. */
const CONTACT = '0-1'

/** The email rows that hold the visitor's name, email and phone (js/forms/*.js). */
const NAME_ROW = 'Name'
const EMAIL_ROWS = ['Email']
const PHONE_ROWS = ['Phone', 'Phone / WhatsApp']
const EMPTY = '—'

/** HubSpot is used once both ids are filled in (content/site.json, Pages CMS → Contact details). */
export const isHubspotSetUp = (site) => Boolean(site.hubspotPortalId && site.hubspotFormId)

const firstFilled = (fields, names) =>
  names.map((name) => fields[name]).find((value) => value && value !== EMPTY) ?? ''

/**
 * An inquiry email (js/forms/inquiry.js, audit.js, estimate-request.js) as a HubSpot form
 * submission (developers.hubspot.com, Forms API v3): the name, email and phone become the
 * contact's own properties, and everything else (service, message, estimate, page…) goes into
 * its message, one "Row: value" line each, under the email's subject.
 */
export function hubspotBody({ subject, fields }, { pageUri, pageName }) {
  const name = firstFilled(fields, [NAME_ROW])
  const email = firstFilled(fields, EMAIL_ROWS)
  const phone = firstFilled(fields, PHONE_ROWS)
  const contactRows = [NAME_ROW, ...EMAIL_ROWS, ...PHONE_ROWS]
  const details = Object.entries(fields)
    .filter(([row, value]) => !contactRows.includes(row) && value && value !== EMPTY)
    .map(([row, value]) => `${row}: ${value}`)

  const properties = [
    ['firstname', name],
    ['email', email],
    ['phone', phone],
    ['message', [subject, ...details].join('\n')],
  ]
  return {
    fields: properties
      .filter(([, value]) => value)
      .map(([property, value]) => ({ objectTypeId: CONTACT, name: property, value })),
    context: { pageUri, pageName },
  }
}

/** Add `email` to HubSpot as a contact with its message; throws when HubSpot turns it down. */
export async function sendToHubspot(site, email) {
  const url = `${HUBSPOT_FORMS_ENDPOINT}/${site.hubspotPortalId}/${site.hubspotFormId}`
  const body = hubspotBody(email, { pageUri: location.href, pageName: document.title })
  const { ok, status, result } = await postJson(url, body)
  if (!ok) throw new Error(result.message || `HubSpot responded ${status}`)
}
