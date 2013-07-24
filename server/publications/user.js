Meteor.publish('topUsers', function(limit) {
  return Posts.find({}, {sort: {completedLogs: -1}, limit: limit});
});