// Magic Survival — Fusion Codex (v0.9941) Service Worker
const CACHE_PREFIX = 'ms-codex-';
const CACHE_NAME = 'ms-codex-v09941-v9';

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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
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

  // Cache-first strategy for local assets
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
