var interval;
var time = document.getElementById('time');
var timer = new Timer();
var KEY_SPACE = 32;

function update(ms) {
	time.innerHTML = TimeFormatter.format(ms, '%%M:%S:%h');
}

window.addEventListener("keypress", function(e){if(e.charCode === KEY_SPACE) toggleTimer();}, false);
window.addEventListener("touchstart", toggleTimer, false);

function toggleTimer() {
	if (timer.isRunning()) {
		window.clearInterval(interval);
		timer.stop();
		update(timer.time());
	} else if(timer.time()) {
		timer.reset();
		update(0);
	} else {
		timer.start();
		interval = window.setInterval(function() {
			update(timer.current());
		}, 10);
	}
};