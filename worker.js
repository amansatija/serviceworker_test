
// Cache name definitions
var cacheNameStatic = "sc-static-v1";
var cacheNameWikipedia = "sc-wikipedia-v1";
var cacheNameTypekit = "sc-typekit-v1";

var currentCacheNames = [
  cacheNameStatic,
  cacheNameWikipedia,
  cacheNameTypekit
];
// A new ServiceWorker has been registered
self.addEventListener("install", function (event) {
 event.waitUntil(
   caches.open(cacheNameStatic)
     .then(function (cache) {
       return cache.addAll([
       	"app.js"
       ]);
     })
 );
});

// self.addEventListener("install", function (event) {
//  event.waitUntil(
//    caches.open(cacheNameStatic)
//      .then(function (cache) {
//        return cache.addAll([
//          "/r3search/",
//          "/r3search/js/app.js",
//          "/r3search/css/app.css",
//          "/r3search/img/loading.svg"
//        ]);
//      })
//  );
// });


// A new ServiceWorker is now active
self.addEventListener("activate", function (event) {
 event.waitUntil(
   caches.keys()
     .then(function (cacheNames) {
       return Promise.all(
         cacheNames.map(function (cacheName) {
           if (currentCacheNames.indexOf(cacheName) === -1) {
             return caches.delete(cacheName);
           }
         })
       );
     })
 );
	
	
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
        );

      })
  );
});


function (response) {

//  var shouldCache = false;

//  if (response.type === "basic" && response.status === 200) {
//    shouldCache = cacheNameStatic;
//  } else if (response.type === "opaque") {
//    // if response isn't from our origin / doesn't support CORS
//
//    if (requestURL.hostname.indexOf(".wikipedia.org") > -1) {
//      shouldCache = cacheNameWikipedia;
//    } else if (requestURL.hostname.indexOf(".typekit.net") > -1) {
//      shouldCache = cacheNameTypekit;
//    } else {
//      // just let response pass through, don't cache
//    }
//
//  }
//
//  if (shouldCache) {
//    var responseToCache = response.clone();
//
//    caches.open(shouldCache)
//      .then(function (cache) {
//        var cacheRequest = event.request.clone();
//        cache.put(cacheRequest, responseToCache);
//      });
//  }
  	console.log("response fetched succesfully ");
//    navigator.localStorage.setItem("sample_response",JSON.stringify(response));
  return response;
}