// console.log('Service Worker is registered');

let staticCache = 'v4';
let restaurantCache = [
				'/',
				'/index.html',
				'/restaurant.html',
				'/css/styles.css',
				'/data/restaurants.json',
				'/img/1.jpg',
				'/img/2.jpg',
				'/img/3.jpg',
				'/img/4.jpg',
				'/img/5.jpg',
				'/img/6.jpg',
				'/img/7.jpg',
				'/img/8.jpg',
				'/img/9.jpg',
				'/img/10.jpg',
				'/js/dbhelper.js',
				'/js/main.js',
				'/js/restaurant_info.js'
			];

self.addEventListener('install', function(event) {
	event.waitUntil(
	    caches.open(staticCache).then(function(cache) {
//	    	console.log('Opened cache');
	        return cache.addAll(restaurantCache);
      	})
	);
});

self.addEventListener('activate', function(event) {
	console.log('Service Worker Activated');
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
			    cacheNames.filter(function(cacheName) {
			    	return cacheName != staticCache;
			    }).map(function(cacheName) {
			    	return caches.delete(cacheName);
			    })
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		.then(function(response) {
			if (response) {
//				console.log('Found a response in the cache.');
				return response;
			} else {
//				console.log('No response in cache, fetching one');
				return fetch(event.request)
				.then(function(response) {
					const responseToCache = response.clone();
					caches.open(staticCache)
					.then(function(cache) {
						cache.put(event.request, responseToCache);
					});
					return response;
				})
				.catch(function(error) {
					console.log(error);
				});
			}
		})
	);
});

