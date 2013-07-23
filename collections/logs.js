Logs = new Meteor.Collection("logs");

Meteor.methods({
	addStrangerTask: function(newTask, strangerId, id) {
		_logs = Logs.findOne({_id: id, strangerId: strangerId, timeStarted: null});
		if (_logs) {
			Logs.update({_id: _logs._id}, {$addToSet: {todo: newTask}});
			return _logs._id;
		}
		else {
			_newLog = {
				userId: null,
				timeStarted: null,
				timeEnded: null,
				done: [],
				todo: [],
				strangerId: strangerId,
				success: false
			}
			_newLog.todo.push(newTask);
			_newLog._id = Logs.insert(_newLog);
			console.log("_newLog._id ", _newLog._id);
			return _newLog._id;
		}
	},
	addStrangerDone: function(newDone, strangerId, id) {
		_logs = Logs.findOne({_id: id, strangerId: strangerId, timeStarted: null});
		if (_logs) {
			Logs.update({_id: _logs._id}, {$addToSet: {done: newDone}});
			return _logs._id;
		}
		else {
			_newLog = {
				userId: null,
				timeStarted: null,
				timeEnded: null,
				done: [],
				todo: [],
				strangerId: strangerId,
				success: false
			}
			_newLog.done.push(newDone);
			_newLog._id = Logs.insert(_newLog);
			return _newLog._id;
		}
	},
	startStrangerTask: function(now, strangerId, id) {
		_logs = Logs.findOne({_id: id, strangerId: strangerId, timeStarted: null});
		if (_logs) {
			Logs.update({_id: _logs._id}, {$set: {timeStarted: now}});
		}
	},
	stopStrangerTask: function(now, strangerId, id) {
		_logs = Logs.findOne({_id: id, strangerId: strangerId, timeEnded: null});
		if (_logs) {
			Logs.update({_id: _logs._id}, {$set: {timeEnded: now}})
		}
	},
	endStrangerTask: function(now, strangerId, id) {
		_logs = Logs.findOne({_id: id, strangerId: strangerId, timeEnded: null});
		if (_logs) {
			Logs.update({_id: _logs._id}, {$set: {timeEnded: now}, $set: {success: true}});
		}
	}
});