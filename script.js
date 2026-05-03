window.onload = function() {

    const text = document.getElementById("text");
    const btn = document.getElementById("btn");

    let firstVisit = !localStorage.getItem("visited");

    localStorage.setItem("visited", true);

    let messagesFirst = [
        "ты уже видел это видео",
        "ты просто не помнишь",
        "это нормально",
        "пока"
    ];

    let messagesReturn = [
        "ты вернулся",
        "мы ждали",
        "ты не должен был возвращаться",
        "но ты вернулся"
    ];

    let messages = firstVisit ? messagesFirst : messagesReturn;

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
            window.location.href = "observe.html";
        }, 2000);
    };

};
