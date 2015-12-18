// UserHistory = new Mongo.Collection("history");

Meteor.methods({
  wineApiLookup: function(name) {
    var uriName = encodeURI(name);
    this.unblock();
    return Meteor.http.call("GET", 'https://services.wine.com/api/beta2/service.svc/json/catalog?search=' + uriName + '&apikey=f6569a177b45d11f2e5dc5fee4bf9e82');
  },

  wineApiRecommendation: function(recommendation) {
      var SearchTerm = varietalIds[recommendation];
      this.unblock()
      recommendationResults = Meteor.http.call("GET", "https://services.wine.com/api/beta2/service.svc/json/catalog?filter=categories(" + SearchTerm + ")&type=Basket&apikey=f6569a177b45d11f2e5dc5fee4bf9e82")
      console.log(recommendationResults)
      return recommendationResults
    }
})

varietalIds = {'Primitivo':10084,
  'Tempranillo':169,
  'Other Red Wine':195,
  'Mourvedre':10083,
  'Nebbiolo':170,
  'Carmenere':10081,
  'Dolcetto':183,
  'Gamay':150,
  'Other Red Blends':145,
  'Bordeaux Blends':144,
  'Chardonnay':140,
  'Sauvignon Blanc':151,
  'Pinot Gris/Grigio':194,
  'Albarino':136,
  'Chenin Blanc':165,
  'Gewurztraminer':166,
  'Gruner Veltliner':10087,
  'Muscat':173,
  'Other White Blends':148,
  'Other White Wine':196,
  'Pinot Blanc':168,
  'Riesling':153,
  'Semillon':177,
  'Torrontes':209,
  'Viognier':162,
  'Bordeaux White Blends':221,
  'Rhône White Blends':10113,
  'Rhône Blends':10082,
  'Cabernet Franc': 197,
  'Syrah/Shiraz': 146,
  'Pinot Noir': 143,
  'Cabernet Sauvignon': 139,
  'Sangiovese': 163,
  'Barbera': 172,
  'Grenache': 10080,
  'Malbec': 10079,
  'Merlot':138,
  "Nero d'Avola": 10086,
  'Petite Sirah': 176,
  'Pinotage': 10085,
  'Zinfandel': 141
}








