
var varietalsObject = {

var varietalTaste = {
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
    'Syrah/Shiraz':[18,50],
    'Pinot Noir':[10,-7],
    'Cabernet Sauvignon':[5,40],
    'Sangiovese':[35,28],
    'Barbera':[-38,25],
    'Grenache':[-41,12],
    'Malbec':[-31,36],
    'Merlot':[-16,45],
    "Nero d'Avola":[-32,30],
    'Petite Sirah':[3,15],
    'Pinotage':[33,20],
    'Zinfandel':[-35,35],
    'Chianti':[40,15],
    'Primitivo':[-35,35],
    'Tempranillo':[30,28],
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
    'Viognier':[17,-10]
    'Chardonnay':[-9,-13],
    'Sauvignon Blanc':[37,-27],
    'Pinot Gris/Grigio':[1, -31],
    'Albarino':[-10, -31],
    'Chenin Blanc':[-15, 10],
    'Gewurztraminer':[-20, -25],
    'Gruner Veltliner':[-20, -25],
    'Muscat':[-45, 7],
    'Other White Blends':[13, -18],
    'Other White Wine':[13, -18],
    'Pinot Blanc':[-20, -13],
    'Riesling':[-20,-25],
    'Semillon':[-30, 27],
    'Torrontes':[-45, 7],
    'Viognier':[-10, 17],
    'Bordeaux White Blends':[42, -21],
    'Rhône White Blends':[-18, 17]
   }

function getRecommendation(tasteProfile){
    // distance cant get bigger then 145 by construct...
    var smallestDistance = 150;
    var closest = null;
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
    console.log(closest);
}


Template.body.events ({
    'click #wineRec': function(event) {
        event.preventDefault();
        $('#pageHome').addClass('hide');
        $('#pageDisplay').removeClass('hide')
        // Blaze.renderWithData(Template.recReturned, {results: results}, document.querySelector('#recResult'))
        render = Blaze.render(Template.recWine, document.querySelector('#pageDisplay'))
    }
});


Template.recWine.events ({
    'click button': function(event) {
        event.preventDefault();
        $('#pageHome').removeClass('hide');
        $('#pageDisplay').addClass('hide')
        Blaze.remove(render)
    }
})




// find closest number in an array


// function tasteStager(){
//     // gets each tasteProfile array and adds into and array
//     // Meteor.subscribe("Taste", function(){
//       var splitUpTheTasteArrays = []
//       // UserTasteProfile being created here: )does not currently work
//      var tastes =  Taste.find({user: Meteor.userId()}).forEach(function(taste){splitUpTheTasteArrays.push(taste.userTaste)})
//         console.log(splitUpTheTasteArrays)
//         console.log(something);
//         return (splitUpTheTasteArrays)
//     // })
//     }

Template.body.rendered = function() {
var splitUpTheTasteArrays1 = []
    var tastes = Taste.find({})
    tastes.forEach(function(tastes){splitUpTheTasteArrays1.push(tastes.userTaste)})
    // .forEach(function(taste){splitUpTheTasteArrays1.push(taste.userTaste)})
       console.log(splitUpTheTasteArrays1)
       console.log(something);

   tasteAverage(splitUpTheTasteArrays1)
}

function tasteAverage(arrayOfTasteArrays) {


var tastesX = []
var tastesY = []

var step;
  for (step = 0; step < arrayOfTasteArrays.length; step++) {
   tastesX.push(arrayOfTasteArrays[step][0])
   }
   var myAvgX = 0;
   for(var i = 0, len = tastesX.length; i < len; i++) {
   myAvgX += tastesX[i];
}
  tastesX = myAvgX / tastesX.length


var step1;
  for (step1 = 0; step1 < arrayOfTasteArrays.length; step1++) {
   tastesY.push(arrayOfTasteArrays[step1][1])
   }
   var myAvgY = 0;
   for(var i = 0, len = tastesY.length; i < len; i++) {
   myAvgY += tastesY[i];
}
  tastesY = myAvgY / tastesY.length

  getRecommendation([tastesX, tastesY]);
}

