Template.welcomeStranger.created = function() {
	_strangerId = new Meteor.Collection.ObjectID()._str;
	Session.set("strangerId", _strangerId);
}

Meteor.subscribe("userData");

if (Meteor.user()) {
	Meteor.subscribe("previousLog", Session.get("previousLogId"));
	Meteor.subscribe("currentLog", Session.get("currentLogId"));
} else {
	Meteor.subscribe("strangerLogs", Session.get("strangerId"));
}
