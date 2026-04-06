const playBtn = document.getElementById('play-btn-large');
const playhead = document.getElementById('playhead'), trackContainer = document.getElementById('track-container');
const ratioModal = document.getElementById('ratio-modal-container');
const PTS_PER_SEC = 30;

function toggleRatioModal(e) { 
    if(e) e.stopPropagation(); 
    ratioModal.style.display = (ratioModal.style.display === 'block') ? 'none' : 'block'; 
}
function hideRatioModal() { ratioModal.style.display = 'none'; }

function selectRatio(r, label) {
    window.currentRatio = r;
    const btn = document.getElementById('current-ratio-text');
    if(btn) btn.innerText = label + ' ▼';
    window.setAspectRatio(); hideRatioModal();
}

window.applyCustomRatio = function() {
    const w = parseFloat(document.getElementById('custom-w').value);
    const h = parseFloat(document.getElementById('custom-h').value);
    if (w > 0 && h > 0) { selectRatio(w/h, w+':'+h); }
};

function updateSync() {
    if(playhead) playhead.style.left = (window.video.currentTime * PTS_PER_SEC) + 'px';
    const mins = Math.floor(window.video.currentTime / 60), secs = Math.floor(window.video.currentTime % 60);
    const frames = Math.floor((window.video.currentTime % 1) * 30);
    const timeCode = document.getElementById('time-code');
    if(timeCode) timeCode.innerText = `00:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}:${frames.toString().padStart(2,'0')}`;
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

function importFile() { document.getElementById('file-input').click(); }

function handleFileUpload(e) {
    const file = e.target.files[0]; if(!file) return;
    window.video.src = URL.createObjectURL(file);
    window.video.onloadedmetadata = () => {
        const w = window.video.duration * PTS_PER_SEC;
        if(trackContainer) trackContainer.innerHTML = `<div class="video-track-clip" style="width:${w}px; padding: 0 10px; display: flex; align-items: center; color: #fbbf24; font-size: 10px;">${file.name}</div>`;
        window.setAspectRatio();
        window.render();
    };
}

// ग्लोबल फंक्शन्स
window.toggleRatioModal = toggleRatioModal; window.hideRatioModal = hideRatioModal;
window.selectRatio = selectRatio; window.updateSync = updateSync;
window.togglePlayback = togglePlayback; window.importFile = importFile;
window.handleFileUpload = handleFileUpload;

window.onload = () => { window.setAspectRatio(); };
