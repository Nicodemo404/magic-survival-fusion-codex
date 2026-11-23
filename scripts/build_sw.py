import json
from pathlib import Path

CODE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = CODE_DIR / "data" / "combinations_v09941.json"
SW_PATH = CODE_DIR / "sw.js"

with open(DB_PATH, "r", encoding="utf-8") as f:
    db = json.load(f)

ids = [c["id"] for c in db["combinations"]]

combo_assets = []
for cid in ids:
    combo_assets.append(f"  './assets/thumbs/{cid}.webp',")
    combo_assets.append(f"  './assets/cards/{cid}.webp',")

combo_assets_str = "\n".join(combo_assets)

content = f"""// Magic Survival — Fusion Codex (v0.9941) Service Worker
const CACHE_PREFIX = 'ms-codex-';
const CACHE_NAME = 'ms-codex-v09941-v4';

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './data/combinations_v09941.json',
  './data/filter_taxonomy_v09941.json',
  './data/classes_subjects_v09941.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png',
  './assets/og-banner.png'
];

const COMBO_ASSETS = [
{combo_assets_str}
];

const PRECACHE_URLS = [...APP_SHELL, ...COMBO_ASSETS];

self.addEventListener('install', (event) => {{
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {{
      return cache.addAll(PRECACHE_URLS);
    }}).then(() => self.skipWaiting())
  );
}});

self.addEventListener('activate', (event) => {{
  event.waitUntil(
    caches.keys().then((keys) => {{
      return Promise.all(
        keys.map((key) => {{
          if ((key.startsWith('ms-codex-') || key.startsWith('fusion-codex-')) && key !== CACHE_NAME) {{
            return caches.delete(key);
          }}
        }})
      );
    }}).then(() => self.clients.claim())
  );
}});

self.addEventListener('fetch', (event) => {{
  if (event.request.method !== 'GET') {{
    return;
  }}

  const url = new URL(event.request.url);

  // External font CDN caching with graceful fallback
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {{
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {{
        return fetch(event.request).then((response) => {{
          if (response && response.ok) {{
            cache.put(event.request, response.clone());
          }}
          return response;
        }}).catch(() => cache.match(event.request));
      }})
    );
    return;
  }}

  // Cache-first strategy for local assets
  event.respondWith(
    caches.match(event.request, {{ ignoreSearch: true }}).then((cached) => {{
      if (cached) {{
        return cached;
      }}
      return fetch(event.request).then((response) => {{
        if (!response || !response.ok || (response.type !== 'basic' && response.type !== 'cors')) {{
          return response;
        }}
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {{
          cache.put(event.request, toCache);
        }});
        return response;
      }}).catch(() => {{
        if (event.request.mode === 'navigate') {{
          return caches.match('./index.html');
        }}
      }});
    }})
  );
}});

self.addEventListener('message', (event) => {{
  if (event.data && event.data.type === 'SKIP_WAITING') {{
    self.skipWaiting();
  }}
  if (event.data && event.data.type === 'CHECK_CACHE') {{
    caches.open(CACHE_NAME).then((cache) => {{
      cache.keys().then((keys) => {{
        if (event.ports && event.ports[0]) {{
          event.ports[0].postMessage({{
            status: 'ok',
            cacheName: CACHE_NAME,
            totalCached: keys.length,
            expected: PRECACHE_URLS.length
          }});
        }}
      }});
    }});
  }}
}});
"""

with open(SW_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Generated {SW_PATH} successfully with {len(ids)} combinations (118 webp images) + {12} app shell items.")
