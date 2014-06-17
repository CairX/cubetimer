var interval;
var time = document.getElementById('time');
var timer = new Timer();
var KEY_SPACE = 32;

function update() {
	time.innerHTML = TimeFormatter.format(timer.current(), '%%M:%S:%h');
}

window.addEventListener("keypress", function(e){if(e.charCode === KEY_SPACE) toggleTimer();}, false);
window.addEventListener("click", toggleTimer, false);

function toggleTimer() {
	if (timer.isRunning()) {
		window.clearInterval(interval);
		timer.stop();
		time.innerHTML = TimeFormatter.format(timer.time(), '%%M:%S:%h');
	} else {
		timer.start();
		interval = window.setInterval(update, 10);
	}
};