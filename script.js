window.onload = function() {

    const text = document.getElementById("text");
    const btn = document.getElementById("btn");

    const secretBox = document.getElementById("secretBox");
    const secretInput = document.getElementById("secretInput");

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

    // ПОКАЗАТЬ ВВОД ПОСЛЕ НЕСКОЛЬКИХ ПОСЕЩЕНИЙ
    if (state.visits >= 4) {

        secretBox.style.display = "block";

    }

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

    // КНОПКА
    btn.onclick = function() {

        btn.style.display = "none";

        text.innerText = "подожди...";

        setTimeout(() => {

            route();

        }, 2500);

    };

    // РОУТИНГ
    function route() {

        let current = JSON.parse(localStorage.getItem("state"));

        let r = Math.random();

        // SECRET
        if (current.trust >= 20 && r > 0.8) {

            window.location.href = "secret.html";
            return;

        }

        // FINAL
        if (current.path.includes("OLI") && r > 0.9) {

            window.location.href = "final.html";
            return;

        }

        // LOOP
        if (current.path.includes("OLO")) {

            window.location.href = "loop.html";
            return;

        }

        // ОБЫЧНЫЕ ПЕРЕХОДЫ
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

    // 🔥 ВВОД КОДА
    secretInput.addEventListener("keydown", function(e) {

        if (e.key === "Enter") {

            let value = secretInput.value.toLowerCase().trim();

            if (value === "teo867102") {

                let current = JSON.parse(localStorage.getItem("state"));

                current.trust += 20;

                localStorage.setItem("state", JSON.stringify(current));

                window.location.href = "secret.html";

            } else {

                text.innerText = "неправильно";

                setTimeout(() => {
                    text.innerText = "...";
                }, 2000);

            }

        }

    });

};
