// UserHistory = new Mongo.Collection("history");

Template.body.events ({
    'click #wineHistory': function(event) {
        event.preventDefault();
        if (typeof render !== 'undefined') {
            Blaze.remove(render);
        }
        $('#pageHome').addClass('hide');
        $('#pageDisplay').removeClass('hide')
        render = Blaze.render(Template.wineHistory, document.querySelector('#pageDisplay'))
    },

    'scan': function() {
        historyInsert();
    }
})

Template.wineHistory.events ({
    'click button': function(event) {
        event.preventDefault();
        $('#pageHome').toggleClass('hide');
        $('#pageDisplay').toggleClass('hide')
        Blaze.remove(render)
    }
})

if (Meteor.isClient){

    var scanWine = {name: 'Apothic Red Blend 2012',
                    year: '2012',
                    price: 11.99,
                    style: 'Smooth &amp; Supple',
                    region: 'California',
                    varietal: 'Other Red Blends',
                    type: 'Red Wines',
                    rating: 88
    };

    var hey = {hello: "hi"}

    Template.wineHistory.rendered = function(){
        console.log("rendered");
        historyInsert(scanWine);
        // Meteor.call("historyInsert", scanWine);
    };

};

historyInsert = function(scanWine){
    console.log(scanWine)
    UserHistory.insert({
        name: scanWine.name
    })
    console.log(UserHistory.find({}))
}

// Meteor.methods({

//     historyInsert: function(scanWine){

//         console.log(scanWine)

//         var name = scanWine.name

//         // UserHistory.insert({
//         //     name: name
//         // })

//     }

// });