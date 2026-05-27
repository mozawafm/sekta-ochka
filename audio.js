let existing = document.getElementById("ambientPlayer");

if(!existing){

    const audio = document.createElement("audio");

    audio.id = "ambientPlayer";

    audio.src = "audio/ambient.mp3";

    audio.loop = true;

    audio.autoplay = true;

    audio.controls = true;

    audio.style.position = "fixed";
    audio.style.bottom = "10px";
    audio.style.left = "10px";
    audio.style.zIndex = "99999";
    audio.style.opacity = "0.2";

    document.body.appendChild(audio);

    // ПРОБУЕМ ЗАПУСТИТЬ

    const tryPlay = () => {

        audio.play()
        .then(()=>{

            console.log("AUDIO PLAYING");

        })
        .catch((e)=>{

            console.log("AUDIO ERROR", e);

        });

    };

    // ПЕРВЫЙ КЛИК

    document.addEventListener(
        "click",
        tryPlay,
        { once:true }
    );

}
