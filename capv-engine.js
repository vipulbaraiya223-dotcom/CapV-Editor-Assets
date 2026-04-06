const canvas = document.getElementById('main-canvas'), ctx = canvas.getContext('2d');
const video = document.createElement('video');
const container = document.getElementById('canvas-container'), wrapper = document.getElementById('preview-wrapper');
const vGuide = document.getElementById('v-guide'), hGuide = document.getElementById('h-guide');

let isPlaying = false, scale = 1, offsetX = 0, offsetY = 0;
let isDragging = false, lastX = 0, lastY = 0;
let currentRatio = 9/16;
const snapThreshold = 25;

video.setAttribute('playsinline', '');

function setAspectRatio() {
    const maxW = wrapper.clientWidth - 40, maxH = wrapper.clientHeight - 40;
    canvas.width = 1920; canvas.height = 1920 / currentRatio;
    let dw, dh;
    if (maxW / currentRatio <= maxH) { dw = maxW; dh = maxW / currentRatio; } 
    else { dh = maxH; dw = maxH * currentRatio; }
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
        if (typeof updateSync === "function") updateSync();
    }
    if(isPlaying) requestAnimationFrame(render);
}

// Global functions for UI to call
window.setAspectRatio = setAspectRatio;
window.render = render;
window.video = video; // Export video for UI logic
