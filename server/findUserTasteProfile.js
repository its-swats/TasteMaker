Meteor.methods({
  methodsController: function(){
   Future = Npm.require('fibers/future');
        var newFuture = new Future();
        Meteor.call('spiltTastes', function(err ,res){
          if(err){
            newFuture.throw(err);
          }else{
            Meteor.call('tasteAverage', res, function(err, res){
              if(err){
                newFuture.throw(err);
              }else{
                Meteor.call('getRecommendation', res, function(err, res){
                  if(err){
                    newFuture.throw(err);
                  }else{
                    Meteor.call('wineApiRecommendation', res, function(err, res){
                      if(err){
                        newFuture.throw(err)
                      }else{
                        var sorted = wineApiLookupSorting(res, 'recommendation');
                        newFuture.return(sorted);
                      }
                    })
                  }
                })
              }
          })
          }
        })
        return newFuture.wait();
    },

    spiltTastes: function() {
      var splitUpTheTasteArrays1 = []
      var tastes = Taste.find({})
      tastes.forEach(function(tastes){splitUpTheTasteArrays1.push(tastes.userTaste)})
      return splitUpTheTasteArrays1
    },

    tasteAverage: function(arrayOfTasteArrays) {
      var myAvgX = 0;
      var myAvgY = 0;
      var tastesX = []
      var tastesY = []

      for (step = 0; step < arrayOfTasteArrays.length; step++) {
        tastesX.push(arrayOfTasteArrays[step][0])
        if(isNaN(tastesX[step])){
          tastesX[step] = 0
        }
      }
      for(var i = 0, len = tastesX.length; i < len; i++) {
        myAvgX += tastesX[i];
      }
      tastesXAxis = (myAvgX / tastesX.length)

      for (step1 = 0; step1 < arrayOfTasteArrays.length; step1++) {
        tastesY.push(arrayOfTasteArrays[step1][1])
        if(isNaN(tastesY[step1])){
          tastesY[step] = 0
        }
      }

      for(var i = 0, len = tastesY.length; i < len; i++) {
        myAvgY += tastesY[i];
      }
      tastesYAxis = (myAvgY / tastesY.length)
      return [tastesXAxis, tastesYAxis]
    },

    getRecommendation: function(tasteProfile){
    // distance cant get bigger then 145 by construct...
      if(isNaN(tasteProfile[0])){
          tasteProfile[0] = 15
      }

      if(isNaN(tasteProfile[1])){
          tasteProfile[1] = 15
      }

      var smallestDistance = 150;
      var closest = null;
      console.log(tasteProfile)
      for (var varietalCoordinate in varietalsObject) {
        var xs = 0;
        var ys = 0;
        xs = varietalsObject[varietalCoordinate][0] - tasteProfile[0];
        xs = xs * xs;

        ys = varietalsObject[varietalCoordinate][1] - tasteProfile[1];
        ys = ys * ys;
        var distance = Math.sqrt( xs + ys );
          if (distance < smallestDistance){
              smallestDistance = distance;
              closest = varietalCoordinate;
          }
      }
      return closest
    }
  })

varietalsObject = {
 //Reds
   'Cabernet Franc':[30,30],
   'Syrah/Shiraz':[50,18],
   'Pinot Noir':[-7,10],
   'Cabernet Sauvignon':[40,5],
   'Sangiovese':[28,35],
   'Barbera':[25,-38],
   'Grenache':[12,-41],
   'Malbec':[36,-31],
   'Merlot':[45,-16],
   "Nero d'Avola":[30,-32],
   'Petite Sirah':[15,3],
   'Pinotage':[20,33],
   'Zinfandel':[35,-35],
   'Chianti':[15,40],
   'Tempranillo':[28,30],
   'Primitivo':[-35,35],
   'Other Red Wine':[-4,36],
   'Mourvedre':[10,10],
   'Nebbiolo':[40,30],
   'Carmenere':[10,1],
   'Dolcetto':[-35,25],
   'Gamay':[-36,-45],
   'Rhône Blends':[-34,17],
   'Other Red Blends':[-4,36],
   'Bordeaux Blends':[-15,40],

 //Whites
   'Chardonnay':[-13,-9],
   'Sauvignon Blanc':[-27,37],
   'Pinot Gris/Grigio':[-31,0],
   'Muscat':[7,45],
   'Riesling':[-25,-20],
   'Viognier':[17,-10],
   'Albarino':[-10, -31],
   'Chenin Blanc':[-15, 10],
   'Gewurztraminer':[-20, -25],
   'Gruner Veltliner':[-20, -25],
   'Other White Blends':[13, -18],
   'Other White Wine':[13, -18],
   'Pinot Blanc':[-20, -13],
   'Semillon':[-30, 27],
   'Torrontes':[-45, 7],
   'Bordeaux White Blends':[42, -21],
   'Rhône White Blends':[-18, 17]
  }

