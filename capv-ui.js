const playBtn = document.getElementById('play-btn-large');
const playhead = document.getElementById('playhead'), trackContainer = document.getElementById('track-container');
const ratioModal = document.getElementById('ratio-modal-container');
const PTS_PER_SEC = 30;

function handleFileUpload(e) {
    const file = e.target.files[0]; if(!file) return;
    window.video.src = URL.createObjectURL(file);
    window.video.onloadedmetadata = () => {
        const w = window.video.duration * PTS_PER_SEC;
        trackContainer.innerHTML = `<div class="video-track-clip" style="width:${w}px"><span>${file.name}</span></div>`;
        window.setAspectRatio();
        window.render();
    };
}

function togglePlayback() {
    if(!window.video.src) return;
    if(window.isPlaying) {
        window.video.pause();
        window.isPlaying = false;
        playBtn.innerHTML = '▶';
    } else {
        window.video.play().then(() => {
            window.isPlaying = true;
            playBtn.innerHTML = '⏸';
            window.render();
        });
    }
}

window.importFile = () => document.getElementById('file-input').click();
window.handleFileUpload = handleFileUpload;
window.togglePlayback = togglePlayback;
window.updateSync = () => {
    playhead.style.left = (window.video.currentTime * PTS_PER_SEC) + 'px';
};
window.toggleRatioModal = (e) => {
    e.stopPropagation();
    ratioModal.style.display = (ratioModal.style.display === 'block') ? 'none' : 'block';
};
window.selectRatio = (r, label) => {
    window.currentRatio = r;
    document.getElementById('current-ratio-text').innerText = label + ' ▼';
    window.setAspectRatio();
    ratioModal.style.display = 'none';
};
window.onload = () => { window.setAspectRatio(); };
    
