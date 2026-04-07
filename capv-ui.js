const playBtn = document.getElementById('play-btn-large');
const playhead = document.getElementById('playhead');
const trackContainer = document.getElementById('track-container');
const ratioModal = document.getElementById('ratio-modal-container');
const PTS_PER_SEC = 30;

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (window.video.src) URL.revokeObjectURL(window.video.src);
    window.video.src = URL.createObjectURL(file);
    window.video.load();

    window.video.onloadeddata = () => {
        const duration = window.video.duration;
        if (trackContainer) {
            trackContainer.innerHTML = `<div class="video-track-clip" style="width:${duration * PTS_PER_SEC}px; background:rgba(251,191,36,0.3); border:1px solid #fbbf24; height:40px; display:flex; align-items:center; padding:0 10px; color:#fff; font-size:10px; border-radius:4px;">${file.name}</div>`;
        }
        window.setAspectRatio();
        window.video.currentTime = 0.1;
        setTimeout(() => { window.render(); }, 300);
    };
}

function togglePlayback() {
    if (!window.video.src) return;
    if (window.video.paused) {
        window.video.muted = false;
        window.video.play().then(() => {
            isPlaying = true;
            if(playBtn) playBtn.innerHTML = '⏸';
            window.render();
        });
    } else {
        window.video.pause();
        isPlaying = false;
        if(playBtn) playBtn.innerHTML = '▶';
    }
}

// UI फंक्शन्स को ग्लोबल बनाना
window.importFile = () => document.getElementById('file-input').click();
window.handleFileUpload = handleFileUpload;
window.togglePlayback = togglePlayback;

window.toggleRatioModal = (e) => {
    if (e) e.stopPropagation();
    ratioModal.style.display = (ratioModal.style.display === 'block') ? 'none' : 'block';
};

window.hideRatioModal = () => { ratioModal.style.display = 'none'; };

window.selectRatio = (r, label) => {
    window.currentRatio = r;
    const ratioText = document.getElementById('current-ratio-text');
    if (ratioText) ratioText.innerText = label + ' ▼';
    window.setAspectRatio();
    window.hideRatioModal();
};

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

// पेज लोड होते ही डिफ़ॉल्ट 9:16 फ्रेम दिखाना
window.addEventListener('load', () => {
    setTimeout(() => {
        window.setAspectRatio();
        window.render();
    }, 500);
});
