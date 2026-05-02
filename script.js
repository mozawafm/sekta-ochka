const text = document.getElementById("text");
const btn = document.getElementById("btn");

// проверка: был ли человек тут раньше
if (localStorage.getItem("visited")) {
    text.innerText = "ты уже возвращался";
} else {
    localStorage.setItem("visited", true);
}

let phrases = [
    "она смотрит через тебя",
    "это не первый раз",
    "почему ты здесь",
    "не закрывай вкладку",
    "мы видим тебя",
    "○"
];

btn.onclick = () => {
    let random = Math.floor(Math.random() * phrases.length);
    text.innerText = phrases[random];

    // иногда перекидывает на другую страницу
    if (Math.random() > 0.7) {
        window.location.href = "observe.html";
    }
};

// редкий переход на лог
setInterval(() => {
    if (Math.random() > 0.97) {
        window.location.href = "log.html";
    }
}, 5000);

// редкое мигание
setInterval(() => {
    document.body.style.background =
        Math.random() > 0.98 ? "white" : "black";
}, 100);

// через 15 секунд сообщение
setTimeout(() => {
    alert("не закрывай вкладку");
}, 15000);
