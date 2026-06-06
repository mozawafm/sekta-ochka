// audio.js — двойной генератор 216 Гц и 432 Гц

(function() {
    // Кнопка 216 Гц (левый верхний угол)
    const player216HTML = `
        <div id="player216" style="
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            background: rgba(0,0,0,0.65);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(160,140,120,0.4);
            border-radius: 40px;
            padding: 8px 18px;
            cursor: pointer;
            font-family: monospace;
            font-size: 12px;
            color: #b0a080;
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: 1px;
            box-shadow: 0 0 8px rgba(0,0,0,0.4);
        ">
            <span id="icon216">▶</span>
            <span id="text216">216 Hz</span>
        </div>
    `;
    
    // Кнопка 432 Гц (правый нижний угол)
    const player432HTML = `
        <div id="player432" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(0,0,0,0.65);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(212,197,160,0.4);
            border-radius: 40px;
            padding: 8px 18px;
            cursor: pointer;
            font-family: monospace;
            font-size: 12px;
            color: #d4c5a0;
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: 1px;
            box-shadow: 0 0 8px rgba(0,0,0,0.4);
        ">
            <span id="icon432">▶</span>
            <span id="text432">432 Hz</span>
        </div>
    `;
    
    if (!document.getElementById('player216')) {
        document.body.insertAdjacentHTML('beforeend', player216HTML);
    }
    if (!document.getElementById('player432')) {
        document.body.insertAdjacentHTML('beforeend', player432HTML);
    }
    
    const player216 = document.getElementById('player216');
    const player432 = document.getElementById('player432');
    const icon216 = document.getElementById('icon216');
    const text216 = document.getElementById('text216');
    const icon432 = document.getElementById('icon432');
    const text432 = document.getElementById('text432');
    
    // Контексты отдельные для каждой частоты (можно микшировать)
    let ctx216 = null;
    let ctx432 = null;
    
    let is216Playing = false;
    let is432Playing = false;
    
    let sources216 = [];
    let sources432 = [];
    let lfo216 = null;
    let lfo432 = null;
    let crackle216 = null;
    let crackle432 = null;
    
    // ============================================
    // 216 Гц — низкий, басовый
    // ============================================
    const harmonics216 = [
        { freq: 216,  gain: 0.14, type: 'sine' },      // Основной
        { freq: 108,  gain: 0.07, type: 'sine' },      // Суб-бас (октава вниз)
        { freq: 432,  gain: 0.05, type: 'sine' },      // Октава вверх (чуть светлее)
        { freq: 54,   gain: 0.03, type: 'sine' },      // Глубокий гул
        { freq: 864,  gain: 0.02, type: 'triangle' }   // Лёгкое мерцание
    ];
    
    function init216() {
        if (ctx216) return;
        ctx216 = new (window.AudioContext || window.webkitAudioContext)();
        
        const master = ctx216.createGain();
        master.gain.value = 0.2;
        master.connect(ctx216.destination);
        
        // Реверберация
        const delay = ctx216.createDelay();
        const feedback = ctx216.createGain();
        const filter = ctx216.createBiquadFilter();
        
        delay.delayTime.value = 0.45;
        feedback.gain.value = 0.35;
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(filter);
        filter.connect(master);
        
        ctx216.reverb = { delay, feedback, filter, master };
    }
    
    function start216() {
        if (!ctx216) init216();
        if (!ctx216) return;
        
        if (ctx216.state === 'suspended') {
            ctx216.resume().then(() => create216Sources());
        } else {
            create216Sources();
        }
    }
    
    function create216Sources() {
        if (!ctx216) return;
        
        sources216.forEach(s => { try { s.stop(); s.disconnect(); } catch(e) {} });
        sources216 = [];
        
        // LFO для вибрации
        lfo216 = ctx216.createOscillator();
        const lfoGain = ctx216.createGain();
        lfo216.frequency.value = 0.12;
        lfoGain.gain.value = 1.0;
        lfo216.connect(lfoGain);
        
        harmonics216.forEach((harm, idx) => {
            const osc = ctx216.createOscillator();
            const gain = ctx216.createGain();
            osc.type = harm.type;
            osc.frequency.value = harm.freq;
            gain.gain.value = harm.gain;
            
            if (harm.freq === 216) {
                lfoGain.connect(osc.frequency);
            }
            
            osc.connect(gain);
            if (ctx216.reverb) {
                gain.connect(ctx216.reverb.delay);
                gain.connect(ctx216.reverb.master);
            } else {
                gain.connect(ctx216.reverb.master);
            }
            osc.start();
            sources216.push(osc);
        });
        
        lfo216.start();
        startCrackle216();
        
        is216Playing = true;
        icon216.innerText = '⏸';
        text216.innerText = '216 Hz';
        player216.style.borderColor = '#b0a080';
        player216.style.boxShadow = '0 0 14px rgba(160,140,120,0.4)';
    }
    
    function startCrackle216() {
        if (crackle216) clearInterval(crackle216);
        crackle216 = setInterval(() => {
            if (!is216Playing || !ctx216 || ctx216.state !== 'running') return;
            if (Math.random() > 0.88) {
                const now = ctx216.currentTime;
                const noiseGain = ctx216.createGain();
                noiseGain.gain.setValueAtTime(0.015, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
                const bufferSize = 4096;
                const noiseBuffer = ctx216.createBuffer(1, bufferSize, ctx216.sampleRate);
                const data = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() - 0.5) * 0.6;
                const source = ctx216.createBufferSource();
                source.buffer = noiseBuffer;
                source.connect(noiseGain);
                noiseGain.connect(ctx216.reverb.master);
                source.start(now);
            }
        }, 7000);
    }
    
    function stop216() {
        if (crackle216) { clearInterval(crackle216); crackle216 = null; }
        sources216.forEach(s => { try { s.stop(); s.disconnect(); } catch(e) {} });
        sources216 = [];
        if (lfo216) { try { lfo216.stop(); } catch(e) {} lfo216 = null; }
        if (ctx216) ctx216.suspend().catch(e => console.log);
        is216Playing = false;
        icon216.innerText = '▶';
        text216.innerText = '216 Hz';
        player216.style.borderColor = 'rgba(160,140,120,0.3)';
        player216.style.boxShadow = '0 0 8px rgba(0,0,0,0.4)';
    }
    
    // ============================================
    // 432 Гц — светлый, воздушный
    // ============================================
    const harmonics432 = [
        { freq: 432,  gain: 0.12, type: 'sine' },
        { freq: 864,  gain: 0.06, type: 'sine' },
        { freq: 1296, gain: 0.04, type: 'triangle' },
        { freq: 216,  gain: 0.04, type: 'sine' },
        { freq: 1728, gain: 0.02, type: 'sawtooth' }
    ];
    
    function init432() {
        if (ctx432) return;
        ctx432 = new (window.AudioContext || window.webkitAudioContext)();
        
        const master = ctx432.createGain();
        master.gain.value = 0.22;
        master.connect(ctx432.destination);
        
        const delay = ctx432.createDelay();
        const feedback = ctx432.createGain();
        const filter = ctx432.createBiquadFilter();
        
        delay.delayTime.value = 0.4;
        feedback.gain.value = 0.3;
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(filter);
        filter.connect(master);
        
        ctx432.reverb = { delay, feedback, filter, master };
    }
    
    function start432() {
        if (!ctx432) init432();
        if (!ctx432) return;
        
        if (ctx432.state === 'suspended') {
            ctx432.resume().then(() => create432Sources());
        } else {
            create432Sources();
        }
    }
    
    function create432Sources() {
        if (!ctx432) return;
        
        sources432.forEach(s => { try { s.stop(); s.disconnect(); } catch(e) {} });
        sources432 = [];
        
        lfo432 = ctx432.createOscillator();
        const lfoGain = ctx432.createGain();
        lfo432.frequency.value = 0.18;
        lfoGain.gain.value = 1.2;
        lfo432.connect(lfoGain);
        
        harmonics432.forEach((harm, idx) => {
            const osc = ctx432.createOscillator();
            const gain = ctx432.createGain();
            osc.type = harm.type;
            osc.frequency.value = harm.freq;
            gain.gain.value = harm.gain;
            
            if (harm.freq === 432) {
                lfoGain.connect(osc.frequency);
            }
            
            osc.connect(gain);
            if (ctx432.reverb) {
                gain.connect(ctx432.reverb.delay);
                gain.connect(ctx432.reverb.master);
            } else {
                gain.connect(ctx432.reverb.master);
            }
            osc.start();
            sources432.push(osc);
        });
        
        lfo432.start();
        startCrackle432();
        
        is432Playing = true;
        icon432.innerText = '⏸';
        text432.innerText = '432 Hz';
        player432.style.borderColor = '#d4c5a0';
        player432.style.boxShadow = '0 0 14px rgba(212,197,160,0.4)';
    }
    
    function startCrackle432() {
        if (crackle432) clearInterval(crackle432);
        crackle432 = setInterval(() => {
            if (!is432Playing || !ctx432 || ctx432.state !== 'running') return;
            if (Math.random() > 0.85) {
                const now = ctx432.currentTime;
                const noiseGain = ctx432.createGain();
                noiseGain.gain.setValueAtTime(0.018, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
                const bufferSize = 4096;
                const noiseBuffer = ctx432.createBuffer(1, bufferSize, ctx432.sampleRate);
                const data = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() - 0.5) * 0.7;
                const source = ctx432.createBufferSource();
                source.buffer = noiseBuffer;
                source.connect(noiseGain);
                noiseGain.connect(ctx432.reverb.master);
                source.start(now);
            }
        }, 8000);
    }
    
    function stop432() {
        if (crackle432) { clearInterval(crackle432); crackle432 = null; }
        sources432.forEach(s => { try { s.stop(); s.disconnect(); } catch(e) {} });
        sources432 = [];
        if (lfo432) { try { lfo432.stop(); } catch(e) {} lfo432 = null; }
        if (ctx432) ctx432.suspend().catch(e => console.log);
        is432Playing = false;
        icon432.innerText = '▶';
        text432.innerText = '432 Hz';
        player432.style.borderColor = 'rgba(212,197,160,0.3)';
        player432.style.boxShadow = '0 0 8px rgba(0,0,0,0.4)';
    }
    
    // ============================================
    // ОБРАБОТЧИКИ
    // ============================================
    player216.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!is216Playing) {
            if (ctx216 && ctx216.state === 'suspended') {
                ctx216.resume().then(() => start216());
            } else {
                start216();
            }
        } else {
            stop216();
        }
    });
    
    player432.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!is432Playing) {
            if (ctx432 && ctx432.state === 'suspended') {
                ctx432.resume().then(() => start432());
            } else {
                start432();
            }
        } else {
            stop432();
        }
    });
    
    // Ховеры
    player216.addEventListener('mouseenter', () => {
        player216.style.backgroundColor = 'rgba(0,0,0,0.85)';
        if (!is216Playing) player216.style.borderColor = '#b0a080';
    });
    player216.addEventListener('mouseleave', () => {
        if (!is216Playing) {
            player216.style.backgroundColor = 'rgba(0,0,0,0.65)';
            player216.style.borderColor = 'rgba(160,140,120,0.3)';
        }
    });
    
    player432.addEventListener('mouseenter', () => {
        player432.style.backgroundColor = 'rgba(0,0,0,0.85)';
        if (!is432Playing) player432.style.borderColor = '#d4c5a0';
    });
    player432.addEventListener('mouseleave', () => {
        if (!is432Playing) {
            player432.style.backgroundColor = 'rgba(0,0,0,0.65)';
            player432.style.borderColor = 'rgba(212,197,160,0.3)';
        }
    });
    
    // Удаляем старый обработчик body, если был
    if (document.body._audioClickHandler) {
        document.body.removeEventListener('click', document.body._audioClickHandler);
        document.body._audioClickHandler = null;
    }
    
    console.log('🎵 Dual generator: 216 Hz (low) + 432 Hz (high)');
})();
