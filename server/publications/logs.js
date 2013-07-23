Meteor.publish("logs", function() {
    return Logs.find({userId: this.userId});
});

Meteor.publish("strangerLogs", function(anonymousId) {
	return Logs.find({anonymousId: anonymousId})
})