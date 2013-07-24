Meteor.publish("currentLog", function(currentLogId) {
    return Logs.find({userId: this.userId, _id: currentLogId});
});

Meteor.publish("previousLog", function(previousLogId) {
	return Logs.find({userId: this.userId, _id: previousLogId})
});

Meteor.publish("strangerLogs", function(anonymousId) {
	return Logs.find({anonymousId: anonymousId})
})

Meteor.publish('logsHistory', function(limit) {
  return Logs.find({userId: this.userId}, {sort: {timeEnded: -1}}, {limit: limit});
});
