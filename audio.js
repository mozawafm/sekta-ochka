let audio = document.getElementById("globalAudio");

if(!audio){

    audio = document.createElement("audio");

    audio.id = "globalAudio";

    audio.src = "audio/ambient.mp3";

    audio.loop = true;

    audio.volume = 0.18;

    document.body.appendChild(audio);

}

// СОХРАНЯЕМ ВРЕМЯ

const savedTime = localStorage.getItem("audioTime");

if(savedTime){

    audio.currentTime = savedTime;

}

// АВТОСОХРАНЕНИЕ ПОЗИЦИИ

setInterval(()=>{

    localStorage.setItem(
        "audioTime",
        audio.currentTime
    );

},1000);

// ЗАПУСК ПОСЛЕ КЛИКА

function startAudio(){

    audio.play();

    document.removeEventListener("click", startAudio);

}

document.addEventListener("click", startAudio);
