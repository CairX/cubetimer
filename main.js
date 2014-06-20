var interval;
var time = document.getElementById('time');
var selEvents = document.getElementById('selEvents');
var selUsers = document.getElementById('selUsers');

var pageStart = document.getElementById('pageStart');
var pageTimer = document.getElementById('pageTimer');
var timer = new Timer();
var KEY_SPACE = 32;

window.addEventListener("keypress", function(e){if(e.charCode === KEY_SPACE) toggleTimer();}, false);
window.addEventListener("touchstart", toggleTimer, false);


loadUsers();
loadEvents();


//TODO: page navigator
pageStart.style.display = "block";







function update(ms) {
	time.innerHTML = TimeFormatter.format(ms, '%%M:%S.%h');
}


function loadUsers() {
	var xhr = new XMLHttpRequest();
	xhr.open("get", "http://api.fruruf.se/get/users", true);
	xhr.responseType = "json";
	xhr.onload = loadUsersCallback;
	xhr.send();
	console.debug("load users from fruruf");
}

function loadUsersCallback(e) {
	if(e.target.status === 200 && e.target.response.status === 1000) {
		var json = e.target.response;
		console.debug("users loaded", json);
		for(var userId in json.users) {
			var option = document.createElement("OPTION");
			option.textContent = json.users[userId].username;
			selUsers.appendChild(option);
		}
	} else {
		console.error("Error loading users", e.target);
	}
}

function loadEvents() {
	var xhr = new XMLHttpRequest();
	xhr.open("get", "http://api.fruruf.se/get/events", true);
	xhr.responseType = "json";
	xhr.onload = loadEventsCallback;
	xhr.send();
	console.debug("load events from fruruf");
}

function loadEventsCallback(e) {
	if(e.target.status === 200 && e.target.response.status === 1000) {
		var json = e.target.response;
		console.debug("events loaded", json);
		for(var eventId in json.events) {
			var option = document.createElement("OPTION");
			option.textContent = json.events[eventId].name;
			selEvents.appendChild(option);
		}
	} else {
		console.error("Error loading events", e.target);
	}
}


function toggleTimer() {
	if (timer.isRunning()) {
		window.clearInterval(interval);
		timer.stop();
		update(timer.time());
		
		var formData = new FormData();
		formData.append("key", "fWG345wgQqnj");
		formData.append("username", "test");
		formData.append("time", timer.time());
		formData.append("event", "333oh");		
		
		var xhr = new XMLHttpRequest();
		xhr.open("post", "http://api.fruruf.se/add", true);
		xhr.onload = timeSubmitted;
		xhr.send(formData);
		console.debug("Submit time to fruruf");
		
		
	} else if(timer.time()) {
		timer.reset();
		update(0);
	} else {
		timer.start();
		interval = window.setInterval(function() {
			update(timer.current());
		}, 10);
	}
}

function timeSubmitted(e) {
	console.debug("timeSubmitted", e.target.response);
}

