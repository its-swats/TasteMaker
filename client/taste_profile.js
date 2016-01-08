Template.body.events ({
  'click #tasteProfile': function(event) {
    event.preventDefault();
    $('#pageHome').addClass('hide');
    $('#pageDisplay').removeClass('hide')
    render = Blaze.render(Template.tasteProfile, document.querySelector('#renderHere'))
  }
});

Template.tasteProfile.helpers({
  history: function(){
    return UserHistory.find({user: Meteor.userId()})
  },
  varietalPercentage: function(){
    var hist = UserHistory.find({user: Meteor.userId()})
    wineTally = {}
    hist.forEach(function(wine){
      wineTally[wine.wine.varietal] ? wineTally[wine.wine.varietal]++ : wineTally[wine.wine.varietal] = 1
    })

    var varietals = []
    for (var wine in wineTally) {
      varietals.push(wine)
    }

    var histCount = UserHistory.find({}).count()

    var percentages = []
    for (var wine in wineTally){
      percentages.push(Math.floor((wineTally[wine]/histCount)*100))
    }

    // make object with varietal and percentage properties
    var results = []
    for (var i=0; i<varietals.length; i++){
      results.push({varietal: varietals[i], percentage: percentages[i]})
    }
    results.sort(function(a, b) {
      return b.percentage - a.percentage
    })
    // debugger
    return results
  }
})

Template.tasteProfile.events ({
  'click button': function(event) {
    event.preventDefault();
    $('#pageHome').removeClass('hide');
    $('#pageDisplay').addClass('hide')
    Blaze.remove(render)
  }
});

Template.tasteProfile.onRendered(function () {
  makeChart();
});

function makeChart(){
  var context = document.getElementById("myChart").getContext("2d");
  var contextr = document.getElementById("myRadarChart").getContext("2d");

  var tastes = Taste.find({user:Meteor.userId()})
  var splitUpTheTasteArrays = []
  tastes.forEach(function(taste){splitUpTheTasteArrays.push(taste.userTaste)})

  var bold = 0;
  var fruity = 0;
  var earthy = 0;
  var light = 0;

  for (i=0; i<splitUpTheTasteArrays.length;i++){
    if (splitUpTheTasteArrays[i][0] > 0) {
      earthy += splitUpTheTasteArrays[i][0];
    }else if(splitUpTheTasteArrays[i][0] < 0){
      fruity += -(splitUpTheTasteArrays[i][0]);
    }
    if (splitUpTheTasteArrays[i][1] > 0) {
      bold += splitUpTheTasteArrays[i][1];
    }else if(splitUpTheTasteArrays[i][1] < 0){
      light += -(splitUpTheTasteArrays[i][1]);
    }
  }

  var bold = bold/splitUpTheTasteArrays.length;
  var fruity = fruity/splitUpTheTasteArrays.length;
  var earthy = earthy/splitUpTheTasteArrays.length;
  var light = light/splitUpTheTasteArrays.length;


  var data = [
  {
    value: bold,
    color:"#F7464A",
    highlight: "#FF5A5E",
    label: "Bold"
  },
  {
    value: fruity,
    color: "#46BFBD",
    highlight: "#5AD3D1",
    label: "Fruity"
  },
  {
    value: light,
    color: "#FDB45C",
    highlight: "#FFC870",
    label: "Light"
  },
  {
    value: earthy,
    color: "#949FB1",
    highlight: "#A8B3C5",
    label: "Earthy"
  }

  ];
  var pOptions =
  {
    tooltipTemplate: "<%= label %>",

    onAnimationComplete: function()
    {
      this.showTooltip(this.segments, true);
    },

    tooltipEvents: [],

    showTooltips: true,
}

var histTastes = UserHistory.find({user: Meteor.userId()})
var splitUpTheHistoryArrays = []
histTastes.forEach(function(wine){splitUpTheHistoryArrays.push(wine.wine.wineCoords)})

var histBold = 0;
var histFruity = 0;
var histEarthy = 0;
var histLight = 0;

for (i=0; i<splitUpTheHistoryArrays.length;i++){
  if (splitUpTheHistoryArrays[i][0] > 0) {
    histEarthy += splitUpTheHistoryArrays[i][0];
  }else if(splitUpTheHistoryArrays[i][0] < 0){
    histFruity += -(splitUpTheHistoryArrays[i][0]);
  }
  if (splitUpTheHistoryArrays[i][1] > 0) {
    histBold += splitUpTheHistoryArrays[i][1];
  }else if(splitUpTheHistoryArrays[i][1] < 0){
    histLight += -(splitUpTheHistoryArrays[i][1]);
  }
}

var histBold = histBold/splitUpTheHistoryArrays.length;
var histFruity = histFruity/splitUpTheHistoryArrays.length;
var histEarthy = histEarthy/splitUpTheHistoryArrays.length;
var histLight = histLight/splitUpTheHistoryArrays.length;

var datar = {
  labels: ["Bold", "Earthy", "Light", "Fruity"],
  datasets: [
  {
    label: "wines done drank",
    fillColor: "rgba(151,187,205,0.2)",
    strokeColor: "rgba(220,220,220,1)",
    pointColor: "rgba(220,220,220,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(220,220,220,1)",
    data: [histBold, histEarthy, histLight, histFruity]
  },
  {
    label: "taste likes",
    fillColor: "rgba(255,0,0,0.2)",
    strokeColor: "rgba(255,0,0,0.2)",
    pointColor: "rgba(255,0,0,0.2)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(151,187,205,1)",
    data: [bold, earthy, light, fruity]

  }
  ]
};

  var rOptions =
  {
    tooltipTemplate: "<%= label %>",

    onAnimationComplete: function()
      {
        this.showTooltip(this.segments, true);
      },

    tooltipEvents: [],

    showTooltips: true,
    pointLabelFontSize: 15,
    pointLabelFontColor: "#5d0234", pointLabelFontFamily: "'PT Serif'", angleLineColor: "rgb(93,2,52)"
  }

  var myNewChart = new Chart(context).PolarArea(data, pOptions);
  var myRadarChart = new Chart(contextr).Radar(datar, rOptions);
}

// function wineTasteCoordinates(varietal, wineStyle) {

//  // Should be DB Collection or we can create static list since none of these numbers change
//  var varietalTaste = {'Cabernet_Franc': [30,30],'Syrah': [50,18]}
//  var varietalStyle = {'Big_and_Bold': [0,5], 'Earthy_and_Spicy': [5,0] }

//   // Varietal default coordinates from our wine taste mapping work
//   var wineVariatalX = varietalTaste[varietal][0]
//   var wineVariatalY = varietalTaste[varietal][1]

//   // Wine.com's style preferences added to more accurately position wine within varietal's mapped range
//   var wineStyleX = varietalStyle[wineStyle][0]
//   var wineStyleY = varietalStyle[wineStyle][1]

//   // Creates wines specific taste profile coordinates
//   var wineTC = [wineStyleX+wineVariatalX, wineStyleY+wineVariatalY]
//   return wineTC

// }
