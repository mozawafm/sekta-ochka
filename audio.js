const AUDIO_KEY = "sekta_audio_time";
const AUDIO_STARTED = "sekta_audio_started";

let audio = new Audio("audio/ambient.mp3");

audio.loop = true;

audio.volume = 0.16;

audio.preload = "auto";

// ВОССТАНОВЛЕНИЕ ВРЕМЕНИ

const savedTime = localStorage.getItem(AUDIO_KEY);

if(savedTime){

    audio.currentTime = parseFloat(savedTime);

}

// СОХРАНЕНИЕ ВРЕМЕНИ

setInterval(()=>{

    if(!audio.paused){

        localStorage.setItem(
            AUDIO_KEY,
            audio.currentTime
        );

    }

},1000);

// ЗАПУСК

function startAmbient(){

    audio.play().then(()=>{

        localStorage.setItem(
            AUDIO_STARTED,
            "true"
        );

    }).catch(()=>{});

    document.removeEventListener(
        "click",
        startAmbient
    );

}

document.addEventListener(
    "click",
    startAmbient
);

// АВТОЗАПУСК ЕСЛИ УЖЕ БЫЛ КЛИК

if(localStorage.getItem(AUDIO_STARTED)){

    audio.play().catch(()=>{});

}
