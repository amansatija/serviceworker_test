// Register our ServiceWorker
if (navigator.serviceWorker) {
  navigator.serviceWorker.register("worker.js", {
  }).then(function (reg) {
    console.log("SW register success", reg);
  }, function (err) {
    console.log("SW register fail", err);
  });
}

$.get( "http://localhost/serviceworker_test/test_service.php", function( data ) {
//  console.log('loaded response==='+data);
  
});

 