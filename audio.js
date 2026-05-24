if(!localStorage.getItem("musicStarted")){

    const audio = new Audio("audio/ambient.mp3");

    audio.loop = true;

    audio.volume = 0.18;

    audio.play();

    window.globalAudio = audio;

    localStorage.setItem("musicStarted","true");

}else{

    if(!window.globalAudio){

        const audio = new Audio("audio/ambient.mp3");

        audio.loop = true;

        audio.volume = 0.18;

        audio.play();

        window.globalAudio = audio;

    }

}
