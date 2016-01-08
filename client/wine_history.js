Template.body.events ({
    'click #wineHistory': function(event) {
        event.preventDefault();
        $('#pageHome').addClass('hide');
        $('#pageDisplay').removeClass('hide')
        render = Blaze.render(Template.wineHistory, document.querySelector('#renderHere'))

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
        var history = UserHistory.find({}, {sort: {date: -1}})
        return history
    }
})

Template.tasteProfile.onRendered(function(){
  histChart();
});

Template.wineHistory.onRendered(function(){
  histChart();
});

function histChart(){
    var context = document.getElementById("histChart").getContext("2d");

    var hist = UserHistory.find({user: Meteor.userId()})
    wineTally = {}
    hist.forEach(function(wine){
      wineTally[wine.wine.varietal] ? wineTally[wine.wine.varietal]++ : wineTally[wine.wine.varietal] = 1
    })

    var data = []

    for (var varietal in wineTally){
        data.push({
            value: wineTally[varietal],
            color: '#'+Math.floor(Math.random()*16777215).toString(16),
            highlight: '#'+Math.floor(Math.random()*16777215).toString(16),
            label: varietal,
            labelColor: "green",
            labelFontSize: "8"
        })
    }

    var options =
{
        tooltipTemplate: "<%= label %>",

    onAnimationComplete: function()
    {
        this.showTooltip(this.segments, true);
    },

    tooltipEvents: [],

    showTooltips: true
}

  var histChart = new Chart(context).Doughnut(data, options);
}