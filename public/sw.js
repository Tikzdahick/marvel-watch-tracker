// Cache version is derived from the registration URL: /sw.js?v=<BUILD_TIME>
// This means every Vite build produces a unique cache name, and activate()
// deletes all caches from previous builds automatically.
const BUILD_VERSION = new URLSearchParams(self.location.search).get('v') || 'dev'
const CACHE_NAME = `mvt-${BUILD_VERSION}`

// Regex that matches Vite's hashed output filenames, e.g. /assets/index-BUCRSMbg.js
// These are safe to cache forever because the hash changes whenever the content changes.
const HASHED_ASSET_RE = /\/assets\/.+\.[a-f0-9]{8,}\.(js|css|woff2?)$/i

// Non-HTML static files to pre-cache on install (small, rarely change)
const PRECACHE_URLS = ['/manifest.json', '/marvel-icon.svg']

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  )
  // Skip waiting so this SW activates immediately without needing all tabs to close
  self.skipWaiting()
})

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    // Delete every cache that doesn't match the current build version
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  // Claim all open clients so they get served by this SW immediately
  // (triggers controllerchange in main.jsx → page reload → fresh assets)
  self.clients.claim()
})

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  // ── Strategy A: Cache-first for hashed assets ──────────────────────────────
  // /assets/index-BUCRSMbg.js, /assets/index-CccPiRk9.css, etc.
  // Safe because Vite changes the hash whenever the file content changes.
  // Old hashes simply become dead entries and get swept up when activate()
  // deletes the previous cache version.
  if (HASHED_ASSET_RE.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // ── Strategy B: Network-first for everything else ──────────────────────────
  // Covers index.html, /, manifest.json, icons, etc.
  // Always fetches fresh from the network so the user gets the latest index.html
  // (which references the current build's hashed JS/CSS URLs).
  // Falls back to the cache only when the network is unavailable (offline support).
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() => caches.match(event.request))
  )
})
