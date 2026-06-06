// audio.js — глобальный плеер с кнопкой Play/Pause

(function() {
    // Создаём HTML-структуру плеера
    const playerHTML = `
        <div id="globalPlayer" style="
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 40px;
            padding: 8px 16px;
            cursor: pointer;
            font-family: monospace;
            font-size: 12px;
            color: #c4b58a;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 10px;
        ">
            <span id="playerIcon">▶</span>
            <span id="playerText">SIGNAL</span>
        </div>
    `;
    
    // Добавляем плеер на страницу
    document.body.insertAdjacentHTML('beforeend', playerHTML);
    
    const playerDiv = document.getElementById('globalPlayer');
    const playerIcon = document.getElementById('playerIcon');
    const playerText = document.getElementById('playerText');
    
    let audioContext = null;
    let isPlaying = false;
    let sourceNode = null;
    let loopInterval = null;
    
    // Функция создания шума (атмосферного)
    function initAudio() {
        if (audioContext) return;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    function startSound() {
        if (!audioContext) {
            initAudio();
        }
        if (!audioContext) return;
        
        if (audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                playLoop();
            });
        } else {
            playLoop();
        }
    }
    
    function playLoop() {
        if (sourceNode) {
            try { sourceNode.stop(); } catch(e) {}
        }
        
        // Создаём атмосферный низкий гул (тихий, мистический)
        const now = audioContext.currentTime;
        sourceNode = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        sourceNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        sourceNode.frequency.value = 54; // Очень низкая частота (гул)
        gainNode.gain.setValueAtTime(0.03, now);
        gainNode.gain.exponentialRampToValueAtTime(0.03, now + 1);
        
        sourceNode.start(now);
        
        // Бесконечный цикл (перезапуск каждые 10 секунд)
        if (loopInterval) clearInterval(loopInterval);
        loopInterval = setInterval(() => {
            if (isPlaying && audioContext && audioContext.state === 'running') {
                const newSource = audioContext.createOscillator();
                const newGain = audioContext.createGain();
                newSource.connect(newGain);
                newGain.connect(audioContext.destination);
                newSource.frequency.value = 54 + Math.random() * 5;
                newGain.gain.setValueAtTime(0.02, audioContext.currentTime);
                newGain.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + 8);
                newSource.start();
                newSource.stop(audioContext.currentTime + 9);
            }
        }, 9000);
    }
    
    function stopSound() {
        if (loopInterval) {
            clearInterval(loopInterval);
            loopInterval = null;
        }
        if (sourceNode) {
            try { sourceNode.stop(); } catch(e) {}
            sourceNode = null;
        }
        if (audioContext) {
            audioContext.close().then(() => {
                audioContext = null;
            });
        }
    }
    
    // Клик по плееру
    playerDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (!isPlaying) {
            // Включаем
            initAudio();
            startSound();
            isPlaying = true;
            playerIcon.innerText = '⏸';
            playerText.innerText = 'SIGNAL ACTIVE';
            playerDiv.style.borderColor = '#d4c5a0';
            playerDiv.style.boxShadow = '0 0 10px rgba(212,197,160,0.3)';
        } else {
            // Выключаем
            stopSound();
            isPlaying = false;
            playerIcon.innerText = '▶';
            playerText.innerText = 'SIGNAL';
            playerDiv.style.borderColor = 'rgba(255,255,255,0.2)';
            playerDiv.style.boxShadow = 'none';
        }
    });
    
    // Ховер-эффект
    playerDiv.addEventListener('mouseenter', () => {
        playerDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
        playerDiv.style.borderColor = '#d4c5a0';
    });
    playerDiv.addEventListener('mouseleave', () => {
        if (!isPlaying) {
            playerDiv.style.backgroundColor = 'rgba(0,0,0,0.6)';
            playerDiv.style.borderColor = 'rgba(255,255,255,0.2)';
        }
    });
    
    // Убираем старый глобальный обработчик (если был)
    // Это не удалит существующие, но предотвратит дублирование
    console.log('🎵 Global player ready. Click the bottom-left button.');
})();
