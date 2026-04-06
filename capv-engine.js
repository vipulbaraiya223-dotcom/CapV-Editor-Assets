const canvas = document.getElementById('main-canvas'), ctx = canvas.getContext('2d');
const video = document.createElement('video');
const container = document.getElementById('canvas-container'), wrapper = document.getElementById('preview-wrapper');

let isPlaying = false, scale = 1, offsetX = 0, offsetY = 0;
let isDragging = false, lastX = 0, lastY = 0, initialDist = 0;
window.currentRatio = 9/16; 

video.setAttribute('playsinline', '');
video.setAttribute('webkit-playsinline', 'true');

function setAspectRatio() {
    const maxW = wrapper.clientWidth - 40, maxH = wrapper.clientHeight - 40;
    canvas.width = 1920; canvas.height = 1920 / window.currentRatio;
    let dw, dh;
    if (maxW / window.currentRatio <= maxH) { dw = maxW; dh = maxW / window.currentRatio; } 
    else { dh = maxH; dw = maxH * window.currentRatio; }
    container.style.width = dw + 'px'; container.style.height = dh + 'px';
    render();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(video.readyState >= 2) {
        const dw = video.videoWidth * scale, dh = video.videoHeight * scale;
        ctx.save();
        ctx.translate(canvas.width/2 + offsetX, canvas.height/2 + offsetY);
        ctx.drawImage(video, -dw/2, -dh/2, dw, dh);
        ctx.restore();
        if (window.updateSync) window.updateSync();
    }
    if(isPlaying) requestAnimationFrame(render);
}

// --- फ्री मूव और ज़ूम कोड ---
container.ontouchstart = (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        initialDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
    }
};

container.ontouchmove = (e) => {
    if (isDragging && e.touches.length === 1) {
        offsetX += (e.touches[0].clientX - lastX) * (canvas.width / container.clientWidth);
        offsetY += (e.touches[0].clientY - lastY) * (canvas.height / container.clientHeight);
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        render();
    } else if (e.touches.length === 2) {
        const currentDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        scale *= (currentDist / initialDist);
        initialDist = currentDist;
        render();
    }
};

container.ontouchend = () => { isDragging = false; initialDist = 0; };

window.video = video; window.render = render; window.setAspectRatio = setAspectRatio;
    
