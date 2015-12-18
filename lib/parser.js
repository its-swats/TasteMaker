wineApiLookupSorting = function(results, wineName) {
  var wines = {}
  console.log(wineName);
  var wineNoYears = {}
  var parsedResponse = JSON.parse(results.content);
  var responseArray = parsedResponse.Products.List
  for (i = 0; i < responseArray.length; i++) {
    var nameSplit = responseArray[i].Name.split(" ");
    var year = nameSplit.pop();
    var name = nameSplit.join(" ")
    console.log('after name')
    if (typeof responseArray[i].Appellation.Region === 'object' && typeof responseArray[i].Appellation.Region.Name === "string"){
      var region = responseArray[i].Appellation.Region.Name
    } else{
      var region = 'Other'
    }
    console.log(region);
    if (responseArray[i].ProductAttributes.length > 0) {
      var style = responseArray[i].ProductAttributes[0].Name
    }
    if (responseArray[i].Labels.length > 0){
      var img = responseArray[i].Labels[0].Url
    }
    var varietal = responseArray[i].Varietal.Name
    var type = responseArray[i].Varietal.WineType.Name
    var price = responseArray[i].PriceMax
    if(responseArray[i].Ratings.HighestScore > 0) {
      var rating = responseArray[i].Ratings.HighestScore
    } else {
      var rating = null
    }
    wines[name] = {name: name, year: year, price: price, style: style, region: region, varietal: varietal, type: type, rating: rating, img: img}
  }
  return similar(wineName, wines)
}

  var similar = function(searchWord, resultObject){
    if (searchWord === "recommendation") {
      var wineResultArray = _.map(resultObject, function(value, index) {
        return [value];
      });
      // console.log(wineResultArray)
      return wineResultArray;
    } else {
      var results = []
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
      var sortedNames = _.sortBy(results, 'score').reverse()
      var sortedWineObjects = []
      for(i = 0; i < sortedNames.length; i++){
        sortedWineObjects.push(resultObject[sortedNames[i].name])
      }

      return sortedWineObjects
    }
  }
