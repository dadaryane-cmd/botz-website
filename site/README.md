# BOTZ website (static version)

Plain HTML, CSS and JavaScript — no framework, no build step, no server.
Open `index.html` in a browser to view it locally, or let GitHub Pages publish it
(see `.github/workflows/pages.yml`).

## Files

| File | What it does |
|---|---|
| `*.html` | One small file per page. Each only says which page it is (`<html data-page="smm">`). |
| `assets/js/data.js` | **All content**: texts in Armenian, English and Russian, prices, add-ons, contacts and the package finder questions. Edit this file to change the site. |
| `assets/js/core.js` | Language switching, price formatting and the visitor's package selection. |
| `assets/js/blocks.js` | Page sections (hero, services, FAQ, …). |
| `assets/js/pricing.js` | Pricing tool and the home-page price overview. |
| `assets/js/guide.js` | The six-question package finder. |
| `assets/js/form.js` | Contact section and inquiry form. |
| `assets/js/main.js` | Header, footer, light/dark theme and page rendering. |
| `assets/css/style.css` | All styles. |

## Contact form

Messages are emailed to `site.formEmail` in `data.js` (dadaryane@gmail.com) through
[FormSubmit](https://formsubmit.co), a free form-to-email service, so no server is needed.

**One-time setup:** after the site is online, send one test message through the form.
FormSubmit then emails dadaryane@gmail.com an **Activate Form** link — click it. Until then
the form shows an error and offers email/WhatsApp instead. After activating, FormSubmit
also gives you a random alias you can put in `formEmail` so the address is not visible in
the page source.

## Content notes

- Prices are the published BOTZ price list. Detailed package scopes are not shown; each
  card says the scope is confirmed in the personal proposal.
- Sections that only had `[placeholder]` text in the CMS (founder bios, years of experience,
  discount percentage, growth numbers) are left out until real facts are available.
