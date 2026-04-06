const playBtn = document.getElementById('play-btn-large');
const playhead = document.getElementById('playhead'), trackContainer = document.getElementById('track-container');
const ratioModal = document.getElementById('ratio-modal-container');
const PTS_PER_SEC = 30;

function toggleRatioModal(e) { 
    if(e) e.stopPropagation(); 
    ratioModal.style.display = (ratioModal.style.display === 'block') ? 'none' : 'block'; 
}

function selectRatio(r, label) {
    window.currentRatio = r;
    const btn = document.getElementById('current-ratio-text');
    if(btn) btn.innerText = label + ' ▼';
    window.setAspectRatio();
    ratioModal.style.display = 'none';
}

function handleFileUpload(e) {
    const file = e.target.files[0]; if(!file) return;
    window.video.src = URL.createObjectURL(file);
    
    // वीडियो लोड होते ही यह हिस्सा चलेगा
    window.video.onloadeddata = () => {
        const w = window.video.duration * PTS_PER_SEC;
        if(trackContainer) trackContainer.innerHTML = `<div class="video-track-clip" style="width:${w}px"><span>${file.name}</span></div>`;
        window.setAspectRatio(); // रेशियो सेट करें
        window.render(); // प्रीव्यू लोड करें
    };
}

function togglePlayback() {
    if(!window.video.src) return;
    if(window.isPlaying) { 
        window.video.pause(); window.isPlaying = false; 
        if(playBtn) playBtn.innerHTML = '▶'; 
    } else { 
        window.video.play().then(() => { 
            window.isPlaying = true; 
            if(playBtn) playBtn.innerHTML = '⏸'; 
            window.render(); 
        }); 
    }
}

window.handleFileUpload = handleFileUpload;
window.importFile = () => document.getElementById('file-input').click();
window.togglePlayback = togglePlayback;
window.toggleRatioModal = toggleRatioModal;
window.selectRatio = selectRatio;
window.updateSync = () => {
    if(playhead) playhead.style.left = (window.video.currentTime * PTS_PER_SEC) + 'px';
};
window.onload = () => { window.setAspectRatio(); };
        
