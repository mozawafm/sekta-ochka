let audio = new Audio("audio/ambient.mp3");

audio.loop = true;

audio.volume = 0.18;

audio.preload = "auto";

// ВОССТАНОВЛЕНИЕ ПОЗИЦИИ

const savedTime = localStorage.getItem("ambientTime");

if(savedTime){

    audio.currentTime = parseFloat(savedTime);

}

// СОХРАНЕНИЕ ВРЕМЕНИ

setInterval(()=>{

    if(!audio.paused){

        localStorage.setItem(
            "ambientTime",
            audio.currentTime
        );

    }

},1000);

// ЗАПУСК

function startAudio(){

    audio.play()
    .then(()=>{

        console.log("ambient started");

    })
    .catch((e)=>{

        console.log("audio blocked", e);

    });

    document.removeEventListener(
        "click",
        startAudio
    );

}

// ПЕРВЫЙ КЛИК ПО САЙТУ

document.addEventListener(
    "click",
    startAudio
);
