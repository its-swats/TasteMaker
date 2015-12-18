Meteor.subscribe("taste");
Meteor.subscribe("userHistory");


Template.notFound.events({
    "click #manualSearch": function(event) {
        event.preventDefault();
        var searchText = $('input').val();
         Meteor.call("wineApiLookup", searchText, function(err, res){
            var sorted = wineApiLookupSorting(res, searchText)
            var results = [sorted, searchText]
            console.log(results)
            narrowDownSearch(results);
        })
    }
})

Meteor.startup(function() {
  Meteor.methods({
    barcodeScan: function(){
      if (Meteor.isCordova){
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (result.text.length > 0){
              Meteor.call('upcDecoder', result, function(error, results){
                var sorted = wineApiLookupSorting(results[0], results[1])
                var stuff = [sorted, results[1]]
                narrowDownSearch(stuff);
              });
            }else{
              if (typeof render !== 'undefined') {
                Blaze.remove(render);
              }
              $('#pageDisplay').addClass('hide');
              $('#pageHome').removeClass('hide');
            }
          },
          function (error) {
            alert("Scanning failed: " + error);
          }
        )
      }
    }
  })
})

function narrowDownSearch(wines) {
  if (typeof render !== 'undefined') {
    Blaze.remove(render);
  }
  wineArray = wines

  if (wineArray[0].length === 0){
    Blaze.render(Template.noResults, document.querySelector('#renderHere'))
  }else{
  render = Blaze.renderWithData(Template.searchSelection, {wines: wines[0]}, document.querySelector('#renderHere'))
  }
}


Template.searchSelection.events({
    "click .wine_search_box": function(event) {
        event.preventDefault();
        var clickedId = event.target.parentElement.id;
        if (clickedId === "") {
          clickedId = event.target.parentElement.parentElement.id;
        }
        Blaze.remove(render);
        wineArray = wineArray[0][clickedId];
        showWineResults(wineArray);
    }
})

function showWineResults(results){
  // if (!Meteor.isCordova){
  //   Blaze.remove(render);
  // }
  // wineResults = wineApiLookupSorting(results[0], results[1])
  wineCoords = wineTasteCoordinates(results.varietal, results.style);
  wineQuestions = questionServer(wineCoords)
  results['user_id'] = Meteor.userId()
  results['wineCoords'] = wineCoords
  Meteor.call("addHistory", results);
  render = Blaze.renderWithData(Template.rateWine, {name: results.name, style: results.style}, document.querySelector('#renderHere'))
}

