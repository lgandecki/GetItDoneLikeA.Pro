Template.hallOfFame.created = function() {
	Meteor.subscribeWithPagination('topUsers', 10);
};