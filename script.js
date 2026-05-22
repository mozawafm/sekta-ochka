window.onload = function() {

    const text = document.getElementById("text");
    const btn = document.getElementById("btn");

    // СОСТОЯНИЕ САЙТА
    let state = JSON.parse(localStorage.getItem("state"));

    // если state нет
    if (!state) {

        state = {
            visits: 0,
            trust: 0,
            path: "",
            mask: true
        };

    }

    state.visits++;

    localStorage.setItem("state", JSON.stringify(state));

    // СООБЩЕНИЯ
    let messages;

    if (state.visits === 1) {

        messages = [
            "ты уже видела это видео",
            "это часть процесса",
            "не бойся"
        ];

    } else if (state.path.includes("OL")) {

        messages = [
            "мы наблюдали за тобой",
            "ты почти готова",
            "не снимай маску"
        ];

    } else {

        messages = [
            "ты вернулась",
            "мы помним тебя",
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

            // обновляем state
            let currentState = JSON.parse(localStorage.getItem("state"));

            // ПРАВИЛЬНЫЙ ПУТЬ
            if (currentState.path.includes("OLI")) {

                window.location.href = "video.html";
                return;

            }

            // ЕСЛИ СНЯТА МАСКА
            if (currentState.mask === false) {

                window.location.href = "glitch.html";
                return;

            }

            // РАНДОМНЫЕ МАРШРУТЫ
            let r = Math.random();

            if (r > 0.66) {

                window.location.href = "observe.html";

            } else if (r > 0.33) {

                window.location.href = "log.html";

            } else {

                window.location.href = "invite.html";

            }

        }, 2500);

    };

    // СЕКРЕТНЫЙ КОД
    let secret = "teo867102";

    let input = "";

    document.addEventListener("keydown", function(e) {

        input += e.key.toLowerCase();

        if (input.length > secret.length) {

            input = input.slice(-secret.length);

        }

        if (input === secret) {

            let currentState = JSON.parse(localStorage.getItem("state"));

            currentState.trust += 10;

            localStorage.setItem("state", JSON.stringify(currentState));

            window.location.href = "secret.html";

        }

    });

};
