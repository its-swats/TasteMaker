Template.body.events ({
    'click #wineHistory': function(event) {
        event.preventDefault();
        if (typeof render !== 'undefined') {
            Blaze.remove(render);
        }
        $('#pageHome').addClass('hide');
        $('#pageDisplay').removeClass('hide')
        render = Blaze.render(Template.wineHistory, document.querySelector('#pageDisplay'))

    }
})

Template.wineHistory.events ({
    'click button': function(event) {
        event.preventDefault();
        $('#pageHome').removeClass('hide');
        $('#pageDisplay').addClass('hide')
        Blaze.remove(render)
    }
})

Template.wineHistory.onCreated(function () {
  // Use this.subscribe inside onCreated callback
    console.log('two')
    this.subscribe('userHistory')
});

Template.wineHistory.helpers({
    history: function(){
        return UserHistory.find({})
    }
})

Template.wineHistory.onRendered(function(){
  histChart();
});


function histChart(){
  var context = document.getElementById("histChart").getContext("2d");

  var wineHist = UserHistory.find({user: Meteor.userId()})
  var varietals = []
  wineHist.forEach(function(wine){varietals.push(wine.varietal)})

//Reds
    var CabFranc = 0
    var Syrah = 0
    var PN = 0
    var Cab = 0
    var Sangio = 0
    var Barb = 0
    var Grenache = 0
    var Malbec = 0
    var Merlot = 0
    var Nero = 0
    var PSyrah = 0
    var Pinotage = 0
    var Zin = 0
    var Chianti = 0
    var Temp = 0
//Whites
    var Chard = 0
    var SB = 0
    var PG = 0
    var Muscat = 0
    var Ries = 0
    var Viog = 0

    for (i=0; i<varietals.length; i++){

    }

  var data = [
    {
        value: CabFranc,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Cabernet Franc"
    },
    {
        value: Syrah,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Syrah/Shiraz"
    },
    {
        value: PN,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Pinot Noir"
    },
    {
        value: Cab,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Cabernet Sauvignon"
    },
    {
        value: Sangio,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Sangiovese"
    },
    {
        value: Barb,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Barbera"
    },

    {
        value: Grenache,
        color: "pink",
        highlight: "pink",
        label: "Grenache"
    },
    {
        value: Malbec,
        color: "blue",
        highlight: "blue",
        label: "Malbec"
    },
    {
        value: Merlot,
        color: "green",
        highlight: "green",
        label: "Merlot"
    },
    {
        value: Nero,
        color: "purple",
        highlight: "purple",
        label: "Nero d'Avola"
    },
    {
        value: PSyrah,
        color: "red",
        highlight: "red",
        label: "Petite Syrah"
    },
    {
        value: Pinotage,
        color: "yellow",
        highlight: "yellow",
        label: "Pinotage"
    },
    {
        value: Zin,
        color: "orange",
        highlight: "orange",
        label: "Zinfandel"
    },
    {
        value: Chianti,
        color: "gray",
        highlight: "gray",
        label: "Chianti"
    },
    {
        value: Temp,
        color: "brown",
        highlight: "brown",
        label: "Tempranillo"
    },
    {
        value: Chard,
        color: "black",
        highlight: "black",
        label: "Chardonnay"
    },
    {
        value: SB,
        color: "white",
        highlight: "white",
        label: "Sauvignon Blanc"
    },
    {
        value: PG,
        color: "purple",
        highlight: "purple",
        label: "Pino Gris/Grigio"
    },
    {
        value: Muscat,
        color: "orange",
        highlight: "orange",
        label: "Muscat"
    },
    {
        value: Ries,
        color: "blue",
        highlight: "blue",
        label: "Riesling"
    },
    {
        value: Viog,
        color: "yellow",
        highlight: "yellow",
        label: "Viognier"
    }
  ]

  var histChart = new Chart(context).Doughnut(data);
}

