window.onload = function() {

    const text = document.getElementById("text");
    const btn = document.getElementById("btn");

    if (!text || !btn) {
        alert("ошибка: не найден text или btn");
        return;
    }

    // проверка первого захода
    if (localStorage.getItem("visited")) {
        text.innerText = "ты уже возвращался";
    } else {
        localStorage.setItem("visited", true);
    }

    btn.onclick = function() {
        text.innerText = "она смотрит через тебя";

        let chance = Math.random();

        if (chance > 0.6) {
            window.location.href = "observe.html";
        } else if (chance > 0.3) {
            window.location.href = "log.html";
        }
    };

};
