const text = document.getElementById("text");
const btn = document.getElementById("btn");

let phrases = [
    "ты это уже видел",
    "она смотрит на тебя",
    "не закрывай вкладку",
    "ты не первый",
    "кто смотрит через тебя",
    "○"
];

btn.onclick = () => {
    let random = Math.floor(Math.random() * phrases.length);
    text.innerText = phrases[random];
};

setInterval(() => {
    document.body.style.background =
        Math.random() > 0.95 ? "white" : "black";
}, 100);
