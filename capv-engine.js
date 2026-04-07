const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const video = document.createElement('video');
const container = document.getElementById('canvas-container');
const wrapper = document.getElementById('preview-wrapper');

let isPlaying = false, scale = 1, offsetX = 0, offsetY = 0;
let isDragging = false, lastX = 0, lastY = 0, initialDist = 0;
window.currentRatio = 9/16; // ग्लोबल वेरिएबल

video.setAttribute('playsinline', 'true');
video.setAttribute('webkit-playsinline', 'true');
video.muted = true;

function setAspectRatio() {
    if (!wrapper || !container) return;
    const maxW = wrapper.clientWidth - 40;
    const maxH = wrapper.clientHeight - 40;
    
    // Canvas की क्वालिटी सेट करें
    canvas.width = 1080; 
    canvas.height = 1080 / window.currentRatio;
    
    let dw, dh;
    if (maxW / window.currentRatio <= maxH) {
        dw = maxW; dh = maxW / window.currentRatio;
    } else {
        dh = maxH; dw = maxH * window.currentRatio;
    }
    
    container.style.width = dw + 'px';
    container.style.height = dh + 'px';
    
    // फ्रेम दिखने के लिए तुरंत रेंडर करें
    render();
}

function render() {
    if (!ctx) return;
    ctx.fillStyle = "#111"; // डिफ़ॉल्ट बैकग्राउंड कलर
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (video.readyState >= 2) {
        const dw = video.videoWidth * scale;
        const dh = video.videoHeight * scale;
        
        ctx.save();
        ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
        ctx.drawImage(video, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
    }
    
    if (window.updateSync) window.updateSync();
    if (isPlaying) requestAnimationFrame(render);
}

// टच इवेंट्स (Zoom & Move)
container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        initialDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
    }
}, { passive: false });

container.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
        const rect = container.getBoundingClientRect();
        const factor = canvas.width / rect.width;
        offsetX += (e.touches[0].clientX - lastX) * factor;
        offsetY += (e.touches[0].clientY - lastY) * factor;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        render();
    } else if (e.touches.length === 2) {
        const currentDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        scale *= (currentDist / initialDist);
        initialDist = currentDist;
        render();
    }
}, { passive: false });

container.addEventListener('touchend', () => { isDragging = false; });

window.video = video; 
window.render = render; 
window.setAspectRatio = setAspectRatio;
window.isPlaying = isPlaying;

