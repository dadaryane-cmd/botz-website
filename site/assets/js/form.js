/*
 * Contact section: the two founders, direct contacts and the inquiry form.
 * The form is emailed to site.formEmail (data.js) through FormSubmit (https://formsubmit.co),
 * so the site needs no server of its own.
 */
(function () {
  'use strict'

  const B = window.BOTZ
  const { h, tr, ui } = B
  const SERVICES = ['smm', 'seo', 'bundle', 'website', 'addon', 'other']

  const site = () => B.data.site
  const telHref = () => 'tel:' + site().phoneE164

  B.blocks.contact = (block) =>
    B.section(
      block,
      B.heading(block.heading),
      block.intro ? h('p', { class: 'lead' }, tr(block.intro)) : null,
      h(
        'div',
        { class: 'contact-layout' },
        h('div', { class: 'contact-side' }, block.showPeople ? people() : null, block.showDirect ? direct() : null),
        block.showForm ? form(block) : null,
      ),
    )

  function people() {
    return h(
      'div',
      { class: 'people' },
      B.data.people.map((p) => {
        const name = tr(p.name)
        const services = p.services.filter((s) => s !== 'addon' && s !== 'bundle').map((s) => ui('services', s)).join(', ')
        const greeting = ui('whatsapp', 'greeting', { contact: name })
        return h(
          'article',
          { class: 'card person-card' },
          h('span', { class: 'avatar', 'aria-hidden': 'true' }, name.charAt(0)),
          h(
            'div',
            null,
            h('h3', null, name),
            h('p', { class: 'muted' }, tr(p.role)),
            h('p', { class: 'small' }, ui('contact', 'handles', { services })),
            h(
              'div',
              { class: 'btn-row' },
              h('a', { class: 'btn btn-secondary btn-small', href: telHref() }, ui('contact', 'call')),
              h('a', { class: 'btn btn-secondary btn-small', href: B.whatsappUrl(greeting), target: '_blank', rel: 'noopener' }, ui('contact', 'whatsapp')),
            ),
          ),
        )
      }),
      h('p', { class: 'muted small' }, ui('contact', 'eitherContact')),
    )
  }

  function direct() {
    return h(
      'ul',
      { class: 'direct' },
      h('li', null, h('span', { class: 'label' }, ui('contact', 'phoneLabel')), h('a', { href: telHref() }, site().phoneDisplay)),
      h('li', null, h('span', { class: 'label' }, ui('contact', 'whatsapp')), h('a', { href: B.whatsappUrl(''), target: '_blank', rel: 'noopener' }, site().phoneDisplay)),
      h('li', null, h('span', { class: 'label' }, ui('contact', 'email')), h('a', { href: 'mailto:' + site().email }, site().email)),
      h('li', { class: 'muted small' }, ui('contact', 'sharedLine')),
    )
  }

  /* ---------- the form ---------- */

  function form(block) {
    const uid = 'f' + Math.random().toString(36).slice(2, 7)
    const sel = B.selection()
    const pkg = sel.packageKey ? B.findPackage(sel.packageKey) : null
    const defaultService = pkg?.category || (Object.keys(sel.addons || {}).length ? 'addon' : null) || block.defaultService || ''

    const errors = {}
    const field = (name, label, control, hint) =>
      h(
        'div',
        { class: `field${name === 'message' || name === 'name' ? ' full' : ''}` },
        h('label', { for: `${uid}-${name}` }, label),
        control,
        hint ? h('span', { class: 'hint' }, hint) : null,
        (errors[name] = h('span', { class: 'field-error', id: `${uid}-${name}-err` })),
      )
    const input = (name, attrs) => h('input', { id: `${uid}-${name}`, name, 'aria-describedby': `${uid}-${name}-err`, ...attrs })

    const serviceSelect = h(
      'select',
      { id: `${uid}-service`, name: 'service', 'aria-describedby': `${uid}-service-err`, onchange: () => suggestContact() },
      h('option', { value: '' }, ui('form', 'choose')),
      SERVICES.map((s) => h('option', { value: s, selected: s === defaultService }, ui('services', s))),
    )
    const message = h('textarea', { id: `${uid}-message`, name: 'message', rows: 5, maxlength: 4000, placeholder: ui('form', 'messagePlaceholder'), 'aria-describedby': `${uid}-message-err` })
    if (sel.note) message.value = sel.note

    const contactChoices = [...B.data.people.map((p) => ({ value: p.key, label: tr(p.name) })), { value: 'either', label: ui('form', 'either') }]
    const contactGroup = h(
      'fieldset',
      { class: 'full radios' },
      h('legend', null, ui('form', 'preferredContact')),
      contactChoices.map((c) => h('label', { class: 'option' }, h('input', { type: 'radio', name: 'preferredContact', value: c.value }), h('span', null, c.label))),
    )
    function suggestContact() {
      const routed = B.peopleFor(serviceSelect.value)
      const value = routed.length === 1 ? routed[0].key : 'either'
      contactGroup.querySelector(`input[value="${value}"]`).checked = true
    }

    // Attached estimate, removable.
    const attached = h('div', { class: 'attached' })
    const renderAttached = () => {
      const text = B.quoteText()
      attached.replaceChildren(
        ...(text
          ? [
              h('span', { class: 'label' }, ui('form', 'selectedEstimate')),
              h('pre', null, text),
              h('button', { type: 'button', class: 'btn btn-link btn-small', onclick: () => B.setSelection({ packageKey: null, addons: {} }) }, ui('form', 'removeEstimate')),
            ]
          : []),
      )
    }
    renderAttached()

    const status = h('div', { class: 'form-status', role: 'status', tabindex: '-1' })
    const submit = h('button', { type: 'submit', class: 'btn btn-primary' }, ui('form', 'submit'))

    const el = h(
      'form',
      { class: 'card form', novalidate: true },
      h('h3', null, ui('form', 'title')),
      h(
        'div',
        { class: 'form-grid' },
        field('name', ui('form', 'name'), input('name', { autocomplete: 'name', maxlength: 120, required: true })),
        field('email', ui('form', 'email'), input('email', { type: 'email', autocomplete: 'email', inputmode: 'email', maxlength: 200 })),
        field('phone', ui('form', 'phone'), input('phone', { type: 'tel', autocomplete: 'tel', maxlength: 40 })),
        h('p', { class: 'hint full' }, ui('form', 'contactHint')),
        field('service', ui('form', 'service'), serviceSelect),
        contactGroup,
        field('message', ui('form', 'message'), message),
      ),
      // Honeypot: people never see or fill this; bots often do.
      h('div', { class: 'hp', 'aria-hidden': 'true' }, h('label', null, ui('form', 'honeypot'), h('input', { name: 'website', tabindex: '-1', autocomplete: 'off' }))),
      attached,
      h('p', { class: 'muted small' }, ui('form', 'privacy'), ' ', ui('trust', 'replyTime')),
      submit,
      status,
    )
    suggestContact()
    B.onSelection(el, renderAttached)

    // Clear a field's error as soon as it is edited.
    el.addEventListener('input', (event) => {
      const name = event.target.name === 'phone' ? 'email' : event.target.name
      if (errors[name]) errors[name].textContent = ''
      if (name === 'email' && errors.phone) errors.phone.textContent = ''
      event.target.removeAttribute('aria-invalid')
    })

    el.addEventListener('submit', async (event) => {
      event.preventDefault()
      const values = Object.fromEntries(new FormData(el))
      for (const k of ['name', 'email', 'phone', 'message']) values[k] = String(values[k] || '').trim()

      const errs = validate(values)
      for (const [name, span] of Object.entries(errors)) {
        span.textContent = errs[name] ? ui('form', errs[name]) : ''
        el.querySelector(`[name="${name}"]`)?.setAttribute('aria-invalid', errs[name] ? 'true' : 'false')
      }
      if (Object.keys(errs).length) {
        showStatus('error', ui('form', 'errorValidation'))
        el.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus()
        return
      }

      const contactKey = values.preferredContact
      const contactName = tr(B.data.people.find((p) => p.key === contactKey)?.name) || ui('form', 'teamName')
      if (values.website) return success(contactName) // a bot filled the honeypot: pretend it worked

      submit.disabled = true
      submit.textContent = ui('form', 'sending')
      status.textContent = ''
      try {
        await send(values, contactName)
        success(contactName)
      } catch {
        submit.disabled = false
        submit.textContent = ui('form', 'submit')
        showStatus('error', ui('form', 'errorGeneric'), fallbackLinks(values))
      }
    })

    function showStatus(kind, text, extra) {
      status.className = `form-status is-${kind}`
      status.replaceChildren(h('p', null, text), extra || '')
      status.focus()
    }

    function success(contactName) {
      B.setSelection({ packageKey: null, addons: {}, note: null })
      const done = h(
        'div',
        { class: 'card form form-success', role: 'status', tabindex: '-1' },
        h('p', { class: 'big' }, ui('form', 'successTitle')),
        h('p', { class: 'muted' }, ui('form', 'successText', { name: contactName })),
      )
      el.replaceWith(done)
      done.focus()
    }

    return el
  }

  function validate(v) {
    const errs = {}
    if (v.name.length < 2) errs.name = 'required'
    if (!v.email && !v.phone) errs.email = 'needEmailOrPhone'
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errs.email = 'invalidEmail'
    if (v.phone && !/^\+?[0-9 ()-]{6,20}$/.test(v.phone)) errs.phone = 'invalidPhone'
    if (!v.service) errs.service = 'required'
    if (v.message.length < 5) errs.message = 'messageTooShort'
    return errs
  }

  function emailText(v, contactName) {
    return {
      _subject: `New inquiry: ${v.name} · ${ui('services', v.service)}`,
      _template: 'table',
      _captcha: 'false',
      ...(v.email ? { _replyto: v.email } : {}),
      Name: v.name,
      Email: v.email || '—',
      Phone: v.phone || '—',
      Service: ui('services', v.service),
      'Preferred contact': contactName,
      Message: v.message,
      Estimate: B.quoteText() || '—',
      Page: location.pathname.split('/').pop() || 'index.html',
      Language: B.lang().toUpperCase(),
    }
  }

  async function send(v, contactName) {
    const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(site().formEmail), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(emailText(v, contactName)),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok || String(body.success) !== 'true') throw new Error(body.message || 'Send failed')
  }

  /** If sending fails, offer to send the same text by email app or WhatsApp. */
  function fallbackLinks(v) {
    const text = [v.message, B.quoteText(), `${v.name} · ${v.email || ''} ${v.phone || ''}`].filter(Boolean).join('\n\n')
    const mailto = `mailto:${site().formEmail}?subject=${encodeURIComponent('Inquiry: ' + v.name)}&body=${encodeURIComponent(text)}`
    return h(
      'div',
      { class: 'btn-row' },
      h('a', { class: 'btn btn-secondary btn-small', href: mailto }, ui('contact', 'email')),
      h('a', { class: 'btn btn-secondary btn-small', href: B.whatsappUrl(text), target: '_blank', rel: 'noopener' }, ui('contact', 'whatsapp')),
    )
  }
})()
