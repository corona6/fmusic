
const MAIN_CACHE = 'main_20250210';

self.addEventListener("install", async (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(MAIN_CACHE)
        await cache.addAll([
            '.',
            './favicon.ico',
            './index.html',
            './manifest.webmanifest',
            './fmusic.jpg',
            './081a2a07-7c5b-4c2f-a883-bcbd9c548a02.mp3',
            './e382c0be-90e8-489c-8aa1-e61518ce971f.mp3',
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