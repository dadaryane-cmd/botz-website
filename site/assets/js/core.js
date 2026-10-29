/*
 * Shared helpers: language, translations, formatting, DOM building and the
 * visitor's package selection (shared by the pricing tool, finder and form).
 */
(function () {
  'use strict'

  const B = window.BOTZ
  const data = B.data

  B.LANGS = ['hy', 'en', 'ru']
  B.LANG_LABELS = { hy: 'Հայ', en: 'Eng', ru: 'Рус' }
  B.DURATIONS = [1, 3, 6, 9, 12]

  /* ---------- storage (may be blocked in private mode) ---------- */

  B.store = {
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem('botz.' + key)
        return v === null ? fallback : JSON.parse(v)
      } catch {
        return fallback
      }
    },
    set(key, value) {
      try {
        localStorage.setItem('botz.' + key, JSON.stringify(value))
      } catch {
        /* ignore */
      }
    },
  }

  /* ---------- language ---------- */

  function initialLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang')
    if (B.LANGS.includes(fromUrl)) {
      B.store.set('lang', fromUrl)
      return fromUrl
    }
    const saved = B.store.get('lang')
    if (B.LANGS.includes(saved)) return saved
    return 'hy'
  }

  let lang = initialLang()
  const langListeners = []

  B.lang = () => lang
  B.setLang = (next) => {
    if (!B.LANGS.includes(next) || next === lang) return
    lang = next
    B.store.set('lang', lang)
    langListeners.forEach((fn) => fn(lang))
  }
  B.onLang = (fn) => langListeners.push(fn)

  /** Pick the current language from an { en, hy, ru } object. */
  B.tr = (value) => {
    if (value == null) return ''
    if (typeof value === 'string') return value
    return value[lang] ?? value.en ?? ''
  }

  /** Replace {name} placeholders. */
  B.fill = (text, vars = {}) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m))

  /** Interface text: B.ui('pricing', 'perMonth', { n: 3 }) */
  B.ui = (group, key, vars) => B.fill(B.tr(data.ui[group]?.[key]) || key, vars)

  /* ---------- formatting ---------- */

  B.amd = (value) => {
    const tag = lang === 'ru' ? 'ru-RU' : 'en-US'
    return new Intl.NumberFormat(tag, { maximumFractionDigits: 0 }).format(Math.round(value)) + ' ֏'
  }

  B.monthsLabel = (n) => (n === 1 ? B.ui('pricing', 'month1') : B.ui('pricing', 'monthsN', { n }))

  /* ---------- DOM ---------- */

  /**
   * Build an element: h('a', { href: '#', class: 'btn' }, 'Text', childNode)
   * Strings become text nodes, so content is never parsed as HTML.
   */
  B.h = (tag, attrs, ...children) => {
    const el = document.createElement(tag)
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value == null || value === false) continue
      if (key === 'class') el.className = value
      else if (key.startsWith('on')) el.addEventListener(key.slice(2), value)
      else if (value === true) el.setAttribute(key, '')
      else el.setAttribute(key, value)
    }
    append(el, children)
    return el
  }

  function append(el, children) {
    for (const child of children.flat(Infinity)) {
      if (child == null || child === false) continue
      el.append(child instanceof Node ? child : document.createTextNode(String(child)))
    }
  }

  /** Text with *highlighted* words, as used in the headings. */
  B.rich = (value) => {
    const frag = document.createDocumentFragment()
    B.tr(value)
      .split(/(\*[^*]+\*)/)
      .forEach((part) => {
        if (/^\*[^*]+\*$/.test(part)) frag.append(B.h('em', null, part.slice(1, -1)))
        else if (part) frag.append(part)
      })
    return frag
  }

  /** Map CMS paths ("/smm", "#contact") to the static files. */
  B.href = (path) => {
    if (!path) return '#'
    if (path.startsWith('#') || /^(https?:|mailto:|tel:)/.test(path)) return path
    const [base, hash] = path.split('#')
    const slug = base.replace(/^\/|\/$/g, '')
    const file = slug === '' ? 'index.html' : slug + '.html'
    return hash ? `${file}#${hash}` : file
  }

  B.currentPage = () => document.documentElement.dataset.page || 'home'

  /** Whether the current page has a section with this anchor (e.g. "contact"). */
  B.hasAnchor = (anchor) => (data.pages[B.currentPage()]?.blocks || []).some((b) => b.anchor === anchor)

  /* ---------- catalog ---------- */

  B.findPackage = (key) => data.packages.find((p) => p.key === key)
  B.findAddon = (key) => data.addons.find((a) => a.key === key)
  B.isRecurring = (pkg) => Boolean(pkg.prices)
  B.availableDurations = (pkg) => (pkg.prices ? B.DURATIONS.filter((d) => typeof pkg.prices['m' + d] === 'number') : [])

  /** Monthly price, total and savings for a term, or null if the term is unavailable. */
  B.priceLine = (pkg, months) => {
    const monthly = pkg.prices?.['m' + months]
    const base = pkg.prices?.m1
    if (typeof monthly !== 'number' || typeof base !== 'number') return null
    return { monthly, months, total: monthly * months, savings: Math.max(0, (base - monthly) * months) }
  }

  B.cheapestMonthly = (pkg) => Math.min(...B.availableDurations(pkg).map((d) => pkg.prices['m' + d]))

  /** People responsible for a service ("smm", "seo", …). */
  B.peopleFor = (service) => data.people.filter((p) => p.services.includes(service))

  /* ---------- the visitor's selection ---------- */

  const emptySelection = () => ({ packageKey: null, duration: 6, addons: {} })
  let selection = Object.assign(emptySelection(), B.store.get('selection') || {})
  const selectionListeners = []

  // A shared estimate link (?pkg=smm-gold&d=6&add=reel:2) replaces the saved selection.
  ;(function readSharedLink() {
    const q = new URLSearchParams(location.search)
    if (!q.has('pkg') && !q.has('add')) return
    const pkg = B.findPackage(q.get('pkg'))
    const d = Number(q.get('d'))
    const addons = {}
    for (const pair of (q.get('add') || '').split(',')) {
      const [key, qty] = pair.split(':')
      if (B.findAddon(key) && Number(qty) >= 1) addons[key] = Math.min(20, Math.floor(Number(qty)))
    }
    selection = { packageKey: pkg ? pkg.key : null, duration: B.DURATIONS.includes(d) ? d : 6, addons }
  })()

  B.selection = () => selection
  B.setSelection = (patch) => {
    selection = { ...selection, ...patch }
    B.store.set('selection', selection)
    selectionListeners.slice().forEach((fn) => fn(selection))
  }
  B.clearSelection = () => B.setSelection(emptySelection())
  /** Subscribe to selection changes; the listener is dropped once `el` leaves the page. */
  B.onSelection = (el, fn) => {
    const listener = (sel) => {
      if (el.isConnected) fn(sel)
      else selectionListeners.splice(selectionListeners.indexOf(listener), 1)
    }
    selectionListeners.push(listener)
  }

  /** Totals for the current selection. */
  B.quote = (sel = selection) => {
    const pkg = sel.packageKey ? B.findPackage(sel.packageKey) : null
    const out = { pkg, line: null, oneTimePackage: 0, addons: [], oneTimeTotal: 0, combined: 0, isMinimum: false }
    if (pkg && B.isRecurring(pkg)) out.line = B.priceLine(pkg, sel.duration)
    if (pkg && !B.isRecurring(pkg)) out.oneTimePackage = pkg.oneTimePrice || 0
    out.oneTimeTotal = out.oneTimePackage
    for (const [key, qty] of Object.entries(sel.addons || {})) {
      const addon = B.findAddon(key)
      if (!addon || qty < 1) continue
      const total = addon.price * qty
      out.addons.push({ addon, qty, total })
      out.oneTimeTotal += total
      if (addon.priceIsFrom) out.isMinimum = true
    }
    out.combined = (out.line ? out.line.total : 0) + out.oneTimeTotal
    out.empty = !pkg && out.addons.length === 0
    return out
  }

  /** One-paragraph plain-text summary (used in the form, WhatsApp and email). */
  B.quoteText = (q = B.quote()) => {
    if (q.empty) return ''
    const lines = []
    if (q.pkg) {
      const term = q.line ? `, ${B.monthsLabel(q.line.months)}` : ''
      const price = q.line ? ` — ${B.amd(q.line.monthly)} ${B.ui('pricing', 'perMonth')}` : ` — ${B.amd(q.oneTimePackage)} ${B.ui('pricing', 'oneTime')}`
      lines.push(`${B.tr(q.pkg.name)}${term}${price}`)
    }
    for (const a of q.addons) lines.push(`${B.tr(a.addon.name)} ×${a.qty} — ${B.amd(a.total)}`)
    lines.push(`${B.ui('pricing', 'combinedEstimate')}: ${q.isMinimum ? B.ui('pricing', 'from') + ' ' : ''}${B.amd(q.combined)}`)
    return lines.join('\n')
  }

  /** Link that reopens this estimate. */
  B.shareUrl = (sel = selection) => {
    const url = new URL('pricing.html', location.href)
    if (sel.packageKey) url.searchParams.set('pkg', sel.packageKey)
    url.searchParams.set('d', sel.duration)
    const add = Object.entries(sel.addons || {})
      .filter(([, q]) => q > 0)
      .map(([k, q]) => `${k}:${q}`)
      .join(',')
    if (add) url.searchParams.set('add', add)
    url.searchParams.set('lang', lang)
    return url.href + '#pricing'
  }

  B.whatsappUrl = (text) => `https://wa.me/${data.site.whatsapp}?text=${encodeURIComponent(text)}`
})()
