const playBtn = document.getElementById('play-btn-large');
const playhead = document.getElementById('playhead'), timelineRuler = document.getElementById('timeline-ruler');
const trackContainer = document.getElementById('track-container'), ratioModal = document.getElementById('ratio-modal-container');
const PTS_PER_SEC = 30;

function toggleRatioModal(e) { e.stopPropagation(); ratioModal.style.display = (ratioModal.style.display === 'block') ? 'none' : 'block'; }
function hideRatioModal() { ratioModal.style.display = 'none'; }

function selectRatio(r, label, el) {
    window.currentRatio = r;
    document.querySelectorAll('.ratio-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('current-ratio-text').innerText = label;
    window.setAspectRatio(); hideRatioModal();
}

function updateSync() {
    playhead.style.left = (window.video.currentTime * PTS_PER_SEC) + 'px';
    const mins = Math.floor(window.video.currentTime / 60), secs = Math.floor(window.video.currentTime % 60);
    const frames = Math.floor((window.video.currentTime % 1) * 30);
    document.getElementById('time-code').innerText = `00:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}:${frames.toString().padStart(2,'0')}`;
}

function togglePlayback() {
    if(!window.video.src) return;
    if(window.isPlaying) { window.video.pause(); window.isPlaying = false; playBtn.innerHTML = '▶'; }
    else { window.video.play().then(() => { window.isPlaying = true; playBtn.innerHTML = '⏸'; window.render(); }); }
}

function importFile() { document.getElementById('file-input').click(); }

function handleFileUpload(e) {
    const file = e.target.files[0]; if(!file) return;
    window.video.src = URL.createObjectURL(file);
    window.video.onloadedmetadata = () => {
        const w = window.video.duration * PTS_PER_SEC;
        trackContainer.innerHTML = `<div class="video-track-clip" style="width:${w}px"><span class="px-3 text-[10px] font-bold text-yellow-500">${file.name}</span></div>`;
        window.setAspectRatio(); window.render();
    };
}

// Global functions for HTML access
window.toggleRatioModal = toggleRatioModal; window.hideRatioModal = hideRatioModal;
window.selectRatio = selectRatio; window.updateSync = updateSync;
window.togglePlayback = togglePlayback; window.importFile = importFile;
window.handleFileUpload = handleFileUpload;

window.onload = () => { window.setAspectRatio(); };
function applyCustomRatio() {
    const w = parseFloat(document.getElementById('custom-w').value);
    const h = parseFloat(document.getElementById('custom-h').value);

    if (w > 0 && h > 0) {
        const ratio = w / h;
        const label = w + ":" + h;
        
        // मुख्य फंक्शन को कॉल करें
        window.selectRatio(ratio, label, null);
        
        // मोडल बंद करें
        window.hideRatioModal();
        
        // इनपुट साफ करें
        document.getElementById('custom-w').value = '';
        document.getElementById('custom-h').value = '';
    } else {
        alert("कृपया सही Width और Height डालें");
    }
}

// इसे ग्लोबल बनाएं ताकि HTML बटन इसे देख सके
window.applyCustomRatio = applyCustomRatio;
