# Instructions for working on this repository

## The website is `site/` — always clean, plain JavaScript

The owner's standing rule: **write clean JS code.** For `site/` that means:

- **Plain HTML, CSS and JavaScript (ES modules).** No frameworks, no libraries, no build step,
  no npm dependencies in the published site. Node is used only for `npm start` (dev server),
  `npm test` (built-in `node:test`) and `npm run cms`.
- **One job per file**, in the existing folders: `content/` (JSON, edited in Pages CMS),
  `js/lib/` (small helpers), `js/pricing/` and `js/forms/` (pure logic, unit-tested),
  `js/services/`, `js/components/` (one render function per section / component),
  `css/base`, `css/layout`, `css/components` (one file per component).
- **Readable over clever:** descriptive names, small functions, early returns, no comma
  expressions or one-letter variables outside tiny loops. Comments explain _why_, briefly.
- **Build DOM with `h()` from `js/lib/dom.js`** (text is never parsed as HTML). Markup strings
  only for static, trusted SVG.
- **Keep logic pure and testable** (no DOM or storage access at import time) and add tests in
  `site/tests/` for new logic.
- **Respect `prefers-reduced-motion`** for every animation; clean up observers, timers and
  animation frames when an element leaves the page.
- **Format with Prettier** (repo `.prettierrc.json`) and keep `npx eslint site` clean.
- **Make edits directly in the files** (Edit tool), not with ad-hoc patch scripts.

## Before pushing changes to `site/`

```bash
cd site && npm test          # unit, content and CMS-config tests
npx prettier --check site    # from the repository root
npx eslint site
```

Also check the change in a real browser (Playwright is preinstalled in cloud sessions):
no console errors, no horizontal overflow at 390px and 1280px, all three languages.

## Content and the admin (Pages CMS)

All texts and prices live in `site/public/content/*.json` (`{ hy, en, ru }` for every text).
Pages CMS keeps only fields declared in `site/cms/config.js`: when adding a content key or a
section type, declare it there and run `npm run cms` (tests fail otherwise).

## Deployment

Pushing to `main` publishes `site/public/` to GitHub Pages
(https://dadaryane-cmd.github.io/botz-website/) via `.github/workflows/pages.yml`.
The Next.js app at the repository root is the original CMS version and is not deployed.
