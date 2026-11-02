/**
 * Minimal static server for local development: `npm start` → http://localhost:8080
 * (ES modules do not load from file:// URLs, so the site needs to be served.)
 * It also stands in for the publishing step (scripts/build-site.js): every article address
 * (post-<slug>.html) gets the article page, and the blog's list of articles is made on request,
 * so a new or edited article shows up on reload.
 */
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { slugFromPath } from '../public/js/blog/posts.js'
import { readPostIndex, toJson } from './read-posts.js'

const root = fileURLToPath(new URL('../public/', import.meta.url))
const port = Number(process.env.PORT) || 8080
const POST_INDEX_PATH = '/content/posts/index.json'
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

async function resolve(urlPath) {
  const path = normalize(join(root, decodeURIComponent(urlPath)))
  if (!path.startsWith(root)) return null
  const info = await stat(path).catch(() => null)
  if (info?.isDirectory()) return resolve(join(urlPath, 'index.html'))
  return info?.isFile() ? path : null
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, 'http://localhost')
  if (pathname.endsWith(POST_INDEX_PATH)) {
    response.writeHead(200, { 'Content-Type': types['.json'] })
    response.end(toJson(readPostIndex(root)))
    return
  }
  const found = slugFromPath(pathname) ? join(root, 'post.html') : await resolve(pathname)
  const file = found ?? join(root, '404.html')
  response.writeHead(found ? 200 : 404, {
    'Content-Type': types[extname(file)] ?? 'application/octet-stream',
  })
  createReadStream(file).pipe(response)
}).listen(port, () => console.log(`BOTZ site: http://localhost:${port}`))
