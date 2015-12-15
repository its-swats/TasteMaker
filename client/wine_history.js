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
        $('#pageHome').toggleClass('hide');
        $('#pageDisplay').toggleClass('hide')
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


// if (Meteor.isClient){

//     var scanWine = {name: 'Apothic Red Blend 2012',
//                     year: '2012',
//                     price: 11.99,
//                     style: 'Smooth &amp; Supple',
//                     region: 'California',
//                     varietal: 'Other Red Blends',
//                     type: 'Red Wines',
//                     rating: 88
//     };

// };