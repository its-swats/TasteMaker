Taste = new Mongo.Collection("taste");

Template.body.events ({
    'click #tasteProfile': function(event) {
        event.preventDefault();
        $('#pageHome').toggleClass('hide');
        $('#pageDisplay').toggleClass('hide')
        // Blaze.renderWithData(Template.recReturned, {results: results}, document.querySelector('#recResult'))
        render = Blaze.render(Template.tasteProfile, document.querySelector('#pageDisplay'))
    }
});

Template.tasteProfile.events ({
    'click button': function(event) {
        event.preventDefault();
        $('#pageHome').toggleClass('hide');
        $('#pageDisplay').toggleClass('hide')
        Blaze.remove(render)
    }
})

Template.tasteProfile.rendered = function(){
    makeChart();
    console.log("rendering a template")
};

if (Meteor.isClient){
    function makeChart(){
      console.log("making a chart")
      var context = document.getElementById("myChart").getContext("2d");

      var data = [
        {
            value: 300,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
        },
        {
            value: 50,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Green"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Yellow"
        },
        {
            value: 40,
            color: "#949FB1",
            highlight: "#A8B3C5",
            label: "Grey"
        }

      ];

      var myNewChart = new Chart(context).PolarArea(data);

    }
}