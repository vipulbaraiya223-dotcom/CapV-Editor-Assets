const playBtn = document.getElementById('play-btn-large');
const playhead = document.getElementById('playhead'), trackContainer = document.getElementById('track-container');
const ratioModal = document.getElementById('ratio-modal-container');
const PTS_PER_SEC = 30;

function toggleRatioModal(e) { 
    if(e) e.stopPropagation(); 
    if(ratioModal) ratioModal.style.display = (ratioModal.style.display === 'block') ? 'none' : 'block'; 
}

function selectRatio(r, label) {
    window.currentRatio = r;
    const btn = document.getElementById('current-ratio-text');
    if(btn) btn.innerText = label + ' ▼';
    if(window.setAspectRatio) window.setAspectRatio();
    if(ratioModal) ratioModal.style.display = 'none';
}

function handleFileUpload(e) {
    const file = e.target.files[0]; 
    if(!file) return;

    // मेमोरी साफ़ करने के लिए पुराना URL हटाएं
    if(window.video.src) URL.revokeObjectURL(window.video.src);
    
    window.video.src = URL.createObjectURL(file);
    window.video.load(); // वीडियो को लोड करना शुरू करें

    // जब वीडियो का डाटा लोड हो जाए
    window.video.onloadeddata = () => {
        const w = window.video.duration * PTS_PER_SEC;
        if(trackContainer) {
            trackContainer.innerHTML = `<div class="video-track-clip" style="width:${w}px; padding:10px; color:#fbbf24; font-size:10px; display:flex; align-items:center;"><span>${file.name}</span></div>`;
        }
        
        if(window.setAspectRatio) window.setAspectRatio();
        
        // वीडियो को थोड़ा सा आगे बढ़ाएं ताकि पहला फ्रेम लोड हो जाए (काली स्क्रीन न दिखे)
        window.video.currentTime = 0.1;
    };

    // जब वीडियो फ्रेम पर पहुँच जाए, तब रेंडर करें
    window.video.onseeked = () => {
        if(window.render) window.render();
    };
}

function togglePlayback() {
    if(!window.video.src) return;
    if(window.isPlaying) { 
        window.video.pause(); 
        window.isPlaying = false; 
        if(playBtn) playBtn.innerHTML = '▶'; 
    } else { 
        window.video.play().then(() => { 
            window.isPlaying = true; 
            if(playBtn) playBtn.innerHTML = '⏸'; 
            if(window.render) window.render(); 
        }).catch(err => console.log("Play error:", err)); 
    }
}

// ग्लोबल फंक्शन्स
window.handleFileUpload = handleFileUpload;
window.importFile = () => {
    const input = document.getElementById('file-input');
    if(input) input.click();
};
window.togglePlayback = togglePlayback;
window.toggleRatioModal = toggleRatioModal;
window.selectRatio = selectRatio;

window.updateSync = () => {
    if(playhead) playhead.style.left = (window.video.currentTime * PTS_PER_SEC) + 'px';
    
    // टाइमकोड अपडेट करें
    const timeCode = document.getElementById('time-code');
    if(timeCode) {
        const mins = Math.floor(window.video.currentTime / 60);
        const secs = Math.floor(window.video.currentTime % 60);
        const frames = Math.floor((window.video.currentTime % 1) * 30);
        timeCode.innerText = `00:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}:${frames.toString().padStart(2,'0')}`;
    }
};

window.onload = () => { 
    if(window.setAspectRatio) window.setAspectRatio(); 
};
