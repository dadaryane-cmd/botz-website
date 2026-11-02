/**
 * The blog articles on disk (public/content/posts/<slug>.json), for the dev server and the
 * publishing step. index.json, the generated list, is not an article.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { postIndex } from '../public/js/blog/posts.js'

export const INDEX_FILE = 'index.json'

export const postsFolder = (publicDir) => join(publicDir, 'content/posts')

export function readPosts(publicDir) {
  const folder = postsFolder(publicDir)
  return readdirSync(folder)
    .filter((file) => file.endsWith('.json') && file !== INDEX_FILE)
    .map((file) => JSON.parse(readFileSync(join(folder, file), 'utf8')))
}

/** What content/posts/index.json holds: the published articles, newest first, without text. */
export const readPostIndex = (publicDir, today) => postIndex(readPosts(publicDir), today)

export const toJson = (value) => `${JSON.stringify(value, null, 2)}\n`
