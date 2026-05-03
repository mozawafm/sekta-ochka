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

            if (r > 0.75) {
                window.location.href = "final.html";
            } else if (r > 0.6) {
                window.location.href = "glitch.html";
            } else if (r > 0.4) {
                window.location.href = "observe.html";
            } else if (r > 0.2) {
                window.location.href = "address.html";
            } else {
                window.location.href = "invite.html";
            }

        }, 2000);
    };

};
