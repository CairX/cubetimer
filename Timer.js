var Timer = (function() {

	var 
	startTime,
	stopTime,
	startDiff,
	
	
	start = function() {
		startTime = Date.now() - startDiff;
	},

	stop = function() {
		stopTime = Date.now();
	},
	
	reset = function(diff) {
		if(!diff) startDiff=0;
		else startDiff = diff;
		startTime=null;
		stopTime=null;
	},
	
	getTime = function() {
		if(stopTime) return stopTime-startTime;
		else return Date.now()-startTime;
	};


	return {
		start: start,
		stop: stop,
		reset: reset,
		getTime: getTime
	
	}
}());