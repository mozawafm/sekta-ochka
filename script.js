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
            "ты идёшь",
            "никого не будет",
            "ты нажмёшь play"
        ];
    } 
    else {
        messages = [
            "зачем ты проверяешь",
            "ты уже была там",
            "ты уже снимала маску"
        ];
    }

    let i = 0;

    function showNext() {
        if (i < messages.length) {
            text.innerText = messages[i];
            i++;
            setTimeout(showNext, 2000);
        } else {
            btn.style.display = "inline-block";
        }
    }

    showNext();

    btn.onclick = function() {

        text.innerText = "подожди...";

        btn.style.display = "none";

        setTimeout(() => {

            let r = Math.random();

            if (r > 0.7) {
                window.location.href = "glitch.html";
            } else if (r > 0.5) {
                window.location.href = "observe.html";
            } else if (r > 0.3) {
                window.location.href = "address.html";
            } else if (r > 0.1) {
                window.location.href = "invite.html";
            } else {
                window.location.href = "time.html";
            }

        }, 2000);
    };

};
