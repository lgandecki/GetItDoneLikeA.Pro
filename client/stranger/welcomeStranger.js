_renderer = null, futureDate = null, timerFunction = "firstStrangerLog";
clockTicking = null, alarm = null;
currentLogId = null;
taskId = null;

Template.welcomeStranger.created = function() {
	clockTicking = $("#clock-ticking")[0];
	alarm = $("#alarm")[0];
}

Template.welcomeStranger.events({
	'submit .tasks': function(e, template) {
		console.log("so we are not even here?");
		e.preventDefault();
		_newTask = $(".newTask").val();
		if (_newTask && _newTask !== "") {
			_strangerId = Session.get("strangerId");
			_taskOpts = {
				newTask: _newTask,
				strangerId: _strangerId,
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

		$(".firstStrangerLog").slideUp(function() {

			$(".timer").slideDown();
			_strangerId = Session.get("strangerId");
			_now = new Date();
			// futureDate = new Date(_now.getTime() + 25*60000);
			futureDate = new Date(_now.getTime() + 1 * 10000);
			timer();
			clockTicking = $("#clock-ticking")[0];
			clockTicking.load();
			clockTicking.play();
			_logOpts = {
				strangerId: _strangerId,
				logId: Session.get("currentLogId")
			}
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
	'submit .lastTasks': function(e, template) {
		e.preventDefault();
		_newTask = $(".lastTask").val();
		addTask(_newTask);
	},
	'submit .lastDones': function(e, template) {
		e.preventDefault();
		_newDone = $(".lastDone").val();
		addDone(_newDone);
	},
	'click .btn-startNext': function(e, template) {
		e.preventDefault();
		_strangerId = Session.get("strangerId");
		$(".secondStrangerLog").slideUp(function() {
			_now = new Date();
			futureDate = new Date(_now.getTime() + 1 * 10000);
			timer();
			clockTicking = $("#clock-ticking")[0];
			clockTicking.load();
			clockTicking.play();
			_taskOpts = {
				strangerId: _strangerId,
				logId: Session.get("currentLogId")
			};
			Meteor.call("startLog", _taskOpts);
		});
	},
	'click .btn-startLast': function(e, template) {
		e.preventDefault();
		_strangerId = Session.get("strangerId");
		$(".afterSecondStrangerLog").slideUp(function() {
			_now = new Date();
			futureDate = new Date(_now.getTime() + 1 * 10000);
			timer();
			clockTicking = $("#clock-ticking")[0];
			clockTicking.load();
			clockTicking.play();
			_logOpts = {
				strangerId: _strangerId,
				logId: Session.get("currentLogId")
			};
			Meteor.call("startLog", _logOpts);
			$(".afterThirdHide").hide();
		});
	}
})

addTask = function(newTask) {
	if (newTask && newTask !== "") {
		_strangerId = Session.get("strangerId");
		_taskOpts = {
			newTask: newTask,
			strangerId: Session.get("strangerId"),
			logId: Session.get("currentLogId")
		}
		Meteor.call("addTask", _taskOpts, function(error, id) {
			if (error) {
				console.log("weird error", error);
			} else {
				$(".newNextTask").val("");
								currentLogId = id;
				Session.set("currentLogId", currentLogId);
			}
		});
	}
}

addDone = function(newDone) {
	if (newDone && newDone !== "") {
		_doneOpts = {
			newDone: newDone,
			strangerId: _strangerId,
			logId: Session.get("previousLogId")
		};
		Meteor.call("addDone", _doneOpts, function(error, id) {
			if (error) {
				console.log("weird error", error);
			} else {
				$(".newNextDone").val("");
			}
		});
	}
}

Template.welcomeStranger.previousLog = function() {
	_strangerId = Session.get("strangerId");
	_previousLogId = Session.get("previousLogId");
	log = Logs.findOne({
		_id: _previousLogId,
		strangerId: _strangerId
	});
	return log;
}

Template.welcomeStranger.log = function() {
	_strangerId = Session.get("strangerId");
	_currentLogId = Session.get("currentLogId");
	log = Logs.findOne({
		_id: _currentLogId,
		strangerId: _strangerId,
		timeStarted: null
	});
	console.log("log", log);
	return log;
}


Template.welcomeStranger.rendered = function() {
	$(".knob").knob();
}

timer = function() {
	_currentDate = new Date();
	_dd = futureDate - _currentDate;
	_dmin = Math.floor(((_dd % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
	_dsec = Math.floor((((_dd % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);
	var $ss = $(".second"),
		$mm = $(".minute");
	$ss.val(_dsec).trigger("change");
	$mm.val(_dmin).trigger("change");
	if (_dsec < 1 && _dmin === 0) {
		if (timerFunction === "firstStrangerLog") {
			afterFirstStrangerLog();
		} else if (timerFunction === "rest") {
			afterRest();
		} else if (timerFunction === "stopped") {
			afterStopped();

		} else if (timerFunction === "nextLog") {
			nextLog();
		}
	} else {
		setTimeout("timer()", 1000);
	}
}


afterFirstStrangerLog = function() {

			ringAlarm();

			setFutureDate(0.1);
			
			$(".secondStrangerLog").slideDown();

			timerFunction = "rest";

			_logOpts = {
				strangerId: Session.get("strangerId"),
				logId: Session.get("currentLogId")
			}
			Meteor.call("endLog", _logOpts);

			Session.set("previousLogId", currentLogId);
			currentLogId = null;
			Session.set("currentLogId", currentLogId);

			setTimeout("timer()", 1000);
}

afterRest = function() {
				alarm.play();
			clockTicking.pause();
			timerFunction = "nextLog";
}

afterStopped = function() {
				clockTicking.pause();
			_strangerId = Session.get("strangerId");

			_logOpts = {
				strangerId: Session.get("strangerId"),
				logId: Session.get("currentLogId")
			}

			Meteor.call("stopLog", _logOpts);

			Session.set("previousLogId", currentLogId);
			currentLogId = null;
			Session.set("currentLogId", currentLogId);
}

ringAlarm = function() {
			alarm = $("#alarm")[0];
			alarm.load();
			alarm.play();
}

nextLog = function() {
			ringAlarm();
			setFutureDate(0.2);

			timerFunction = "rest";
			
			_logOpts = {
				strangerId: Session.get("strangerId"),
				logId: Session.get("currentLogId")
			}

			Meteor.call("endLog", _logOpts);

			Session.set("previousLogId", currentLogId);
			currentLogId = null;
			Session.set("currentLogId", currentLogId);

			$(".afterSecondStrangerLog").slideDown();

			setTimeout("timer()", 1000);
}
setFutureDate = function(minutes) {
	_now = new Date();
futureDate = new Date(_now.getTime() + minutes*60000);
}