const canvas = document.getElementById('main-canvas'), ctx = canvas.getContext('2d');
const video = document.createElement('video');
const container = document.getElementById('canvas-container'), wrapper = document.getElementById('preview-wrapper');

let isPlaying = false, scale = 1, offsetX = 0, offsetY = 0;
let isDragging = false, lastX = 0, lastY = 0, initialDist = 0;
window.currentRatio = 9/16; 

video.setAttribute('playsinline', '');

function setAspectRatio() {
    if (!wrapper) return;
    const maxW = wrapper.clientWidth - 40, maxH = wrapper.clientHeight - 40;
    canvas.width = 1080; canvas.height = 1080 / window.currentRatio;
    let dw, dh;
    if (maxW / window.currentRatio <= maxH) { dw = maxW; dh = maxW / window.currentRatio; } 
    else { dh = maxH; dw = maxH * window.currentRatio; }
    container.style.width = dw + 'px'; container.style.height = dh + 'px';
    render();
}

function render() {
    if(video.readyState >= 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dw = video.videoWidth * scale, dh = video.videoHeight * scale;
        ctx.save();
        ctx.translate(canvas.width/2 + offsetX, canvas.height/2 + offsetY);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(video, -dw/2, -dh/2, dw, dh);
        ctx.restore();
        if (window.updateSync) window.updateSync();
    }
    if(isPlaying) requestAnimationFrame(render);
}

// फ्री मूव और ज़ूम कंट्रोल
container.ontouchstart = (e) => {
    if (e.touches.length === 1) {
        isDragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        initialDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
    }
};

container.ontouchmove = (e) => {
    if (isDragging && e.touches.length === 1) {
        offsetX += (e.touches[0].clientX - lastX);
        offsetY += (e.touches[0].clientY - lastY);
        lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
        render();
    } else if (e.touches.length === 2) {
        const currentDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        scale *= (currentDist / initialDist);
        initialDist = currentDist;
        render();
    }
};

container.ontouchend = () => { isDragging = false; };

// ग्लोबल फंक्शन्स एक्सपोर्ट करें
window.video = video; window.render = render; window.setAspectRatio = setAspectRatio;
window.isPlaying = isPlaying;
