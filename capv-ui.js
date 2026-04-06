const playBtn = document.getElementById('play-btn-large');
const playhead = document.getElementById('playhead'), trackContainer = document.getElementById('track-container');
const ratioModal = document.getElementById('ratio-modal-container');
const PTS_PER_SEC = 30;

// वीडियो को मोबाइल के लिए तैयार करना
window.video.muted = true; 
window.video.setAttribute('webkit-playsinline', 'true');
window.video.setAttribute('playsinline', 'true');

function handleFileUpload(e) {
    const file = e.target.files[0]; 
    if(!file) return;

    // पुराना डाटा साफ़ करें
    if(window.video.src) URL.revokeObjectURL(window.video.src);
    
    const url = URL.createObjectURL(file);
    window.video.src = url;
    
    // वीडियो को "जगाना" (Force Load)
    window.video.load();

    window.video.onloadedmetadata = function() {
        const w = window.video.duration * PTS_PER_SEC;
        if(trackContainer) {
            trackContainer.innerHTML = `<div class="video-track-clip" style="width:${w}px; background:rgba(251,191,36,0.3); border:1px solid #fbbf24; height:40px; display:flex; align-items:center; padding:0 10px; color:#fff; font-size:10px;">${file.name}</div>`;
        }
        
        if(window.setAspectRatio) window.setAspectRatio();
        
        // वीडियो को 0.1 सेकंड पर ले जाएं ताकि पहला फ्रेम दिखे
        window.video.currentTime = 0.1;
    };

    window.video.oncanplay = () => {
        if(window.render) window.render();
    };
    
    // अगर वीडियो अटक जाए तो यह उसे खींच कर लाएगा
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
        // मोबाइल पर अनम्यूट करके चलाना
        window.video.muted = false; 
        window.video.play().then(() => { 
            window.isPlaying = true; 
            if(playBtn) playBtn.innerHTML = '⏸'; 
            if(window.render) window.render(); 
        }).catch(err => {
            console.log("Play failed:", err);
            // अगर एरर आए तो म्यूट करके फिर से कोशिश करें
            window.video.muted = true;
            window.video.play();
        }); 
    }
}

// बाकी फंक्शन वैसे ही रहेंगे
window.handleFileUpload = handleFileUpload;
window.importFile = () => document.getElementById('file-input').click();
window.togglePlayback = togglePlayback;
window.toggleRatioModal = (e) => {
    if(e) e.stopPropagation();
    ratioModal.style.display = (ratioModal.style.display === 'block') ? 'none' : 'block';
};
window.selectRatio = (r, label) => {
    window.currentRatio = r;
    document.getElementById('current-ratio-text').innerText = label + ' ▼';
    window.setAspectRatio();
    ratioModal.style.display = 'none';
};
window.updateSync = () => {
    if(playhead) playhead.style.left = (window.video.currentTime * PTS_PER_SEC) + 'px';
};
