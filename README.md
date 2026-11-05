# BOTZ Marketing Agency website

The trilingual (Armenian, English, Russian) website of BOTZ Marketing Agency, in plain HTML,
CSS and JavaScript: https://dadaryane-cmd.github.io/botz-website/

| What | Where |
| --- | --- |
| The website: pages, texts, prices, code and tests | [`site/`](site/README.md) |
| Admin for texts and prices (Pages CMS) | `.pages.yml`, generated from `site/cms/config.js` |
| Publishing to GitHub Pages | `.github/workflows/pages.yml` |
| Logo originals | `brand/originals/` |
| Notes for working on the code | [`CLAUDE.md`](CLAUDE.md) |

## Code style

The website needs no dependencies. The root only holds the code-style tools:

```bash
npm install
npm run lint     # Prettier check and ESLint for site/
npm run format   # format site/ with Prettier
```