function wineTasteCoordinates(varietal, wineStyle, callback) {
   // Should be DB Collection or we can create static list since none of these numbers change
var wineVariatalX = 15
var wineVariatalY = 15

var varietalTaste = {
  //Reds
    'Cabernet Franc':[30,30],
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

  var varietalStyle = {
  //Reds
    'Big &amp; Bold':[0,5],
    'Earthy &amp; Spicy':[5,3],
    'Light &amp; Fruity':[-3,-3],
    'Smooth &amp; Supple':[-4,2],
  //Whites
    'Fruity &amp; Smooth':[-5,2],
    'Rich &amp; Creamy':[-3,1],
    'Light &amp; Crisp':[-3,-3]
  }

  // Varietal default coordinates from our wine taste mapping work

for(var wine in varietalTaste){
  if(wine === varietal){
    wineVariatalX = varietalTaste[wine][0]
    wineVariatalY = varietalTaste[wine][1]
  }
}

  // Wine.com's style preferences added to more accurately position wine within varietal's mapped range
   if (wineStyle === 'Big &amp; Bold' || wineStyle === 'Earthy &amp; Spicy' || wineStyle === 'Light &amp; Fruity' || wineStyle === 'Smooth &amp; Supple'|| wineStyle === 'Rich &amp; Creamy' || wineStyle === 'Light &amp; Crisp' || wineStyle === 'Fruity &amp; Smooth') {
      var wineStyleX = varietalStyle[wineStyle][0]
      var wineStyleY = varietalStyle[wineStyle][1]
   } else {
      var wineStyleX = 0
      var wineStyleY = 0
   };
  // Creates wines specific taste profile coordinates
  var wineTC = [wineStyleX+wineVariatalX, wineStyleY+wineVariatalY]
  return wineTC
  // callback()
}



 // evalutaionWine= 'dislike' 10(like) or 50(love), evaluationX= fruit/earth, evaluationY is bold/light
function userEvaluation(wineTasteCoordinates, evaluationWine, evaluationX, evaluationY ) {
  var userTaste = wineTasteCoordinates
    if (evaluationWine != 'dislike'){
     userTaste = [userTaste[0] + evaluationX, userTaste[1]]
     userTaste = [userTaste[0],  userTaste[1] + evaluationY]

     // add the userTaste array to user DB, n number of times depending on like(10x) or love(50x)
     var step;
      for (step = 0; step < evaluationWine; step++) {
        // console.log(userTaste)
       Meteor.call("addTaste", userTaste);
     }

    } else {
     userTaste = [userTaste[0] + evaluationX, userTaste[1]]
     userTaste = [userTaste[0],  userTaste[1] + evaluationY]

     // Inverts the users choice to the opposite side of the taste spectrum
     userTaste = [userTaste[0] * -2  + userTaste[0], userTaste[1]]
     userTaste = [userTaste[0], userTaste[1] + userTaste[1] * -2 ]

      // add the inverted userTaste array to user DB, 2 times (hardcoded) due to 'dislike'
     var step;
      for (step = 0; step < 2; step++) {
        Meteor.call("addTaste", userTaste);
       }
     }
}

// Sample questions for the 2nd and 3rd user questions.
var questions = {
    "bold": [{"question": "Did you like that this wine had bold flavors?", "values":[-5,5]}, {"question": "Did you think the wines flavors were too bold?", "values":[5,-5]}],
    "light": [{"question": "Did you like that this wine had a light flavor?", "values":[-5,5]}, {"question": "Did you think the wines flavors were too bold?", "values":[5,-5]}],
    "fruity": [{"question": "Did you like that this wine had fruity flavors?", "values":[-5,5]}, {"question": "Did you think the wines flavors were too fruity?", "values":[5,-5]}],
    "earthy": [{"question": "Did you like that this wine had earthy flavors?", "values":[-5,5]}, {"question": "Did you think the wines flavors were too earthy?", "values":[5,-5]}]
}

function questionServer(wineCoordinates, callback) {
  var questionsFinal = []
  if (wineCoordinates[0] >= 0) {
    if (wineCoordinates[1] >= 0){
      // return array with both question generators(earthy, bold)
      questionsFinal.push(questionGenerator("earthy"))
      questionsFinal.push(questionGenerator("bold"))
       return questionsFinal
    } else {
     // return array with both question generators (earthy, light)
      questionsFinal.push(questionGenerator("earthy"))
      questionsFinal.push(questionGenerator("light"))
       return questionsFinal
    }
 } else {
      if (wineCoordinates[1] >= 0){
     // return array with both question generators(fruity, bold)
      questionsFinal.push(questionGenerator("fruity"))
      questionsFinal.push(questionGenerator("bold"))
       return questionsFinal
    } else {
     // return array with both question generators (fruity, light)
      questionsFinal.push(questionGenerator("fruity"))
      questionsFinal.push(questionGenerator("light"))
       return questionsFinal
    }
  }
  // callback();
};

// Chooses random question from array when passed a flavorElement ('bold','light','fruity','earthy')
function questionGenerator(flavorElement, callback) {
  var x = Math.floor((Math.random() * 1));
  var question = questions[flavorElement][x].question;
  var values = questions[flavorElement][x].values;
  var selection = [question, values]
  // callback();
    return selection;
};
