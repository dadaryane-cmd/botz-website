# BOTZ website (static)

The BOTZ Marketing Agency website in plain HTML, CSS and JavaScript (ES modules).
No framework, no build step and no server: GitHub Pages publishes `public/` as it is
(see `.github/workflows/pages.yml`).

## Run locally

```bash
npm start   # http://localhost:8080 — ES modules need http://, they do not load from file://
npm test    # unit tests (Node's built-in test runner, no dependencies)
```

## Structure

```
site/
├── public/                     everything that is published
│   ├── *.html                  one empty shell per page: <html data-page="smm">
│   ├── css/
│   │   ├── main.css            imports the files below in order
│   │   ├── base/               tokens (colours, fonts), reset, typography, motion
│   │   ├── layout/             containers and sections, header, footer, mobile bar
│   │   └── components/         one file per UI component / section type
│   ├── js/
│   │   ├── main.js             entry point: renders header, sections and footer
│   │   ├── theme-init.js       classic script, applies the saved theme before first paint
│   │   ├── config.js           constants (languages, contract lengths, endpoints)
│   │   ├── content/            all texts (hy / en / ru), prices, people, navigation
│   │   │   └── pages/          one file per page: its meta data and list of sections
│   │   ├── lib/                small helpers: DOM, i18n, formatting, storage, links, theme
│   │   ├── pricing/            price engine, package finder scoring, selection state
│   │   ├── forms/              inquiry validation and email payload
│   │   ├── services/           FormSubmit client
│   │   └── components/
│   │       ├── layout/         header, footer, mobile bar
│   │       ├── sections/       one render function per section type + index.js registry
│   │       └── inquiry-form.js
│   ├── images/
│   └── downloads/              sample PDFs
├── scripts/serve.js            local dev server
└── tests/                      unit tests for pricing, finder, inquiry and content
```

### How a page is built

1. `index.html` loads `js/main.js` and says which page it is: `data-page="home"`.
2. `main.js` looks the page up in `content/pages/` and renders each entry of its `sections`
   list with the matching component from `components/sections/index.js`.
3. Changing the language re-renders everything from the same content.

## Editing content

| To change                            | Edit                                      |
| ------------------------------------ | ----------------------------------------- |
| Page texts and section order         | `public/js/content/pages/<page>.js`       |
| Sections shared by several pages     | `public/js/content/sections.js`, `faq.js` |
| Prices, packages and add-ons         | `public/js/content/catalog.js`            |
| Phone, email, form recipient         | `public/js/content/site.js`               |
| Buttons, labels, messages            | `public/js/content/ui.js`                 |
| Package finder questions and scoring | `public/js/content/finder.js`             |

Every text is an object with all three languages: `{ en: '…', hy: '…', ru: '…' }`.
In headings, `*words*` are highlighted. `npm test` checks that no translation is missing
and that every link points to an existing file.

## Contact form

Messages are emailed to `formEmail` in `content/site.js` (dadaryane@gmail.com) through
[FormSubmit](https://formsubmit.co), a free form-to-email service.

**One-time setup:** once the site is online, send one test message. FormSubmit emails an
**Activate Form** link to dadaryane@gmail.com — click it. Until then the form shows an error
and offers email or WhatsApp instead. After activation FormSubmit also offers a random alias
you can use as `formEmail` so the address is not visible in the page source.

## Content notes

- Prices are the published BOTZ price list. Detailed package scopes are not shown; each card
  says the scope is confirmed in the personal proposal.
- Founder bios, years of experience, the discount percentage and growth numbers are left out
  until real facts are available.
