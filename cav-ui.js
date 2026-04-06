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

// Initialization
window.onload = () => {
    // Create Ruler logic here
    window.setAspectRatio();
};
