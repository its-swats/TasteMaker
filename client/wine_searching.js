Meteor.subscribe("taste");
Meteor.subscribe("userHistory");

Template.notFound.events({
    "click #manualSearch": function(event) {
        event.preventDefault();
        var searchText = $('input').val();
        alert('here')
         Meteor.call("wineApiLookup", searchText, function(err, res){
            var results = [res, searchText]
            alert('here')
            showWineResults(results);
        })
    }
})

Meteor.startup(function () {
  Meteor.methods({
    barcodeScan: function(){
      if (Meteor.isCordova){
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            Meteor.call('upcDecoder', result, function(error, results){
               showWineResults(results);
            });
          },
          function (error) {
            alert("Scanning failed: " + error);
          }
        )
      }
    }
  })
})

function showWineResults(results){
  if (!Meteor.isCordova){
    Blaze.remove(render);
  }
  wineResults = wineApiLookupSorting(results[0], results[1])
  wineCoords = wineTasteCoordinates(wineResults.varietal, wineResults.style);
  wineQuestions = questionServer(wineCoords)
  wineResults['user_id'] = Meteor.userId()
  wineResults['wineCoords'] = wineCoords
  Meteor.call("addHistory", wineResults);
  render = Blaze.renderWithData(Template.rateWine, {name: wineResults.name, style: wineResults.style}, document.querySelector('#pageDisplay'))
}


function wineTasteCoordinates(varietal, wineStyle, callback) {
   // Should be DB Collection or we can create static list since none of these numbers change
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
  //Whites
    'Chardonnay':[-13,-9],
    'Sauvignon Blanc':[-27,37],
    'Pinot Gris/Grigio':[-31,0],
    'Muscat':[7,45],
    'Riesling':[-25,-20],
    'Viognier':[17,-10]
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

  var wineVariatalX = varietalTaste[varietal][0]
  var wineVariatalY = varietalTaste[varietal][1]

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



// Driver test code for questionServer
 // var bobo = [30,-30]
 // console.log(questionServer(bobo))


// Driver test code
 // userEvaluation(wineTasteCoordinates("Cabernet_Franc", "Big_&_Bold"),50,4,-5)



var wineApiLookupSorting = function(results, wineName) {
    var wines = {}
    var wineNoYears = {}
    var parsedResponse = JSON.parse(results.content);
    var responseArray = parsedResponse.Products.List
    for (i = 0; i < responseArray.length; i++) {
      var nameSplit = responseArray[i].Name.split(" ");
      var year = nameSplit.pop();
      var name = nameSplit.join(" ")
      var region = responseArray[i].Appellation.Region.Name
      if (responseArray[i].ProductAttributes.length > 0) {
        var style = responseArray[i].ProductAttributes[0].Name
      }
      var varietal = responseArray[i].Varietal.Name
      var type = responseArray[i].Varietal.WineType.Name
      var price = responseArray[i].PriceMax
      if(responseArray[i].Ratings.HighestScore > 0) {
        var rating = responseArray[i].Ratings.HighestScore
      } else {
        var rating = null
      }
      wines[responseArray[i].Name] = {name: name, year: year, price: price, style: style, region: region, varietal: varietal, type: type, rating: rating}
      wineNoYears[name] = 'test'
    }
    return similar(wineName, wines)
    // Meteor.call('similar', wineName, wines);
  }

  var similar = function(searchWord, resultObject){
    var highest = {score: 0}
    results = []
    for (var name in resultObject){
      var lengthsearchWord = searchWord.length;
      var lengthResult = name.length - 5;
      var equivalency = 0;
      var minLength = (lengthsearchWord > lengthResult) ? lengthResult : lengthsearchWord;
      var maxLength = (lengthsearchWord < lengthResult) ? lengthResult : lengthsearchWord;
      for(var i = 0; i < minLength; i++) {
          if(lengthsearchWord[i] == lengthResult[i]) {
              equivalency++;
          }
      }
      var weight = equivalency / maxLength;
      var alikeness = weight * 100



      results.push({name: name, score: alikeness})


    }
    var sorted = _.sortBy(results, 'score').reverse()
    console.log(sorted)
    return sorted[0]
    console.log('worked')
  }
