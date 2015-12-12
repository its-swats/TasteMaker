Factual.configure({
  key: 'D8beY4zvmZSiK3gbe4YTVkyNJzo1fupVGojOGIgo',
  secret: 'sLcb7jG43KG4ODV7b5LgjE2yBhIYgNo26VZV0t1B'
});


Meteor.methods({
upcDecoder: function (upcCode) {
  console.log(upcCode.text)
  Factual.get('/t/products-cpg',{q:upcCode.text},
    function (error, res) {
      console.log("hit me")
       console.log(res);
       console.log(error)
       return res;
    });
  }
});
