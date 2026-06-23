// Service Worker utilizing Workbox CDN
importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js");

if (typeof workbox !== "undefined") {
  // Suppress verbose console logs in production, but allow debug in development
  workbox.setConfig({ debug: false });

  const { registerRoute } = workbox.routing;
  const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;
  const { ExpirationPlugin } = workbox.expiration;

  // Immediately take control of clients
  self.skipWaiting();
  workbox.core.clientsClaim();

  // 1. Cache Google Fonts
  registerRoute(
    ({ url }) =>
      url.origin === "https://fonts.googleapis.com" ||
      url.origin === "https://fonts.gstatic.com",
    new CacheFirst({
      cacheName: "google-fonts",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        }),
      ],
    })
  );

  // 2. Cache local static images and assets
  registerRoute(
    ({ request, url }) =>
      request.destination === "image" ||
      url.pathname.startsWith("/icons/") ||
      url.pathname.startsWith("/screenshots/"),
    new StaleWhileRevalidate({
      cacheName: "static-images-and-icons",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // 3. Cache NextJS JS and CSS bundles
  registerRoute(
    ({ request, url }) =>
      request.destination === "script" ||
      request.destination === "style" ||
      url.pathname.startsWith("/_next/static/"),
    new StaleWhileRevalidate({
      cacheName: "static-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
      ],
    })
  );

  // 4. Cache other pages and HTML documents (Network First, fallback to cache)
  registerRoute(
    ({ request }) => request.mode === "navigate",
    new NetworkFirst({
      cacheName: "pages",
      networkTimeoutSeconds: 5,
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  // 5. Cache static json and manifest
  registerRoute(
    ({ url }) => url.pathname.endsWith(".json") || url.pathname === "/manifest.json",
    new NetworkFirst({
      cacheName: "manifest-and-json",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );
} else {
  console.error("Workbox failed to load from CDN");
}
