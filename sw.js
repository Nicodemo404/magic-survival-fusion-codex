// Magic Survival — Fusion Codex (v0.9941) Service Worker
const CACHE_PREFIX = 'ms-codex-';
const CACHE_NAME = 'ms-codex-v09941-v12';

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './data/combinations_v09941.json',
  './data/filter_taxonomy_v09941.json',
  './data/classes_subjects_v09941.json',
  './data/artifacts_v09941.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png',
  './assets/og-banner.png'
];

const COMBO_ASSETS = [
  './assets/thumbs/telekinetic_sword.webp',
  './assets/cards/telekinetic_sword.webp',
  './assets/thumbs/blaster.webp',
  './assets/cards/blaster.webp',
  './assets/thumbs/current_overload.webp',
  './assets/cards/current_overload.webp',
  './assets/thumbs/prism_spray.webp',
  './assets/cards/prism_spray.webp',
  './assets/thumbs/terra_current.webp',
  './assets/cards/terra_current.webp',
  './assets/thumbs/avatar.webp',
  './assets/cards/avatar.webp',
  './assets/thumbs/brandish.webp',
  './assets/cards/brandish.webp',
  './assets/thumbs/pyrotechnics.webp',
  './assets/cards/pyrotechnics.webp',
  './assets/thumbs/snowflake_blossom.webp',
  './assets/cards/snowflake_blossom.webp',
  './assets/thumbs/phoenix.webp',
  './assets/cards/phoenix.webp',
  './assets/thumbs/heart_of_lightning.webp',
  './assets/cards/heart_of_lightning.webp',
  './assets/thumbs/exidium.webp',
  './assets/cards/exidium.webp',
  './assets/thumbs/plasma_ray.webp',
  './assets/cards/plasma_ray.webp',
  './assets/thumbs/lightning_breath.webp',
  './assets/cards/lightning_breath.webp',
  './assets/thumbs/hyperion.webp',
  './assets/cards/hyperion.webp',
  './assets/thumbs/soul_blade.webp',
  './assets/cards/soul_blade.webp',
  './assets/thumbs/ghastly_rampage.webp',
  './assets/cards/ghastly_rampage.webp',
  './assets/thumbs/crazed_spray.webp',
  './assets/cards/crazed_spray.webp',
  './assets/thumbs/frenzy.webp',
  './assets/cards/frenzy.webp',
  './assets/thumbs/neutron_generation.webp',
  './assets/cards/neutron_generation.webp',
  './assets/thumbs/black_hole.webp',
  './assets/cards/black_hole.webp',
  './assets/thumbs/inferno.webp',
  './assets/cards/inferno.webp',
  './assets/thumbs/age_of_the_sun.webp',
  './assets/cards/age_of_the_sun.webp',
  './assets/thumbs/furnace.webp',
  './assets/cards/furnace.webp',
  './assets/thumbs/breath_of_fire.webp',
  './assets/cards/breath_of_fire.webp',
  './assets/thumbs/vortex.webp',
  './assets/cards/vortex.webp',
  './assets/thumbs/ether_blaze.webp',
  './assets/cards/ether_blaze.webp',
  './assets/thumbs/ruler_of_storms.webp',
  './assets/cards/ruler_of_storms.webp',
  './assets/thumbs/flame_storm.webp',
  './assets/cards/flame_storm.webp',
  './assets/thumbs/great_flood.webp',
  './assets/cards/great_flood.webp',
  './assets/thumbs/winter_storm.webp',
  './assets/cards/winter_storm.webp',
  './assets/thumbs/super_cyclone.webp',
  './assets/cards/super_cyclone.webp',
  './assets/thumbs/lightning_calibration.webp',
  './assets/cards/lightning_calibration.webp',
  './assets/thumbs/magnetic_field.webp',
  './assets/cards/magnetic_field.webp',
  './assets/thumbs/meisner_effect.webp',
  './assets/cards/meisner_effect.webp',
  './assets/thumbs/gate.webp',
  './assets/cards/gate.webp',
  './assets/thumbs/supernova.webp',
  './assets/cards/supernova.webp',
  './assets/thumbs/genesis.webp',
  './assets/cards/genesis.webp',
  './assets/thumbs/black_death.webp',
  './assets/cards/black_death.webp',
  './assets/thumbs/glacium.webp',
  './assets/cards/glacium.webp',
  './assets/thumbs/genocide.webp',
  './assets/cards/genocide.webp',
  './assets/thumbs/origin_explosion.webp',
  './assets/cards/origin_explosion.webp',
  './assets/thumbs/hellfire.webp',
  './assets/cards/hellfire.webp',
  './assets/thumbs/discharge.webp',
  './assets/cards/discharge.webp',
  './assets/thumbs/astrape.webp',
  './assets/cards/astrape.webp',
  './assets/thumbs/empyrean_wrath.webp',
  './assets/cards/empyrean_wrath.webp',
  './assets/thumbs/lightning_bolts.webp',
  './assets/cards/lightning_bolts.webp',
  './assets/thumbs/war_climate.webp',
  './assets/cards/war_climate.webp',
  './assets/thumbs/energy_bombardment.webp',
  './assets/cards/energy_bombardment.webp',
  './assets/thumbs/great_impact.webp',
  './assets/cards/great_impact.webp',
  './assets/thumbs/mana_spear.webp',
  './assets/cards/mana_spear.webp',
  './assets/thumbs/demon_equation.webp',
  './assets/cards/demon_equation.webp',
  './assets/thumbs/great_rift.webp',
  './assets/cards/great_rift.webp',
  './assets/thumbs/orbital_strike.webp',
  './assets/cards/orbital_strike.webp',
  './assets/thumbs/destroyer.webp',
  './assets/cards/destroyer.webp',
  './assets/thumbs/frozen_heart.webp',
  './assets/cards/frozen_heart.webp',
  './assets/thumbs/reaction.webp',
  './assets/cards/reaction.webp',
  './assets/thumbs/photon_explosion.webp',
  './assets/cards/photon_explosion.webp',
  './assets/thumbs/teleport.webp',
  './assets/cards/teleport.webp',
  './assets/thumbs/gate_of_creation.webp',
  './assets/cards/gate_of_creation.webp',
  './assets/thumbs/perpetual_engine.webp',
  './assets/cards/perpetual_engine.webp',
  './assets/thumbs/overmind.webp',
  './assets/cards/overmind.webp',
];

