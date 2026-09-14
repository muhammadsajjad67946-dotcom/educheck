import app from '../server/index.js'

export default function handler(req, res) {
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
