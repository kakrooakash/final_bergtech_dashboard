let idleTime = 0;
let idleInterval;
let idleLimit = 60; // 1 minute
let idlePopup = document.getElementById("idlePopup");
let lastActivityTime = Date.now();

// Retrieve stored idle time if available
if (localStorage.getItem("idleTime")) {
    idleTime = parseInt(localStorage.getItem("idleTime"), 10);
}

// Retrieve stored last activity time if available
if (localStorage.getItem("lastActivityTime")) {
    lastActivityTime = parseInt(localStorage.getItem("lastActivityTime"), 10);
    const currentTime = Date.now();
    idleTime += Math.floor((currentTime - lastActivityTime) / 1000);
    lastActivityTime = currentTime;
}

function resetIdleTime() {
    idleTime = 0;
    lastActivityTime = Date.now();
    localStorage.setItem("idleTime", idleTime);
    localStorage.setItem("lastActivityTime", lastActivityTime);
    broadcastActivity();
}

function startIdleTimer() {
    idleInterval = setInterval(timerIncrement, 1000);
    lastActivityTime = Date.now();
    localStorage.setItem("lastActivityTime", lastActivityTime);
}

function stopIdleTimer() {
    clearInterval(idleInterval);
}

function timerIncrement() {
    const currentTime = Date.now();
    idleTime = Math.floor((currentTime - lastActivityTime) / 1000);
    localStorage.setItem("idleTime", idleTime);
    
    if (idleTime >= idleLimit) {
        idlePopup.style.display = "block";
        stopIdleTimer();
    }
}

function closePopup() {
    idlePopup.style.display = "none";
    resetIdleTime();
    startIdleTimer();
}

function broadcastActivity() {
    localStorage.setItem("activityEvent", Date.now());
}

// Event listeners to detect user activity
document.onmousemove = resetIdleTime;
document.onkeypress = resetIdleTime;
document.onscroll = resetIdleTime;
document.onclick = resetIdleTime;

// Page Visibility API to handle tab visibility changes
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        stopIdleTimer();
    } else {
        startIdleTimer();
    }
});

// Save the idle time to localStorage before the user leaves the page
window.addEventListener("beforeunload", function() {
    localStorage.setItem("idleTime", idleTime);
    localStorage.setItem("lastActivityTime", lastActivityTime);
});

// Listen for storage events to synchronize activity across tabs
window.addEventListener("storage", function(event) {
    if (event.key === "activityEvent") {
        resetIdleTime();
    }
});

// Start the idle timer when the page loads
startIdleTimer();