Template.body.created = function() {
	_strangerId = new Meteor.Collection.ObjectID()._str;
	Session.set("strangerId", _strangerId);
}

Meteor.subscribe("userData");

if (Meteor.user()) {
	Meteor.subscribe("logs");
} else {
	Meteor.subscribe("strangerLogs", Session.get("strangerId"));
}
