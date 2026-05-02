const text = document.getElementById("text");
const btn = document.getElementById("btn");

// проверка первого захода
if (localStorage.getItem("visited")) {
    text.innerText = "ты уже возвращался";
} else {
    localStorage.setItem("visited", true);
}

btn.onclick = function() {
    let chance = Math.random();

    if (chance > 0.7) {
        window.location.href = "observe.html";
    } else if (chance > 0.4) {
        window.location.href = "log.html";
    } else {
        text.innerText = "она смотрит через тебя";
    }
};

// лёгкое мигание
setInterval(function() {
    if (Math.random() > 0.98) {
        document.body.style.background = "white";
    } else {
        document.body.style.background = "black";
    }
}, 100);
