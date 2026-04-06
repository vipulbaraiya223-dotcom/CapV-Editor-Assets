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
    // सिर्फ तभी ड्रा करें जब वीडियो तैयार हो या चल रहा हो
    if (video.readyState >= 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dw = video.videoWidth * scale;
        const dh = video.videoHeight * scale;
        
        ctx.save();
        ctx.translate(canvas.width/2 + offsetX, canvas.height/2 + offsetY);
        // Image Smoothing को चालू रखें ताकि रेंडर स्मूथ हो
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(video, -dw/2, -dh/2, dw, dh);
        ctx.restore();
    }
    
    if (isPlaying) {
        requestAnimationFrame(render);
    }
// Global Exports
window.canvas = canvas; window.ctx = ctx; window.video = video;
window.render = render; window.setAspectRatio = setAspectRatio;
window.currentRatio = currentRatio; window.scale = scale;
window.offsetX = offsetX; window.offsetY = offsetY;
window.isPlaying = isPlaying;
