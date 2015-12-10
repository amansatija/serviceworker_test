//importScripts('serviceworker-cache-polyfill.js');//this cache polyfill has has been deprecated ,,,,@see:https://github.com/coonsta/cache-polyfill/issues/17
// Cache name definitions
var cacheNameStatic = "sc-static-v2";
var cacheNameWikipedia = "sc-wikipedia-v2";
var cacheNameTypekit = "sc-typekit-v2";
var cacheNamePostMessage = "sc-post-message-v2";
var cacheNameKwsDict = "sc-kws-dict-v2";

var currentCacheNames = [
  cacheNameStatic,
  cacheNameWikipedia,
  cacheNameTypekit,
  cacheNamePostMessage,
  cacheNameKwsDict
];

var filesToBeAdded = [
  "app.js"
];
// A new ServiceWorker has been registered
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheNameStatic)
    .then(function (cache) {
      return cache.addAll(filesToBeAdded);
    })
  );
});
// A new ServiceWorker is now active
self.addEventListener("activate", function (event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  event.waitUntil(
    caches.keys()
    .then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (currentCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return clients.claim();
    }).then(function() {
      // After the activation and claiming is complete, send a message to each of the controlled
      // pages letting it know that it's active.
      // This will trigger navigator.serviceWorker.onmessage in each client.
      return self.clients.matchAll().then(function(clients) {
        return Promise.all(clients.map(function(client) {
          return client.postMessage('The service worker has activated and ' +
                                    'taken control.');
        }));
      });
    })
  );
});


self.addEventListener('message', function(event) {
  console.log('Handling message event:', event);
  var request;
  caches.open(cacheNamePostMessage).then(function(cache) {
    switch (event.data.command) {
        // This command returns a list of the URLs corresponding to the Request objects
        // that serve as keys for the current cache.
      case 'keys':
        cache.keys().then(function(requests) {
          var urls = requests.map(function(request) {
            return request.url;
          });

          return urls.sort();
        }).then(function(urls) {
          // event.ports[0] corresponds to the MessagePort that was transferred as part of the controlled page's
          // call to controller.postMessage(). Therefore, event.ports[0].postMessage() will trigger the onmessage
          // handler from the controlled page.
          // It's up to you how to structure the messages that you send back; this is just one example.
          event.ports[0].postMessage({
            error: null,
            urls: urls
          });
        });
        break;

        // This command adds a new request/response pair to the cache.
      case 'add':
        // If event.data.url isn't a valid URL, new Request() will throw a TypeError which will be handled
        // by the outer .catch().
        // Hardcode {mode: 'no-cors} since the default for new Requests constructed from strings is to require
        // CORS, and we don't have any way of knowing whether an arbitrary URL that a user entered supports CORS.
        request = new Request(event.data.url, {mode: 'no-cors'});
        cache.add(request).then(function() {
          event.ports[0].postMessage({
            error: null
          });
        });
        break;

        // This command removes a request/response pair from the cache (assuming it exists).
      case 'delete':
        request = new Request(event.data.url);
        cache.delete(request).then(function(success) {
          event.ports[0].postMessage({
            error: success ? null : 'Item was not found in the cache.'
          });
        });
        break;

      default:
        // This will be handled by the outer .catch().
        throw 'Unknown command: ' + event.data.command;
    }
  }).catch(function(error) {
    // If the promise rejects, handle it by returning a standardized error message to the controlled page.
    console.error('Message handling failed:', error);

    event.ports[0].postMessage({
      error: error.toString()
    });
  });
});



// The page has made a request
self.addEventListener("fetch", function (event) {
  var requestURL = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      // we have a copy of the response in our cache, so return it
      if (response) {
        return response;  //no network request necessary
      }
      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(  //
        //handle the response from the network (see next code block)
        function (response) {
          var shouldCache = false;
          if (response.type === "basic" && response.status === 200) {
            shouldCache = cacheNameKwsDict;
          } 
//          else if (response.type === "opaque") {
//            // if response isn't from our origin / doesn't support CORS
//
//            if (requestURL.hostname.indexOf(".wikipedia.org") > -1) {
//              shouldCache = cacheNameWikipedia;
//            } else if (requestURL.hostname.indexOf(".typekit.net") > -1) {
//              shouldCache = cacheNameTypekit;
//            } else {
//              // just let response pass through, don't cache
//            }
//
//          }
          if (shouldCache) {
            var responseToCache = response.clone();
            caches.open(shouldCache)
              .then(function (cache) {
              var cacheRequest = event.request.clone();
              cache.put(cacheRequest, responseToCache);
            });
          }
          return response;
        }
      );
    })
  );
});

