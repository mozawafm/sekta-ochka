window.onload = function() {

    const text = document.getElementById("text");
    const btn = document.getElementById("btn");

    // STATE
    let state = JSON.parse(localStorage.getItem("state"));

    if (!state) {

        state = {
            visits: 0,
            trust: 0,
            path: "",
            mask: true,
            watchedVideo: false
        };

    }

    state.visits++;

    localStorage.setItem("state", JSON.stringify(state));

    // ТЕКСТЫ
    let messages;

    if (state.visits === 1) {

        messages = [
            "ты уже видела это видео",
            "это часть процесса",
            "не бойся"
        ];

    } else if (state.trust >= 10) {

        messages = [
            "мы тебя помним",
            "ты подходишь",
            "не снимай маску"
        ];

    } else {

        messages = [
            "ты снова здесь",
            "мы наблюдаем",
            "всё идёт правильно"
        ];

    }

    let i = 0;

    function nextMessage() {

        if (i < messages.length) {

            text.innerText = messages[i];

            i++;

            setTimeout(nextMessage, 2500);

        } else {

            btn.style.display = "inline-block";

        }

    }

    nextMessage();

    // ГЛАВНАЯ КНОПКА
    btn.onclick = function() {

        btn.style.display = "none";

        text.innerText = "подожди...";

        setTimeout(() => {

            route();

        }, 2500);

    };

    // РОУТИНГ
    function route() {

        let state = JSON.parse(localStorage.getItem("state"));

        let r = Math.random();

        // 🔥 СЕКРЕТ
        if (state.trust >= 20 && r > 0.7) {

            window.location.href = "secret.html";
            return;

        }

        // 🔥 РЕДКИЙ FINAL
        if (state.path.includes("OLI") && r > 0.85) {

            window.location.href = "final.html";
            return;

        }

        // 🔥 GLITCH
        if (state.mask === false && r > 0.5) {

            window.location.href = "glitch.html";
            return;

        }

        // ОБЫЧНЫЕ МАРШРУТЫ
        if (r > 0.75) {

            window.location.href = "observe.html";

        } else if (r > 0.5) {

            window.location.href = "log.html";

        } else if (r > 0.25) {

            window.location.href = "invite.html";

        } else {

            window.location.href = "video.html";

        }

    }

    // СЕКРЕТНЫЙ КОД
    let secret = "teo867102";

    let input = "";

    document.addEventListener("keydown", function(e) {

        input += e.key.toLowerCase();

        if (input.length > secret.length) {

            input = input.slice(-secret.length);

        }

        if (input === secret) {

            let state = JSON.parse(localStorage.getItem("state"));

            state.trust += 20;

            localStorage.setItem("state", JSON.stringify(state));

            window.location.href = "secret.html";

        }

    });

};
