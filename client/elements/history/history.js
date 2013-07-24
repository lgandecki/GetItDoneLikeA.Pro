logsHandle = Meteor.subscribeWithPagination('logsHistory', 5);

Template.logsHistory.log = function() {
    return Logs.find({userId: Meteor.userId()}, {limit: logsHandle.limit()});
}


Template.logsHistory.helpers({
  logsReady: function() {
    return ! logsHandle.loading();
  },
  allLogsLoaded: function() {
    return ! logsHandle.loading() && 
      Logs.find().count() < logsHandle.loaded();
  }
});


Template.logsHistory.events({
  'click .btn-loadMore': function(e) {
    e.preventDefault();
   logsHandle.loadNextPage();
  }
});

Template.logRow.timeStarted = function() {
	return this.timeStarted ? this.timeStarted.toLocaleString() : "No starting date";
}

Template.logRow.timeEnded = function() {
	return this.timeEnded ? this.timeEnded.toLocaleString() : "No ending date";
}


Template.logsHistory.rendered = function() {
	$(window).scroll(function(){
		if (!(! logsHandle.loading() && 
      Logs.find().count() < logsHandle.loaded())) {
			console.log("what about here?");
	if((($(window).scrollTop()+$(window).height())+150)>=$(document).height()){
		console.log("or here?");
		if(!logsHandle.loading()){
			console.log("or even here?");
			   logsHandle.loadNextPage();
			   $(".mySpinner").css("display", "inline");
		} else {
			$(".mySpinner").hide();
		}
	}
}
else {
	$('.mySpinner').hide();
}
});
}