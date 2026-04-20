// cli/fetch.mjs
// HTTPS GET with retry + optional GITHUB_TOKEN auth.

import { request } from 'node:https'

const MAX_RETRIES = 3
const BACKOFF_MS = 500

export async function fetchText(url) {
  return fetchWithRetry(url, 'utf8')
}

export async function fetchBuffer(url) {
  return fetchWithRetry(url, null)
}

async function fetchWithRetry(url, encoding) {
  let lastErr
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fetchOnce(url, encoding)
    } catch (err) {
      lastErr = err
      if (attempt < MAX_RETRIES - 1) {
        await sleep(BACKOFF_MS * Math.pow(2, attempt))
      }
    }
  }
  throw lastErr
}

function fetchOnce(url, encoding, depth = 0) {
  return new Promise((resolve, reject) => {
    if (depth > 5) {
      reject(new Error(`Too many redirects: ${url}`))
      return
    }
    const headers = {
      'User-Agent': 'klp-ui-cli',
      Accept: 'application/vnd.github.raw+json, */*',
    }
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }
    const req = request(url, { method: 'GET', headers }, (res) => {
      // follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume()
        fetchOnce(res.headers.location, encoding, depth + 1).then(resolve, reject)
        return
      }
      if (res.statusCode !== 200) {
        res.resume()
        const hint =
          res.statusCode === 403
            ? ' (hint: GitHub rate limit reached — set GITHUB_TOKEN env var)'
            : ''
        reject(new Error(`HTTP ${res.statusCode} fetching ${url}${hint}`))
        return
      }
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => {
        const buf = Buffer.concat(chunks)
        resolve(encoding ? buf.toString(encoding) : buf)
      })
      res.on('error', reject)
    })
    req.on('error', reject)
    req.end()
  })
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
