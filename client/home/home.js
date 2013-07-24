Template.home.created = function() {
	console.log("timerFunction", timerFunction);
	timerFunction = "firstUserLog";
	if (Session.get("strangerId")) {
		Meteor.call("transferStrangersLogs", Session.get("strangerId"), function(error, callback) {
			if (error) {
				bootbox.alert("Something went wrong", error);
			} else if (callback === "changed") {
				bootbox.alert("<h4>Howdy there!</h4> <p>All your logs were successfully transfered to your brand new account!</p>")
				Session.set("strangerId", null);
			}
		});
	}
		clockTicking = $("#clock-ticking")[0];
	alarm = $("#alarm")[0];
};




Template.home.events({
	'submit .tasks': function(e, template) {
		e.preventDefault();
		_newTask = $(".newTask").val();
		if (_newTask && _newTask !== "") {
			_taskOpts = {
				newTask: _newTask,
				logId: Session.get("currentLogId")
			}
			Meteor.call("addTask", _taskOpts, function(error, id) {
				if (error) {
					console.log("weird error", error);
				} else {
					$(".newTask").val("");
					window.clearTimeout(_renderer);
					_renderer = window.setTimeout(function() {
						$(".areYouReady").slideDown();

					}, 100);
					// 1500
				}
				currentLogId = id;
				Session.set("currentLogId", currentLogId);
			});
		}
		setTimeout(function() {
			console.log("currentLogId ", currentLogId);
		}, 100);
	},
	'click .btn-startFirst': function(e, template) {
		e.preventDefault();

		$(".firstUserLog").slideUp(function() {

			$(".timer").slideDown();
			    $("html, body").animate({ scrollTop: 0 }, 600);

			_now = new Date();
			// futureDate = new Date(_now.getTime() + 25*60000);
			futureDate = new Date(_now.getTime() + 1 * 10000);
			timer();
			clockTicking = $("#clock-ticking")[0];
			clockTicking.load();
			clockTicking.play();
			_logOpts = {
				logId: Session.get("currentLogId")
			}
				$(".btn-stop").show();

			Meteor.call("startLog", _logOpts);
		});

	},
	'submit .nextTasks': function(e, template) {
		e.preventDefault();
		_newTask = $(".newNextTask").val();
		addTask(_newTask);
	},
	'submit .nextDones': function(e, template) {
		e.preventDefault();
		_newDone = $(".newNextDone").val();
		addDone(_newDone);

	},
	'click .btn-startNext': function(e, template) {
		e.preventDefault();
		$(".nextUserLogs").slideUp(function() {
			    $("html, body").animate({ scrollTop: 0 }, 600);

			_now = new Date();
			futureDate = new Date(_now.getTime() + 1 * 10000);
			timer();
			clockTicking = $("#clock-ticking")[0];
			clockTicking.load();
			clockTicking.play();
			_taskOpts = {
				logId: Session.get("currentLogId")
			};
							$(".btn-stop").show();

			Meteor.call("startLog", _taskOpts);
		});
	},

})

// var addTask = function(newTask) {
// 	if (newTask && newTask !== "") {
// 		_taskOpts = {
// 			newTask: newTask,
// 			logId: Session.get("currentLogId")
// 		}
// 		Meteor.call("addTask", _taskOpts, function(error, id) {
// 			if (error) {
// 				console.log("weird error", error);
// 			} else {
// 				$(".newNextTask").val("");
// 								currentLogId = id;
// 				Session.set("currentLogId", currentLogId);
// 			}
// 		});
// 	}
// }

// var addDone = function(newDone) {
// 	if (newDone && newDone !== "") {
// 		_doneOpts = {
// 			newDone: newDone,
// 			logId: Session.get("previousLogId")
// 		};
// 		Meteor.call("addDone", _doneOpts, function(error, id) {
// 			if (error) {
// 				console.log("weird error", error);
// 			} else {
// 				$(".newNextDone").val("");
// 			}
// 		});
// 	}
// }

Template.home.previousLog = function() {
	_previousLogId = Session.get("previousLogId");
	log = Logs.findOne({
		_id: _previousLogId,
	});
	return log;
}

Template.home.log = function() {
	_currentLogId = Session.get("currentLogId");
	log = Logs.findOne({
		_id: _currentLogId,
		timeStarted: null
	});
	console.log("log", log);
	return log;
}

Template.home.isSessionStopped =  function() {
	return (timerFunction === "stopped")
}




// var timer = function() {
// 	_currentDate = new Date();
// 	_dd = futureDate - _currentDate;
// 	_dmin = Math.floor(((_dd % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
// 	_dsec = Math.floor((((_dd % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);
// 	var $ss = $(".second"),
// 		$mm = $(".minute");
// 	$ss.val(_dsec).trigger("change");
// 	$mm.val(_dmin).trigger("change");
// 	if (_dsec < 1 && _dmin === 0) {
// 		if (timerFunction === "firstUserLog") {
// 			afterFirstUserLog();
// 		} else if (timerFunction === "rest") {
// 			afterRest();
// 		} else if (timerFunction === "stopped") {
// 			afterStopped();

// 		} else if (timerFunction === "nextLog") {
// 			nextLog();
// 		}
// 	} else {
// 		setTimeout("timer()", 1000);
// 	}
// }


// var 

// var afterRest = function() {
// 				alarm.play();
// 			clockTicking.pause();
// 			timerFunction = "nextLog";
// }

// var afterStopped = function() {
// 				clockTicking.pause();

// 			_logOpts = {
// 				logId: Session.get("currentLogId")
// 			}

// 			Meteor.call("stopLog", _logOpts);

// 			Session.set("previousLogId", currentLogId);
// 			currentLogId = null;
// 			Session.set("currentLogId", currentLogId);
// }

// var ringAlarm = function() {
// 			alarm = $("#alarm")[0];
// 			alarm.load();
// 			alarm.play();
// }

// var nextLog = function() {
// 			ringAlarm();
// 			setFutureDate(0.2);

// 			timerFunction = "rest";
			
// 			_logOpts = {
// 				logId: Session.get("currentLogId")
// 			}

// 			Meteor.call("endLog", _logOpts);

// 			Session.set("previousLogId", currentLogId);
// 			currentLogId = null;
// 			Session.set("currentLogId", currentLogId);

// 			$(".afterSecondStrangerLog").slideDown();

// 			setTimeout("timer()", 1000);
// }
// var setFutureDate = function(minutes) {
// 	_now = new Date();
// futureDate = new Date(_now.getTime() + minutes*60000);
// }