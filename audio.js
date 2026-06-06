// audio.js — генератор 432 Гц с гармониками (кнопка справа внизу)

(function() {
    // Создаём HTML-структуру плеера — справа внизу
    const playerHTML = `
        <div id="globalPlayer" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(0,0,0,0.65);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(212,197,160,0.3);
            border-radius: 40px;
            padding: 10px 22px;
            cursor: pointer;
            font-family: monospace;
            font-size: 13px;
            color: #c4b58a;
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            letter-spacing: 2px;
            box-shadow: 0 0 8px rgba(0,0,0,0.4);
        ">
            <span id="playerIcon">▶</span>
            <span id="playerText">SIGNAL</span>
        </div>
    `;
    
    if (!document.getElementById('globalPlayer')) {
        document.body.insertAdjacentHTML('beforeend', playerHTML);
    }
    
    const playerDiv = document.getElementById('globalPlayer');
    const playerIcon = document.getElementById('playerIcon');
    const playerText = document.getElementById('playerText');
    
    let audioCtx = null;
    let isPlaying = false;
    let masterGain = null;
    let reverbNode = null;
    
    let oscillators = [];
    let lfo = null;
    let crackleInterval = null;
    
    // Гармоники: 432 Гц + обертоны
    const harmonics = [
        { freq: 432,  gain: 0.12,  type: 'sine' },
        { freq: 864,  gain: 0.06,  type: 'sine' },
        { freq: 1296, gain: 0.04,  type: 'triangle' },
        { freq: 216,  gain: 0.05,  type: 'sine' },
        { freq: 108,  gain: 0.03,  type: 'sine' },
        { freq: 1728, gain: 0.02,  type: 'sawtooth' }
    ];
    
    function initAudio() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.22;
        masterGain.connect(audioCtx.destination);
        
        const delay = audioCtx.createDelay();
        const feedback = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        delay.delayTime.value = 0.4;
        feedback.gain.value = 0.3;
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(filter);
        filter.connect(masterGain);
        
        reverbNode = { delay, feedback, filter };
    }
    
    function startSound() {
        if (!audioCtx) initAudio();
        if (!audioCtx) return;
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => createSoundSources());
        } else {
            createSoundSources();
        }
    }
    
    function createSoundSources() {
        if (!audioCtx) return;
        
        oscillators.forEach(osc => {
            try { osc.stop(); } catch(e) {}
            try { osc.disconnect(); } catch(e) {}
        });
        oscillators = [];
        
        lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.value = 0.15;
        lfoGain.gain.value = 1.2;
        lfo.connect(lfoGain);
        
        harmonics.forEach((harm, idx) => {
            const osc = audioCtx.createOscillator();
            const oscGain = audioCtx.createGain();
            
            osc.type = harm.type;
            osc.frequency.value = harm.freq;
            oscGain.gain.value = harm.gain;
            
            if (harm.freq === 432) {
                lfoGain.connect(osc.frequency);
            }
            
            osc.connect(oscGain);
            
            if (reverbNode) {
                oscGain.connect(reverbNode.delay);
                oscGain.connect(masterGain);
            } else {
                oscGain.connect(masterGain);
            }
            
            osc.start();
            oscillators.push(osc);
            
            if (idx === 2 || idx === 4) {
                const now = audioCtx.currentTime;
                oscGain.gain.setValueAtTime(harm.gain, now);
                oscGain.gain.exponentialRampToValueAtTime(0.01, now + 12);
                setTimeout(() => {
                    if (isPlaying && audioCtx) {
                        const newTime = audioCtx.currentTime;
                        oscGain.gain.setValueAtTime(0.01, newTime);
                        oscGain.gain.exponentialRampToValueAtTime(harm.gain, newTime + 8);
                    }
                }, 12000);
            }
        });
        
        lfo.start();
        startRandomCrackle();
        
        isPlaying = true;
        playerIcon.innerText = '⏸';
        playerText.innerText = 'SIGNAL';
        playerDiv.style.borderColor = '#d4c5a0';
        playerDiv.style.boxShadow = '0 0 18px rgba(212,197,160,0.4)';
        playerDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
    }
    
    function startRandomCrackle() {
        if (crackleInterval) clearInterval(crackleInterval);
        
        crackleInterval = setInterval(() => {
            if (!isPlaying || !audioCtx || audioCtx.state !== 'running') return;
            
            if (Math.random() > 0.85) {
                const now = audioCtx.currentTime;
                const noiseGain = audioCtx.createGain();
                noiseGain.gain.setValueAtTime(0.02, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
                
                const bufferSize = 4096;
                const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() - 0.5) * 0.8;
                }
                
                const noiseSource = audioCtx.createBufferSource();
                noiseSource.buffer = noiseBuffer;
                noiseSource.connect(noiseGain);
                noiseGain.connect(masterGain);
                noiseSource.start(now);
            }
        }, 8000);
    }
    
    function stopSound() {
        if (crackleInterval) {
            clearInterval(crackleInterval);
            crackleInterval = null;
        }
        
        oscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch(e) {}
        });
        oscillators = [];
        
        if (lfo) {
            try { lfo.stop(); } catch(e) {}
            lfo = null;
        }
        
        if (audioCtx) {
            audioCtx.suspend().catch(e => console.log);
        }
        
        isPlaying = false;
        playerIcon.innerText = '▶';
        playerText.innerText = 'SIGNAL';
        playerDiv.style.borderColor = 'rgba(212,197,160,0.3)';
        playerDiv.style.boxShadow = '0 0 8px rgba(0,0,0,0.4)';
        playerDiv.style.backgroundColor = 'rgba(0,0,0,0.65)';
    }
    
    if (playerDiv) {
        playerDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (!isPlaying) {
                if (audioCtx && audioCtx.state === 'suspended') {
                    audioCtx.resume().then(() => startSound());
                } else {
                    startSound();
                }
            } else {
                stopSound();
            }
        });
        
        playerDiv.addEventListener('mouseenter', () => {
            playerDiv.style.backgroundColor = 'rgba(0,0,0,0.85)';
            if (!isPlaying) playerDiv.style.borderColor = '#d4c5a0';
        });
        playerDiv.addEventListener('mouseleave', () => {
            if (!isPlaying) {
                playerDiv.style.backgroundColor = 'rgba(0,0,0,0.65)';
                playerDiv.style.borderColor = 'rgba(212,197,160,0.3)';
            }
        });
    }
    
    if (document.body._audioClickHandler) {
        document.body.removeEventListener('click', document.body._audioClickHandler);
        document.body._audioClickHandler = null;
    }
    
    console.log('🎵 432 Hz Generator | SIGNAL');
})();
