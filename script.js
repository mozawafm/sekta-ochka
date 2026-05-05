window.onload = function() {

    const text = document.getElementById("text");
    const btn = document.getElementById("btn");

    let visits = localStorage.getItem("visits");

    if (!visits) {
        visits = 1;
    } else {
        visits = parseInt(visits) + 1;
    }

    localStorage.setItem("visits", visits);

    let messages;

    if (visits == 1) {
        messages = [
            "ты уже видела это видео",
            "это часть процесса",
            "всё идёт правильно"
        ];
    } 
    else if (visits == 2) {
        messages = [
            "ты согласилась",
            "мы отправили тебе адрес",
            "ты его видела"
        ];
    } 
    else if (visits == 3) {
        messages = [
            "ты пришла",
            "никого не было",
            "ты нажала play"
        ];
    } 
    else {
        messages = [
            "мы уже записали",
            "ты была в кадре",
            "ты не помнишь"
        ];
    }

    let i = 0;

    function showNext() {
        if (i < messages.length) {
            text.innerText = messages[i];
            i++;
            setTimeout(showNext, 2500);
        } else {
            btn.style.display = "inline-block";
        }
    }

    showNext();

    // счётчик кликов (гарантированный переход в log)
    let clicks = 0;

    btn.onclick = function() {

        clicks++;

        text.innerText = "подожди...";
        btn.style.display = "none";

        setTimeout(() => {

            // гарантированный лог
            if (clicks % 3 === 0) {
                window.location.href = "log.html";
                return;
            }

            let r = Math.random();

            if (r > 0.7) {
                window.location.href = "final.html";
            } else if (r > 0.5) {
                window.location.href = "glitch.html";
            } else if (r > 0.3) {
                window.location.href = "observe.html";
            } else if (r > 0.1) {
                window.location.href = "address.html";
            } else {
                window.location.href = "invite.html";
            }

        }, 2500);
    };

    // 🔥 НОВЫЙ СЕКРЕТ
    let secretCode = "teo867102";
    let input = "";

    document.addEventListener("keydown", function(e) {

        input += e.key.toLowerCase();

        if (input.length > secretCode.length) {
            input = input.slice(-secretCode.length);
        }

        if (input === secretCode) {
            window.location.href = "secret.html";
        }

    });

};
