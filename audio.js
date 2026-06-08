// audio.js — двойной генератор 216 Гц и 432 Гц (кнопки снизу по центру)

(function() {
    // Контейнер для кнопок
    const container = document.createElement('div');
    container.id = 'audioPlayerContainer';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 15px;
        z-index: 9999;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(8px);
        padding: 8px 20px;
        border-radius: 50px;
        border: 1px solid rgba(212,197,160,0.3);
        font-family: monospace;
    `;
    
    // Кнопка 216 Гц
    const btn216 = document.createElement('div');
    btn216.id = 'btn216';
    btn216.innerHTML = '◉ 216 Hz';
    btn216.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        color: #c4b58a;
        font-size: 12px;
        letter-spacing: 2px;
        transition: 0.2s;
        border-radius: 30px;
    `;
    
    // Кнопка 432 Гц
    const btn432 = document.createElement('div');
    btn432.id = 'btn432';
    btn432.innerHTML = '◉ 432 Hz';
    btn432.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        color: #c4b58a;
        font-size: 12px;
        letter-spacing: 2px;
        transition: 0.2s;
        border-radius: 30px;
    `;
    
    btn216.addEventListener('mouseenter', () => {
        btn216.style.background = 'rgba(212,197,160,0.2)';
    });
    btn216.addEventListener('mouseleave', () => {
        btn216.style.background = 'transparent';
    });
    
    btn432.addEventListener('mouseenter', () => {
        btn432.style.background = 'rgba(212,197,160,0.2)';
    });
    btn432.addEventListener('mouseleave', () => {
        btn432.style.background = 'transparent';
    });
    
    container.appendChild(btn216);
    container.appendChild(btn432);
    
    // Добавляем контейнер в body, если его ещё нет
    if (!document.getElementById('audioPlayerContainer')) {
        document.body.appendChild(container);
    }
    
    // Аудио-контексты
    let ctx216 = null, ctx432 = null;
    let is216 = false, is432 = false;
    let sources216 = [], sources432 = [];
    let lfo216 = null, lfo432 = null;
    let crackle216 = null, crackle432 = null;
    
    // Гармоники для 216 Гц
    const harmonics216 = [
        { freq: 216, gain: 0.14, type: 'sine' },
        { freq: 108, gain: 0.07, type: 'sine' },
        { freq: 432, gain: 0.05, type: 'sine' },
        { freq: 54,  gain: 0.03, type: 'sine' },
        { freq: 864, gain: 0.02, type: 'triangle' }
    ];
    
    // Гармоники для 432 Гц
    const harmonics432 = [
        { freq: 432, gain: 0.12, type: 'sine' },
        { freq: 864, gain: 0.06, type: 'sine' },
        { freq: 1296, gain: 0.04, type: 'triangle' },
        { freq: 216, gain: 0.04, type: 'sine' },
        { freq: 1728, gain: 0.02, type: 'sawtooth' }
    ];
    
    function init216() {
        if (ctx216) return;
        ctx216 = new (window.AudioContext || window.webkitAudioContext)();
        const master = ctx216.createGain();
        master.gain.value = 0.2;
        master.connect(ctx216.destination);
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
        if (ctx216.state === 'suspended') ctx216.resume();
        
        sources216.forEach(s => { try { s.stop(); s.disconnect(); } catch(e) {} });
        sources216 = [];
        
        lfo216 = ctx216.createOscillator();
        const lfoGain = ctx216.createGain();
        lfo216.frequency.value = 0.12;
        lfoGain.gain.value = 1.0;
        lfo216.connect(lfoGain);
        
        harmonics216.forEach(harm => {
            const osc = ctx216.createOscillator();
            const gain = ctx216.createGain();
            osc.type = harm.type;
            osc.frequency.value = harm.freq;
            gain.gain.value = harm.gain;
            if (harm.freq === 216) lfoGain.connect(osc.frequency);
            osc.connect(gain);
            gain.connect(ctx216.reverb.delay);
            gain.connect(ctx216.reverb.master);
            osc.start();
            sources216.push(osc);
        });
        lfo216.start();
        
        is216 = true;
        btn216.style.color = '#d4c5a0';
        btn216.style.textShadow = '0 0 8px #d4c5a0';
        btn216.innerHTML = '⏸ 216 Hz';
    }
    
    function stop216() {
        sources216.forEach(s => { try { s.stop(); s.disconnect(); } catch(e) {} });
        sources216 = [];
        if (lfo216) { try { lfo216.stop(); } catch(e) {} lfo216 = null; }
        if (ctx216) ctx216.suspend();
        is216 = false;
        btn216.style.color = '#c4b58a';
        btn216.style.textShadow = 'none';
        btn216.innerHTML = '◉ 216 Hz';
    }
    
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
        if (ctx432.state === 'suspended') ctx432.resume();
        
        sources432.forEach(s => { try { s.stop(); s.disconnect(); } catch(e) {} });
        sources432 = [];
        
        lfo432 = ctx432.createOscillator();
        const lfoGain = ctx432.createGain();
        lfo432.frequency.value = 0.18;
        lfoGain.gain.value = 1.2;
        lfo432.connect(lfoGain);
        
        harmonics432.forEach(harm => {
            const osc = ctx432.createOscillator();
            const gain = ctx432.createGain();
            osc.type = harm.type;
            osc.frequency.value = harm.freq;
            gain.gain.value = harm.gain;
            if (harm.freq === 432) lfoGain.connect(osc.frequency);
            osc.connect(gain);
            gain.connect(ctx432.reverb.delay);
            gain.connect(ctx432.reverb.master);
            osc.start();
            sources432.push(osc);
        });
        lfo432.start();
        
        is432 = true;
        btn432.style.color = '#d4c5a0';
        btn432.style.textShadow = '0 0 8px #d4c5a0';
        btn432.innerHTML = '⏸ 432 Hz';
    }
    
    function stop432() {
        sources432.forEach(s => { try { s.stop(); s.disconnect(); } catch(e) {} });
        sources432 = [];
        if (lfo432) { try { lfo432.stop(); } catch(e) {} lfo432 = null; }
        if (ctx432) ctx432.suspend();
        is432 = false;
        btn432.style.color = '#c4b58a';
        btn432.style.textShadow = 'none';
        btn432.innerHTML = '◉ 432 Hz';
    }
    
    btn216.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!is216) start216();
        else stop216();
    });
    
    btn432.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!is432) start432();
        else stop432();
    });
    
    // Удаляем старые обработчики, если были
    if (document.body._audioClickHandler) {
        document.body.removeEventListener('click', document.body._audioClickHandler);
        document.body._audioClickHandler = null;
    }
    
    console.log('🎵 Двойной генератор | Кнопки снизу по центру');
})();
