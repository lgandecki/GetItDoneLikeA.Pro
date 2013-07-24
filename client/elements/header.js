Template.header.isLoggedIn = function() {
    return Meteor.user();
};

Template.body.rendered = function() {
	_liActive = $('li.active');
	_liActive.removeClass('active');
    var _currentRoute = Meteor.Router.page();
    var _currentRoute = window.location.pathname;
    if (_currentRoute === "/home") {
    	_currentRoute = "/";
    }
    //var _link = Meteor.Router[_currentRoute + "Path"]();
    //var _element = $('a[href="'+_link+'"]');
    var _element = $('a[href="'+_currentRoute+'"]');
    if (_element) {
    	_element.closest('li').addClass('active');
    	_element.closest('li.topNav').addClass('active');
	}
}