const PRECACHE_URLS = [...APP_SHELL, ...COMBO_ASSETS];

// Code & data (HTML, JS, CSS, JSON) are Network-First: online users always get the latest deploy,
// offline users (or a network slower than NETWORK_TIMEOUT_MS) get the cached copy.
// Images & icons stay Cache-First: instant loads and no repeat downloads.
const NETWORK_FIRST_RE = /\.(?:html|js|css|json)$/i;
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 'no-cache' revalidates with the server, so a new version never precaches stale HTTP-cached files.
      return cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: 'no-cache' })));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if ((key.startsWith('ms-codex-') || key.startsWith('fusion-codex-')) && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

function isNetworkFirst(request, url) {
  if (url.origin !== self.location.origin) return false;
  return request.mode === 'navigate' || url.pathname.endsWith('/') || NETWORK_FIRST_RE.test(url.pathname);
}

// Store without the query string so cache-busting params never pile up duplicate entries.
function cacheKey(url) {
  return url.origin + url.pathname;
}

function isCacheable(response) {
  return Boolean(response && response.ok && (response.type === 'basic' || response.type === 'default'));
}

// A redirected response cannot be used for a navigation, so rebuild it as a plain response.
function cleanResponse(response) {
  if (!response.redirected) return response;
  return response.blob().then((body) => new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  }));
}

function cachedCopy(request, url) {
  return caches.match(cacheKey(url), { ignoreSearch: true }).then((cached) => {
    if (cached) return cached;
    return request.mode === 'navigate' ? caches.match('./index.html') : undefined;
  });
}

function networkFirst(event, url) {
  const request = event.request;
  const network = fetch(url.href, { cache: 'no-cache', credentials: 'same-origin' })
    .then(cleanResponse)
    .then((response) => {
      let stored = Promise.resolve();
      if (isCacheable(response)) {
        const copy = response.clone();
        stored = caches.open(CACHE_NAME).then((cache) => cache.put(cacheKey(url), copy));
      }
      return { response, stored };
    });

  // Keep the worker alive until the fresh copy is stored, even if the cached copy was served first.
  event.waitUntil(network.then(({ stored }) => stored).catch(() => {}));

  return new Promise((resolve) => {
    let done = false;
    const finish = (response) => {
      if (!done && response) {
        done = true;
        resolve(response);
      }
    };
    const timer = setTimeout(() => cachedCopy(request, url).then(finish), NETWORK_TIMEOUT_MS);

    network.then(({ response }) => {
      clearTimeout(timer);
      if (response.ok) {
        finish(response);
      } else {
        // Server error (e.g. 404/5xx during a deploy): prefer the last good cached copy.
        cachedCopy(request, url).then((cached) => finish(cached || response));
      }
    }).catch(() => {
      clearTimeout(timer);
      cachedCopy(request, url).then((cached) => finish(cached || Response.error()));
    });
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // External font CDN caching with graceful fallback
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request).then((response) => {
          if (response && response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => cache.match(event.request));
      })
    );
    return;
  }

  // Network-First for app code & data
  if (isNetworkFirst(event.request, url)) {
    event.respondWith(networkFirst(event, url));
    return;
  }

  // Cache-First for images, icons and other static assets
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (!response || !response.ok || (response.type !== 'basic' && response.type !== 'cors')) {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, toCache);
        });
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return Response.error();
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CHECK_CACHE') {
    caches.open(CACHE_NAME).then((cache) => {
      cache.keys().then((keys) => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({
            status: 'ok',
            cacheName: CACHE_NAME,
            totalCached: keys.length,
            expected: PRECACHE_URLS.length
          });
        }
      });
    });
  }
});
