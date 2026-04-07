const playBtn = document.getElementById('play-btn-large');
const playhead = document.getElementById('playhead'), trackContainer = document.getElementById('track-container');
const ratioModal = document.getElementById('ratio-modal-container');
const PTS_PER_SEC = 30;

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (window.video.src) URL.revokeObjectURL(window.video.src);
    const url = URL.createObjectURL(file);
    
    window.video.src = url;
    window.video.load();

    window.video.onloadedmetadata = () => {
        const duration = window.video.duration;
        if (trackContainer) {
            trackContainer.innerHTML = `<div class="video-track-clip" style="width:${duration * PTS_PER_SEC}px"><span>${file.name}</span></div>`;
        }
        window.setAspectRatio();
        window.video.currentTime = 0.1; // जगाने के लिए
    };

    window.video.oncanplay = () => {
        window.render();
    };
}

function togglePlayback() {
    if (!window.video.src) return;
    if (window.video.paused) {
        window.video.muted = false; // प्ले करते समय आवाज़
        window.video.play();
        window.isPlaying = true;
        playBtn.innerHTML = '⏸';
        window.render();
    } else {
        window.video.pause();
        window.isPlaying = false;
        playBtn.innerHTML = '▶';
    }
}

// बाकी फंक्शन
window.importFile = () => document.getElementById('file-input').click();
window.handleFileUpload = handleFileUpload;
window.togglePlayback = togglePlayback;
window.updateSync = () => {
    if (playhead) playhead.style.left = (window.video.currentTime * PTS_PER_SEC) + 'px';
};
window.toggleRatioModal = (e) => {
    if (e) e.stopPropagation();
    ratioModal.style.display = (ratioModal.style.display === 'block') ? 'none' : 'block';
};
window.selectRatio = (r, label) => {
    window.currentRatio = r;
    document.getElementById('current-ratio-text').innerText = label + ' ▼';
    window.setAspectRatio();
    ratioModal.style.display = 'none';
};

window.onload = () => { window.setAspectRatio(); };
