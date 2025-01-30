
const MAIN_CACHE = 'main_20250131_7';

self.addEventListener("install", async (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(MAIN_CACHE)
        await cache.addAll([
            '.',
            './favicon.ico',
            './index.html',
            './manifest.webmanifest',
            './fmusic.jpg',
            './icons/icon_64.png',
            './icons/icon_180.png',
            './icons/icon_256.png',
            './icons/icon_512.png'
        ])
    })())
});

const deleteCache = async (key) => {
    await caches.delete(key);
};

const deleteOldCaches = async () => {
    const cacheKeepList = [MAIN_CACHE];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(deleteCache));
};

addEventListener('backgroundfetchsuccess', (event) => {
    const bgFetch = event.registration;

    event.waitUntil(async function () {
        // Create/open a cache.
        const cache = await caches.open(MAIN_CACHE);
        // Get all the records.
        const records = await bgFetch.matchAll();
        // Copy each request/response across.
        const promises = records.map(async (record) => {
            const response = await record.responseReady;
            await cache.put(record.request, response);
        });

        // Wait for the copying to complete.
        await Promise.all(promises);
    }());
});

self.addEventListener("activate", (event) => {
    event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (e) => {
    e.respondWith(async function () {
        const cachedResponse = await caches.match(e.request.url)
        if (cachedResponse) {
            // cache hit
            return cachedResponse
        } else {
            // fallback to fetch
            return fetch(e.request)
        }
    }())
})