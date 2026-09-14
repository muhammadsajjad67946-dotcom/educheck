import app, { ensureDatabaseReady } from '../server/index.js'

let dbInitPromise = null
function initDbOnce() {
  if (!dbInitPromise && typeof ensureDatabaseReady === 'function') {
    dbInitPromise = ensureDatabaseReady().catch((err) => {
      console.warn('ensureDatabaseReady background error:', err?.message || err)
    })
  }
  return dbInitPromise
}

export default async function handler(req, res) {
  // Ensure database schema check runs and completes before processing request
  try {
    await initDbOnce()
  } catch (err) {
    console.warn('initDbOnce in handler failed:', err?.message || err)
  }


  // If Vercel proxy forwarded the original incoming URI in headers, prefer it:
  const forwardedUri = req.headers['x-forwarded-uri'] || req.headers['x-matched-path']
  if (forwardedUri && forwardedUri.startsWith('/api')) {
    req.url = forwardedUri
  }

  // Ensure req.url starts with /api because Express routes are declared with /api/...
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`
  }

  // Normalize away any accidental double /api/api prefixes
  if (req.url.startsWith('/api/api/')) {
    req.url = req.url.replace('/api/api/', '/api/')
  }

  return app(req, res)
}

