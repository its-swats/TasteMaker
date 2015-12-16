// Template.body.events ({
//     'click #scanIt': function(event) {
//         event.preventDefault();
//         Meteor.call('barcodeScan', function(err, res){
//             $('#pageHome').toggleClass('hide');
//             $('#pageDisplay').toggleClass('hide');
//             render = Blaze.render(Template.rateWine, document.querySelector('#pageDisplay'))
//          })
//     }
// });

Template.rateWine.events ({
    'click button': function(event) {
        event.preventDefault();
        var answer = event.target.id;
        convertedAnswer = getAnswer(answer)
        Blaze.remove(render)
        render = Blaze.renderWithData(Template.wineQuestions, {q1: wineQuestions[0][0], q2: wineQuestions[1][0]}, document.querySelector('#pageDisplay'))
        $(document).foundation();
    }
})

Template.wineQuestions.events ({
    'click button': function(event) {
        event.preventDefault();
        //convertedAnswer is still here, stores the like/dislike/hate
        questionOne = parseInt($('.range-slider input')[0].value)
        questionTwo = parseInt($('.range-slider input')[1].value)
        userEvaluation(wineCoords, convertedAnswer, questionOne, questionTwo)
        Blaze.remove(render)
        render = Blaze.renderWithData(Template.finalWineEval, {wineCoords: 0, tasteProfile: 0 }, document.querySelector('#pageDisplay'))
    }
})

Template.finalWineEval.events ({
    'click button': function(event) {
        event.preventDefault();
        //convertedAnswer is still here, stores the like/dislike/hate
        $('#pageHome').toggleClass('hide');
        $('#pageDisplay').toggleClass('hide')
        Blaze.remove(render)
    }
})

var getAnswer = function(answer) {
    switch(answer) {
        case 'like':
            return 10;
            break;
        case 'love':
            return 50;
            break;
        case 'dislike':
            return 'dislike';
            break;
    }
}

function userEvaluation(wineTasteCoordinates, evaluationWine, evaluationX, evaluationY ) {
  var userTaste = wineTasteCoordinates
    if (evaluationWine != 'dislike'){
     userTaste = [userTaste[0] + evaluationX, userTaste[1]]
     userTaste = [userTaste[0],  userTaste[1] + evaluationY]

     // add the userTaste array to user DB, n number of times depending on like(10x) or love(50x)
     var step;
      for (step = 0; step < evaluationWine; step++) {
        Meteor.call("addTaste", userTaste)
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
      Meteor.call("addTaste", userTaste)
       }
     }
}

Template.finalWineEval.rendered = function(){
    makefinalEvalChart();
};

  // var splitUpTheTasteArrays1 = []

  //    var tastes = Taste.find({})
  //    tastes.forEach(function(chicken){splitUpTheTasteArrays1.push(chicken[2].userTaste)})
  //    // .forEach(function(taste){splitUpTheTasteArrays1.push(taste.userTaste)})
  //       console.log(splitUpTheTasteArrays1)
  //       console.log(something);


    function makefinalEvalChart(){
     var contextr = document.getElementById("finalEvalChart").getContext("2d");
      // var tastes = Taste.find({user:Meteor.userId})
      var splitUpTheTasteArrays = []
      Taste.find({}).forEach(function(taste){splitUpTheTasteArrays.push(taste.userTaste)})
      // console.log(splitUpTheTasteArrays)


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


      var datar = {
    labels: ["Bold", "Earthy", "Light", "Fruity"],
    datasets: [
        {
            label : 'ThisWine',
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [0, 0, 0, 0]
        },
        {
            label : 'TasteProfile',
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [bold, earthy, light, fruity]
        }
    ]
};

  var finalEvalChart = new Chart(contextr).Radar(datar);
    }

    // function findTaste(){
    // }

// }