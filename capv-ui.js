const playBtn = document.getElementById('play-btn-large');
const playhead = document.getElementById('playhead');
const trackContainer = document.getElementById('track-container');
const ratioModal = document.getElementById('ratio-modal-container');
const PTS_PER_SEC = 30;

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (window.video.src) URL.revokeObjectURL(window.video.src);
    const url = URL.createObjectURL(file);
    
    window.video.src = url;
    window.video.load();

    window.video.onloadeddata = () => {
        const duration = window.video.duration;
        if (trackContainer) {
            trackContainer.innerHTML = `<div class="video-track-clip" style="width:${duration * PTS_PER_SEC}px; background:rgba(251,191,36,0.3); border:1px solid #fbbf24; height:40px; display:flex; align-items:center; padding:0 10px; color:#fff; font-size:10px;">${file.name}</div>`;
        }
        window.setAspectRatio();
        window.video.currentTime = 0.1; // जगाने के लिए
        setTimeout(() => { window.render(); }, 200);
    };
}

function togglePlayback() {
    if (!window.video.src) return;
    if (window.video.paused) {
        window.video.muted = false;
        window.video.play().then(() => {
            window.isPlaying = true;
            if(playBtn) playBtn.innerHTML = '⏸';
            window.render();
        });
    } else {
        window.video.pause();
        window.isPlaying = false;
        if(playBtn) playBtn.innerHTML = '▶';
    }
}

window.importFile = () => document.getElementById('file-input').click();
window.handleFileUpload = handleFileUpload;
window.togglePlayback = togglePlayback;
window.updateSync = () => {
    if (playhead) playhead.style.left = (window.video.currentTime * PTS_PER_SEC) + 'px';
    const timeCode = document.getElementById('time-code');
    if (timeCode) {
        const mins = Math.floor(window.video.currentTime / 60);
        const secs = Math.floor(window.video.currentTime % 60);
        const frames = Math.floor((window.video.currentTime % 1) * 30);
        timeCode.innerText = `00:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}:${frames.toString().padStart(2,'0')}`;
    }
};

window.toggleRatioModal = (e) => {
    if (e) e.stopPropagation();
    if (ratioModal) ratioModal.style.display = (ratioModal.style.display === 'block') ? 'none' : 'block';
};

window.selectRatio = (r, label) => {
    window.currentRatio = r;
    const ratioText = document.getElementById('current-ratio-text');
    if (ratioText) ratioText.innerText = label + ' ▼';
    window.setAspectRatio();
    if (ratioModal) ratioModal.style.display = 'none';
};

// साइट खुलते ही सब कुछ सेटअप करें
window.addEventListener('load', () => {
    setTimeout(() => {
        window.setAspectRatio();
        window.render();
    }, 500);
});
