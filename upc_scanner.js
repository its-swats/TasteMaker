Meteor.startup(function () {
  if (Meteor.isCordova){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        alert(result.text)
        Meteor.call('upcDecoder', result, function(error, results) {
        alert(results[0].product_name)
      });
      },
      function (error) {
          alert("Scanning failed: " + error);
      }
    );
  }
})
