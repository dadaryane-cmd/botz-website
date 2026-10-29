# BOTZ website (static)

The BOTZ Marketing Agency website in plain HTML, CSS and JavaScript (ES modules).
No framework, no build step and no server: GitHub Pages publishes `public/` as it is
(see `.github/workflows/pages.yml`).

## Run locally

```bash
npm start     # http://localhost:8080 — ES modules need http://, they do not load from file://
npm test      # unit tests (Node's built-in test runner, no dependencies)
npm run cms   # regenerate /.pages.yml after changing cms/config.js
```

## Structure

```
site/
├── public/                     everything that is published
│   ├── *.html                  one empty shell per page: <html data-page="smm">
│   ├── content/                ALL TEXTS AND PRICES as JSON (edited in Pages CMS)
│   │   ├── pages/<page>.json   one file per page: its meta data and list of sections
│   │   └── *.json              prices, finder, contact details, founders, menu, labels
│   ├── css/
│   │   ├── main.css            imports the files below in order
│   │   ├── base/               tokens (colours, fonts), reset, typography, motion
│   │   ├── layout/             containers and sections, header, footer, mobile bar
│   │   └── components/         one file per UI component / section type
│   ├── js/
│   │   ├── main.js             entry point: renders header, sections and footer
│   │   ├── theme-init.js       classic script, applies the saved theme before first paint
│   │   ├── config.js           constants (languages, contract lengths, endpoints)
│   │   ├── content/            loads the JSON from /content before the page renders
│   │   ├── lib/                small helpers: DOM, i18n, formatting, storage, links, theme
│   │   ├── pricing/            price engine, package finder scoring, selection state
│   │   ├── forms/              inquiry validation and email payload
│   │   ├── services/           FormSubmit client
│   │   └── components/
│   │       ├── layout/         header, footer, mobile bar
│   │       ├── sections/       one render function per section type + index.js registry
│   │       ├── flame/          animated WebGL fire behind the home hero
│   │       └── inquiry-form.js
│   ├── images/
│   ├── media/                  fire video (fallback when WebGL is unavailable)
│   └── downloads/              sample PDFs
├── cms/                        Pages CMS configuration (source of /.pages.yml)
├── scripts/                    local dev server, .pages.yml generator
└── tests/                      unit tests for pricing, finder, inquiry, content and CMS config
```

### How a page is built

1. `index.html` loads `js/main.js` and says which page it is: `data-page="home"`.
2. `js/content/` fetches the site-wide JSON and `content/pages/home.json` (top-level `await`,
   so every module can import content directly).
3. `main.js` renders each entry of the page's `sections` list with the matching component
   from `components/sections/index.js`. Changing the language re-renders from the same content.

## Editing content (admin)

Texts, prices, contact details and the menu are edited in **[Pages CMS](https://app.pagescms.org)**,
a free editor for content stored in GitHub. Nothing extra is hosted: saving in the editor
commits the JSON file to `main`, and the GitHub Pages workflow publishes it about a minute later.

**First time:** open https://app.pagescms.org → **Sign in with GitHub** → install the
Pages CMS GitHub app for the `botz-website` repository when asked → open
`dadaryane-cmd/botz-website` (branch `main`).

| In the editor     | Changes                                                        |
| ----------------- | -------------------------------------------------------------- |
| Pages → _page_    | that page's texts, and adding, removing or reordering sections |
| Packages & prices | package names, taglines, monthly prices per length, add-ons    |
| Package finder    | questions, answers, budget limits and scoring                  |
| Contact details   | phone, WhatsApp, emails (including where the form sends to)    |
| Founders          | names, roles and which inquiries each one handles              |
| Menu & footer     | navigation links and footer texts                              |
| Buttons & labels  | every short interface text                                     |

Every text has an Armenian, English and Russian box. In headings, `*words*` in asterisks
are shown in the accent colour. A price left empty means "not offered for that length".

**For developers:** Pages CMS keeps only the fields declared in `cms/config.js`. When you add
a key to the JSON or a new section type, declare it there and run `npm run cms`.
`npm test` fails if any content key is undeclared or `.pages.yml` is out of date, so editor
saves can never drop data. Empty editor fields arrive as `""`; the loader turns them into `null`.

## Contact form

Messages are emailed to `formEmail` in `content/site.json` (dadaryane@gmail.com) through
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
