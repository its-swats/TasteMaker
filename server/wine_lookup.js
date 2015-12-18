Factual.configure({
  key: 'D8beY4zvmZSiK3gbe4YTVkyNJzo1fupVGojOGIgo',
  secret: 'sLcb7jG43KG4ODV7b5LgjE2yBhIYgNo26VZV0t1B'
});


Meteor.methods({
  upcDecoder: function (upcCode) {
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

    Factual.get('/t/products-cpg',{q:upcCode.text},function (error, res) {
      // console.log(res);
      // console.log(error);

      if(error){
          myFuture.throw(error);
      }else{
        var wineName = res.data[0].brand + " " + res.data[0].product_name
        Meteor.call('wineApiLookup', wineName, function(err, res){
          if(err) {
            myFuture.throw('API 2 FAILED!')
          } else {
            console.log(res)
            myFuture.return([res, wineName]);
          }
        })
        // console.log(res)
          // myFuture.return(res);
        }
    });
    return myFuture.wait();

  }
});
