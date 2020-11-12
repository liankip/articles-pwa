const CACHE_NAME = "article-pwa";

var urlsToCache = [
    "/",
    "/index.html",
    "/assets/css/bulma.min.css",
    "/assets/js/vue.js",
    "/assets/js/all.js",
    "/assets/js/axios.min.js",
    "/assets/js/api.js",
    "/assets/icon/icon.png",
    "/fallback.json"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function (event) {

    var request = event.request;
    var url  = new URL(request.url);

    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(request).then(function(response) {
                return response || fetch(request)
            })
        );
    } else {
        event.respondWith(
            caches.open('articles-cache').then(function(cache) {
                return fetch(request).then(function(liveResponse) {
                    cache.put(request, liveResponse.clone())
                    return liveResponse
                }).catch(function() {
                    return caches.match(request).then(function(response) {
                        if (response) return response
                        return caches.match('/fallback.json')
                    })
                })
            })
        )
    }
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " deleted");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});