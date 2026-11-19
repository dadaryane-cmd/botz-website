/**
 * The free audit (section type "audit"): what we look at and what the visitor gets, beside the
 * short request form (js/components/audit-form.js).
 */
import { h } from '../../lib/dom.js'
import { hasText, t, ui } from '../../lib/i18n.js'
import { REVEAL } from '../../lib/reveal.js'
import { renderAuditForm } from '../audit-form.js'
import { heading, lead, section } from './section.js'

export const renderAudit = (config) =>
  section(
    config,
    heading(config.heading),
    lead(config.intro),
    h(
      'div',
      { class: 'audit-layout' },
      h(
        'div',
        { class: 'audit-details', ...REVEAL },
        h('p', { class: 'label' }, ui('audit', 'checksTitle')),
        h(
          'ul',
          { class: 'check-list' },
          (config.checks ?? []).map((text) => h('li', null, t(text))),
        ),
        hasText(config.promise) && [
          h('p', { class: 'label' }, ui('audit', 'promiseTitle')),
          h('p', null, t(config.promise)),
        ],
      ),
      renderAuditForm(),
    ),
  )
