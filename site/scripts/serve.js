/**
 * Minimal static server for local development: `npm start` → http://localhost:8080
 * (ES modules do not load from file:// URLs, so the site needs to be served.)
 * It also stands in for the publishing step (scripts/build-site.js): every page's and article's
 * address in each language (ru/uslugi/, en/blog/<slug>/) gets that page, and the route table and
 * the blog's list of articles are made on request, so new or edited content shows on reload.
 */
import { createReadStream } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ARTICLE_PAGE } from '../public/js/config.js'
import { HOME_PAGE, resolvePath } from '../public/js/lib/urls.js'
import { articlePage } from './build-site.js'
import { readRoutes, ROUTES_FILE } from './read-content.js'
import { readPostIndex, toJson } from './read-posts.js'

const root = fileURLToPath(new URL('../public/', import.meta.url))
const port = Number(process.env.PORT) || 8080
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
}

/** Content files the publishing step writes, made from the content on each request. */
const generated = {
  [`/${ROUTES_FILE}`]: () => toJson(readRoutes(root)),
  '/content/posts/index.json': () => toJson(readPostIndex(root)),
}

async function resolve(urlPath) {
  const path = normalize(join(root, urlPath))
  if (!path.startsWith(root)) return null
  const info = await stat(path).catch(() => null)
  if (info?.isDirectory()) return resolve(join(urlPath, 'index.html'))
  return info?.isFile() ? path : null
}

/** The page shell for an address (ru/uslugi/ → services.html), or null when it has none. */
async function pageFor(urlPath) {
  const target = resolvePath(readRoutes(root), urlPath.slice(1))
  if (!target) return null
  if (target.post) {
    const template = await readFile(join(root, `${ARTICLE_PAGE}.html`), 'utf8')
    return articlePage(template, target.post)
  }
  const file = target.page === HOME_PAGE ? 'index.html' : `${target.page}.html`
  return readFile(join(root, file), 'utf8')
}

function send(response, status, type, body) {
  response.writeHead(status, { 'Content-Type': type })
  response.end(body)
}

createServer(async (request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  if (generated[urlPath]) {
    send(response, 200, types['.json'], generated[urlPath]())
    return
  }
  const file = await resolve(urlPath)
  if (file) {
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(response)
    return
  }
  const page = await pageFor(urlPath)
  if (page) {
    send(response, 200, types['.html'], page)
    return
  }
  send(response, 404, types['.html'], await readFile(join(root, '404.html'), 'utf8'))
}).listen(port, () => console.log(`BOTZ site: http://localhost:${port}`))
