window.onload = function() {

    const text = document.getElementById("text");
    const btn = document.getElementById("btn");

    if (localStorage.getItem("visited")) {
        text.innerText = "ты уже возвращался";
    } else {
        localStorage.setItem("visited", true);
    }

    btn.onclick = function() {

        let chance = Math.random();

        if (chance > 0.75) {
            window.location.href = "observe.html";
        } else if (chance > 0.5) {
            window.location.href = "log.html";
        } else if (chance > 0.3) {
            window.location.href = "enter.html";
        } else if (chance > 0.1) {
            window.location.href = "video.html";
        } else {
            window.location.href = "loop.html";
        }
    };

};
