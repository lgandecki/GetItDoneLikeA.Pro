_renderer = null, futureDate = null, timerFunction = "firstTask";
clockTicking = null, alarm = null;
currentLogId = null;
taskId = null;

Template.welcomeStranger.created = function() {
	clockTicking = $("#clock-ticking")[0];
	alarm = $("#alarm")[0];
}

Template.welcomeStranger.events({
	'submit .tasks': function(e, template) {
		e.preventDefault();
		_newTask = $(".newTask").val()
		if (_newTask && _newTask !== "") {
			_strangerId = Session.get("strangerId");
			taskId = Meteor.call("addStrangerTask", _newTask, _strangerId, currentLogId, function(error, id) {
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
			console.log("what about here? ", taskId);
		}
		console.log("submit it!");
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
			Meteor.call("startStrangerTask", _now, _strangerId, currentLogId);
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
			Meteor.call("startStrangerTask", _now, _strangerId, currentLogId);
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
			Meteor.call("startStrangerTask", _now, _strangerId, currentLogId);
			$(".afterThirdHide").hide();
		});
	}
})

addTask = function(newTask) {
	if (newTask && newTask !== "") {
		_strangerId = Session.get("strangerId");
		Meteor.call("addStrangerTask", newTask, _strangerId, currentLogId, function(error, id) {
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
		_strangerId = Session.get("strangerId");
		Meteor.call("addStrangerDone", newDone, _strangerId, currentLogId, function(error, id) {
			if (error) {
				console.log("weird error", error);
			} else {
				$(".newNextDone").val("");
								currentLogId = id;
				Session.set("currentLogId", currentLogId);
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
	if (_dmin === 0 && _dsec < 1) {
		if (timerFunction === "firstTask") {
			_now = new Date();
			alarm = $("#alarm")[0];
			alarm.load();
			alarm.play();
			futureDate = new Date(_now.getTime() + 1 * 20000);
			// Ring
			$(".secondStrangerLog").slideDown();
			timerFunction = "rest";
			_strangerId = Session.get("strangerId");
			Meteor.call("endStrangerTask", _now, _strangerId, currentLogId);

			Session.set("previousLogId", currentLogId);
			currentLogId = null;

			setTimeout("timer()", 1000);
		} else if (timerFunction === "rest") {
			alarm.play();
			clockTicking.pause();
			timerFunction = "nextTask";
			// Ring
		} else if (timerFunction === "stopped") {
			clockTicking.pause();
			_strangerId = Session.get("strangerId");
			_now = new Date();
			Meteor.call("stopStrangerTask", _now, _strangerId, currentLogId);

			Session.set("previousLogId", currentLogId);
			currentLogId = null;

		} else if (timerFunction === "nextTask") {
			_now = new Date();
			alarm = $("#alarm")[0];
			alarm.load();
			alarm.play();
			futureDate = new Date(_now.getTime() + 1 * 20000);
			// Ring
			timerFunction = "rest";
			_strangerId = Session.get("strangerId");
			Meteor.call("endStrangerTask", _now, _strangerId, currentLogId);
			Session.set("previousLogId", currentLogId);
			currentLogId = null;
			$(".afterSecondStrangerLog").slideDown();

			setTimeout("timer()", 1000);
		}
	} else {
		setTimeout("timer()", 1000);
	}
}