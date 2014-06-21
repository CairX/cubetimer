/*global navigator, window */

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
function vibrate(ms) {
    if (navigator.vibrate) {
        navigator.vibrate(ms);
    }
}

var pages;

var state;
var STATE_SETTINGS=0,
    STATE_WAIT_FOR_COUNTDOWN=1,
    STATE_WAIT_FOR_TIMER=2,
    STATE_COUNTDOWN=3,
    STATE_TIMER=4,
    STATE_RESULT=5
;

var KEY_SPACE = 32;
var upBetween = false;


function showSettings() {
    loadUsers();
    loadEvents();
    showPage("settings");
    state = STATE_SETTINGS;
}


function eventHandler(e) {
    switch(state) {
        case STATE_WAIT_FOR_COUNTDOWN:
        if((e.type==="keydown" && e.keyCode===KEY_SPACE) || (e.type==="touchstart")) {
            state = STATE_COUNTDOWN;
            upBetween = false;
            Timer.start();
            interval = window.setInterval(function() {
                updateTime(Timer.getTime());
                
                if(Timer.getTime()>=0) {
                    console.debug("force start timer");
                    clearInterval(interval);
                    startTimer();
                    vibrate(100);
                }
            }, 10);
        }
        break;
        
        case STATE_COUNTDOWN:
        if((e.type==="keyup" && e.keyCode===KEY_SPACE) || (e.type==="touchend")) {
            console.debug("start timer");
            clearInterval(interval);
            console.debug("start timer");
            startTimer();
            upBetween = true;
        }
        break;
        
        case STATE_WAIT_FOR_TIMER:
        if((e.type==="keydown" && e.keyCode===KEY_SPACE) || (e.type==="touchstart")) {
            upBetween = false;
            console.debug("start timer!");              
            startTimer();
        }
        break;
        
        case STATE_TIMER:
        if(upBetween && ((e.type==="keydown" && e.keyCode===KEY_SPACE) || e.type==="touchstart")) {
            e.preventDefault();
            stopTimer();
        } else if(!upBetween && ((e.type==="keyup" && e.keyCode===KEY_SPACE) || e.type==="touchend")) {
            upBetween = true;
        }
        break;
    }
}

function startTimer() {
    state = STATE_TIMER;
    time.classList.remove("countdown");
    Timer.reset();
    Timer.start();
    interval = window.setInterval(function() {
        updateTime(Timer.getTime());
    }, 10);
}

function stopTimer() {
    Timer.stop();
    clearInterval(interval);
    state = STATE_RESULT;
    result.innerHTML = TimeFormatter.format(Timer.getTime(), '%%M:%S.%h');
    showPage("result");
    
}


function initTimer() {
    showPage("timer");
    
    if(selCountdown.value>0) {
        state = STATE_WAIT_FOR_COUNTDOWN;
        time.classList.add("countdown");
        Timer.reset(-parseInt(selCountdown.value));
        updateTime(-parseInt(selCountdown.value));
    } else {
        state = STATE_WAIT_FOR_TIMER;
        time.classList.remove("countdown");
        Timer.reset();
        updateTime(0);
    }
}


function showPage(page) {
    var sections = document.querySelectorAll("section");
    for(var i=0; i<sections.length; i++) {
        sections[i].style.display = "none";
    }
    pages[page].style.display = "block";
}



function updateTime(ms) {
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


function submitToFRURUF() {     
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
}

function timeSubmitted(e) {
    console.debug("timeSubmitted", e.target.response);
}

window.addEventListener('load', function() {
    window.addEventListener("keydown", eventHandler, false);
    window.addEventListener("keyup", eventHandler, false);
    window.addEventListener("touchstart", eventHandler, false);
    window.addEventListener("touchend", eventHandler, false);

    var btnInitTimer = document.getElementById('btnInitTimer');
    btnInitTimer.addEventListener("click", initTimer, false);

    var btnRetry = document.getElementById('btnRetry');
    btnRetry.addEventListener("click", initTimer, false);

    var btnSettings = document.getElementById('btnSettings');
    btnSettings.addEventListener("click", showSettings, false);

    var interval;
    var time = document.getElementById('time');
    var result = document.getElementById('result');
    var selEvents = document.getElementById('selEvents');
    var selUsers = document.getElementById('selUsers');
    var selCountdown = document.getElementById('selCountdown');

    pages = {
        "settings": document.getElementById('pageSettings'),
        "timer": document.getElementById('pageTimer'),
        "result": document.getElementById('pageResult')
    };

    showSettings();
}, false);