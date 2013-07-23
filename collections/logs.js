Logs = new Meteor.Collection("logs");

Meteor.methods({
	addTask: function(taskOpts) {
		_query = {timeStarted: null};
		// _query.timeStarted = null;
		var _user;
		if (taskOpts.logId) {
			_query._id = taskOpts.logId;
			if (taskOpts.strangerId) {
				_query.strangerId = taskOpts.strangerId;
			}
			else if (Meteor.user()) {
				_query.userId = Meteor.userId();
			}
			else {
				throw new Meteor.Error(401, "You need to have an ID to add Tasks");
			}
			Logs.update(_query, {$addToSet: {todo: taskOpts.newTask}});
			return taskOpts.logId;
		}
		else {
			_newLog = {
				timeStarted: null,
				timeEnded: null,
				done: [],
				todo: [],
				success: false
			}
			if (taskOpts.strangerId) {
				_newLog.strangerId = taskOpts.strangerId;
			}
			else if (Meteor.user()) {
				_newLog.userId = Meteor.userId();
			}
			_newLog.todo.push(taskOpts.newTask);
			_newLog._id = Logs.insert(_newLog);
			console.log("_newLog._id ", _newLog._id);
			return _newLog._id;
		}
	},
	addDone: function(doneOpts) {
		_query = {};
		var _user;
		if (doneOpts.logId) {
			_query._id = doneOpts.logId;
			if (doneOpts.strangerId) {
				_query.strangerId = doneOpts.strangerId;
			}
			else if (Meteor.user()) {
				_query.userId = Meteor.userId();
			}
			else {
				throw new Meteor.Error(401, "You need to have an ID to add Dones ");
			}
			console.log("_query ", _query);
			console.log("doneOpts.newDone", doneOpts.newDone);
			Logs.update(_query, {$addToSet: {done: doneOpts.newDone}})
		}
		else {
			throw new Meteor.Error(401, "You can only add Dones to existing logs")
		}
	},
	startLog: function(logOpts) {
		_query = {timeStarted: null};
		if (logOpts.strangerId) {
			_query.strangerId = logOpts.strangerId
		}
		else if (Meteor.user()) {
			_query.userId = Meteor.userId();
		}
		else {
			throw new Meteor.Error(401, "You need to have an ID to start log");
		}
		if (logOpts.logId) {
			_query._id = logOpts.logId;
		}
		else {
			throw new Meteor.Error(403, "You can't start non existing log");
		}
		_now = new Date();
		Logs.update(_query, {$set: {timeStarted: _now}});

	},
	stopLog: function(logOpts) {

		_query = {timeEnded: null};
		if (logOpts.strangerId) {
			_query.strangerId = logOpts.strangerId
		}
		else if (Meteor.user()) {
			_query.userId = Meteor.userId();
		}
		else {
			throw new Meteor.Error(401, "You need to have an ID to stop a log");
		}
		_now = new Date();
		
		Logs.update(_query, {$set: {timeEnded: _now}})
		
	},
	endLog: function(logOpts) {

		_query = {timeEnded: null};
		if (logOpts.strangerId) {
			_query.strangerId = logOpts.strangerId
		}
		else if (Meteor.user()) {
			_query.userId = Meteor.userId();
		}
		else {
			throw new Meteor.Error(401, "You need to have an ID to end a log");
		}
		_now = new Date();

		Logs.update(_query, {$set: {timeEnded: _now, success: true}});

	}
});