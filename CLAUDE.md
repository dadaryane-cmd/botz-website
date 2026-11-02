# Instructions for working on this repository

## The website is `site/` — always clean, plain JavaScript

The owner's standing rule: **write clean JS code.** For `site/` that means:

- **Plain HTML, CSS and JavaScript (ES modules).** No frameworks, no libraries, no npm
  dependencies. `site/public/` runs as it is (no bundling or transpiling); Node is used only for
  `npm start` (dev server), `npm test` (built-in `node:test`), `npm run cms`, `npm run preload`
  and `npm run build` (the publishing step, which adds the blog's pages; see Deployment).
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
- **Format with Prettier** (repo `.prettierrc.json`) and keep `npx eslint site` clean. The
  `site/**` block in `eslint.config.mjs` enforces the readability rules: no nested ternaries,
  comma or assignment expressions, braces on multi-line blocks, no one-letter names
  (except `i`, `x`, `y`, `t` and `h`).
- **Make edits directly in the files** (Edit tool), not with ad-hoc patch scripts.

## Before pushing changes to `site/`

```bash
cd site && npm test          # unit, content and CMS-config tests
npx prettier --check site    # from the repository root
npx eslint site
```

Also check the change in a real browser (Playwright is preinstalled in cloud sessions):
no console errors, no horizontal overflow at 390px and 1280px, all three languages.

After changing any stylesheet or `js/head.js`, or adding, removing or renaming a JavaScript
module or a site-wide content file, run `npm run preload` (tests fail when its output is out of
date). It writes `css/site.css` (the stylesheets `css/main.css` lists, joined into one file —
pages load that; edit the sources, never `site.css`) and each page's `preload:start … preload:end`
block (the stylesheet, content and modules to fetch up front, and a copy of `js/head.js`).
Fonts are self-hosted in `site/public/fonts` (`css/base/fonts.css`).

## Content and the admin (Pages CMS)

All texts and prices live in `site/public/content/*.json` (`{ hy, en, ru }` for every text).

**Addresses (`js/lib/urls.js`):** Armenian at the root, Russian in `ru/`, English in `en/`, and
every page and article with a translated slug from its content `path` (`mer-masin/`, `ru/o-nas/`,
`en/blog/<slug>/`): Latin letters, written the way people search in that language. The address
sets the language. Content links name pages by file (`pricing.html?cat=smm`,
`post-<id>.html`); `h()` points them at the address in the page's language using the route table
(`content/routes.json`, generated like the blog list). Every page has `<base href>` at the site's
root, so file paths stay relative to the root (and `h()` writes `#anchor` links out in full). The
language switch is links (`hreflang`), and `js/head.js` sends an Armenian address to a language
the visitor chose earlier. Never pick the language from the browser: search engines must see
the Armenian pages. Changing a published address breaks links to it.
Pages CMS keeps only fields declared in `site/cms/config.js`: when adding a content key or a
section type, declare it there and run `npm run cms` (tests fail otherwise).

Blog articles are one file each in `site/public/content/posts/<slug>.json` (Pages CMS
collection "Blog articles"): slug, date, author (a key in `people.json`), optional cover, and
title, description and Markdown body in all three languages. The Markdown is parsed by
`js/blog/markdown.js` and drawn with `h()`. The list `content/posts/index.json` is generated
(git-ignored): by `npm start` on request and by `npm run build` when publishing.

## Deployment

Pushing to `main` publishes the site to GitHub Pages
(https://dadaryane-cmd.github.io/botz-website/) via `.github/workflows/pages.yml`, which runs
`npm run build` in `site/`: it copies `public/` to `dist/` (git-ignored) and writes every page and
published article (from `post.html`) at its address in each language (`ru/o-nas/index.html`), with
the `<base href>` and the search-engine tags (title, description, canonical, hreflang, Open Graph,
schema.org JSON-LD; `site/scripts/seo/`) between each page's `seo:start` and `seo:end` markers,
plus the route table, the blog list, `sitemap.xml`, `robots.txt` and a redirect at every earlier
address (`about-ru.html`, `smm.html` …). Full addresses start from `url` in `content/site.json`.
The page shells in `public/` (`about.html` …) are templates and are not published as pages. It
also runs daily, so articles dated in the future appear on their day. The build stops if a live
page carries `noindex` or a preview page lacks it. Search-engine verification codes and the GA4
id are optional fields in `content/site.json` (Pages CMS → Contact details); GA4
(`js/services/analytics.js`) loads only when the id is set, after the page is idle.

**Preview before going live:** when the owner wants to try a change first, make it on the
`preview` branch (branched from `main`), not on `main`. Pushing it publishes the site from that
branch at https://dadaryane-cmd.github.io/botz-website/preview/ (pages marked noindex), and the live
site stays as it is. When the owner approves, merge `preview` into `main` and delete the branch.
The Next.js app at the repository root is the original CMS version and is not deployed.
