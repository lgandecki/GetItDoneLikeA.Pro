Meteor.Router.add({

    '/': 'home',


    '/myProfile': "myProfile",

    '/logsHistory': 'logsHistory',

    '/login': function() {
        return "login";
    },


    "/loading": function() {
        return "loading";
    },


});

Meteor.Router.filters({
    "postLoad": function(page) {


       
        setTimeout(function() {
            
            if (typeof ga !== 'undefined') {
                ga('send', 'pageview', window.location.pathname);
            }
            else {
                setTimeout(function() {
                    ga('send', 'pageview', window.location.pathname);
                }, 300);
            }


         

        }, 10);



        if (Meteor.loggingIn()) {
            return "loading";

        } else if (Meteor.userId()) {

            return page;
        } else {
            return "welcomeStranger";
        }

    }
});


Meteor.Router.filter('postLoad');