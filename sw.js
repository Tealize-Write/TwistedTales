// Service Worker for Tealize Website
const CACHE_VERSION = 19;
const HTML_CACHE = `tealize-html-v${CACHE_VERSION}`;
const STATIC_CACHE = `tealize-static-v${CACHE_VERSION}`;

const HTML_URLS = ["/", "/index.html", "/lag-afterword.html"];

const STATIC_URLS = [
  "/manifest.json",
  "/js/i18n.js",
  "/js/app.js",
  "/js/divination.js",
  "/js/tracking.js",
  "/js/music.js",
  "/css/variables.css",
  "/css/base.css",
  "/css/nav.css",
  "/css/controls.css",
  "/css/visual-mode.css",
  "/css/lag-section.css",
  "/css/code-mode.css",
  "/css/light-overrides.css",
  "/css/music-section.css",
  "/css/responsive.css",
  "/img/avatar_white.jpg",
  "/img/avatar_black.jpg",
  "/img/Story_Command1.jpg",
  "/img/Story_Command2.jpg",
  "/img/Story_Command0_Station_Underground_City_Rules.jpg",
  "/img/Crossing_the_Soil.jpg",
  "/img/Friend_or_Fraud1.jpg",
  "/img/Friend_or_Fraud2.jpg",
  "/img/leonAndGod.jpg",
  "/img/littlelion.jpg",
];

function isCacheableResponse(res) {
  return (
    !!res &&
    res.status === 200 &&
    (res.type === "basic" || res.type === "default")
  );
}

function isDocumentRequest(req) {
  return req.mode === "navigate" || req.destination === "document";
}

function isStaticRequest(req) {
  return ["style", "script", "image", "font", "audio", "manifest"].includes(
    req.destination,
  );
}

async function networkFirstHTML(request) {
  const cache = await caches.open(HTML_CACHE);
  try {
    const response = await fetch(request);
    if (isCacheableResponse(response)) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    return (
      (await cache.match(request)) ||
      (await cache.match("/index.html")) ||
      Response.error()
    );
  }
}

async function staleWhileRevalidateStatic(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (isCacheableResponse(response)) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  return (await networkPromise) || Response.error();
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const htmlCache = await caches.open(HTML_CACHE);
      const staticCache = await caches.open(STATIC_CACHE);
      await Promise.allSettled(HTML_URLS.map((url) => htmlCache.add(url)));
      await Promise.allSettled(STATIC_URLS.map((url) => staticCache.add(url)));
    })(),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([HTML_CACHE, STATIC_CACHE]);
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name.startsWith("tealize-") && !keep.has(name)) {
            return caches.delete(name);
          }
          return Promise.resolve();
        }),
      );
    })(),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (!request.url.startsWith(self.location.origin)) return;

  if (isDocumentRequest(request)) {
    event.respondWith(networkFirstHTML(request));
    return;
  }

  if (isStaticRequest(request)) {
    event.respondWith(staleWhileRevalidateStatic(request));
  }
});
