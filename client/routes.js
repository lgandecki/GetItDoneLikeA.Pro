Meteor.Router.add({

    '/': 'home',


    '/myProfile': "myProfile",


    '/login': function() {
        return "login";
    },


    "/loading": function() {
        return "loading";
    },


});

Meteor.Router.filters({
    "postLoad": function(page) {


        var _tran = $("#transition"),
            _html = _tran.html(),
            _off = _tran.offset(),
            _width = _tran.width(),
            _prev = null,
            _easing = "easeInOutBack";

        if (_html && $(".previousPage").length === 0 && !Meteor.loggingIn()) {
            _prev = $("<div class='previousPage'/>").html(_html).css({
                "z-index": 0,
                position: "absolute",
                left: _off.left + "px",
                top: _off.top + "px",
                width: _width + "px"
            });
            $(document.body).append(_prev);
            _tran.hide();
        }

        setTimeout(function() {
            
            if (typeof ga !== 'undefined') {
                ga('send', 'pageview', window.location.pathname);
            }
            else {
                setTimeout(function() {
                    ga('send', 'pageview', window.location.pathname);
                }, 300);
            }


            if (_prev) {
                _prev.animate({
                    "left": ((_width + _off.left) * -1) + "px"
                }, 1200, _easing, function() {
                    _prev.remove();
                });
            }
            $("#transition").css({
                "left": _width + 40 + "px"
            }).show()
                .animate({
                    "left": "0"
                }, 1200, _easing, function() {
                    $(".answer").focus();
                });


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