/**
 * A phone or WhatsApp number as people type it: digits with spaces, brackets or dashes, and an
 * optional + in front ("+374 91 003099", "(091) 00-30-99").
 */
const PHONE = /^\+?[0-9 ()-]{6,20}$/

export const isPhone = (value) => PHONE.test(value)
