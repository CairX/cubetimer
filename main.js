var i;
var time = document.getElementById('time');
var timer = new Timer();

function update() {
	time.innerHTML = TimeFormatter.format(timer.current(), '%%M:%S:%h');
}

window.addEventListener("keypress", function(e) {
	if (e.charCode === 32) toggleTimer();
}, false);
window.addEventListener("click", toggleTimer, false);


function toggleTimer() {
	if (timer.isRunning()) {
		window.clearInterval(i);
		timer.stop();
		time.innerHTML = TimeFormatter.format(timer.time(), '%%M:%S:%h');
	} else {
		timer.start();
		i = window.setInterval(update, 10);
	}
};