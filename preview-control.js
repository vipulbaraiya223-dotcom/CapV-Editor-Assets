// --- preview-control.js ---
const PreviewControl = {
    // प्रिव्यू रेंडर करने का फंक्शन
    render() {
        if (window.video.readyState < 2) return;

        const canvas = window.canvas;
        const ctx = window.ctx;
        const video = window.video;

        const vRatio = video.videoWidth / video.videoHeight;
        let bw = canvas.width;
        let bh = canvas.width / vRatio;

        // अगर वीडियो की हाइट कैनवास से कम है, तो हाइट को मैच करें
        if (bh < canvas.height) {
            bh = canvas.height;
            bw = bh * vRatio;
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // वीडियो को कैनवास के सेंटर में ड्रा करना
        ctx.drawImage(
            video, 
            (canvas.width - bw) / 2, 
            (canvas.height - bh) / 2, 
            bw, 
            bh
        );
    },

    // एस्पेक्ट रेशियो (Ratio) और साइजिंग कंट्रोल
    setAspectRatio(ratio) {
        window.currentRatio = ratio;
        const wrapper = document.getElementById('preview-wrapper');
        const container = document.getElementById('canvas-container');
        if (!wrapper || !container) return;

        const maxW = wrapper.clientWidth - 40;
        const maxH = wrapper.clientHeight - 40;

        // कैनवास की इंटरनल रेजोल्यूशन सेट करना
        if (window.currentRatio >= 1) {
            window.canvas.height = 480;
            window.canvas.width = 480 * window.currentRatio;
        } else {
            window.canvas.width = 480;
            window.canvas.height = 480 / window.currentRatio;
        }

        // स्क्रीन पर दिखने वाली साइज (Scaling) का कैलकुलेशन
        let dw, dh;
        if (maxW / window.currentRatio <= maxH) {
            dw = maxW;
            dh = maxW / window.currentRatio;
        } else {
            dh = maxH;
            dw = maxH * window.currentRatio;
        }

        container.style.width = dw + 'px';
        container.style.height = dh + 'px';

        this.render(); // रेशियो बदलने के बाद तुरंत रेंडर करें
    },

    // प्ले/पॉज कंट्रोल
    togglePlayback() {
        const pBtn = document.getElementById('play-btn-large');
        if (window.video.paused && window.video.src) {
            window.video.play();
            window.isPlaying = true;
            if (pBtn) pBtn.innerHTML = '⏸';
            // प्लेबैक के दौरान सिंकिंग शुरू करना (App.js के माध्यम से)
            if (typeof App !== 'undefined' && App.syncTimeline) {
                requestAnimationFrame(() => App.syncTimeline());
            }
        } else {
            window.video.pause();
            window.isPlaying = false;
            if (pBtn) pBtn.innerHTML = '▶';
        }
    }
};

// वीडियो 'seek' होने पर प्रिव्यू अपडेट करें
window.video.addEventListener('seeked', () => PreviewControl.render());
          // --- preview-control.js (Updated with Pan/Zoom) ---
const PreviewControl = {
    scale: 1,
    posX: 0,
    posY: 0,

    render() {
        if (window.video.readyState < 2) return;
        const { canvas, ctx, video } = window;
        const vRatio = video.videoWidth / video.videoHeight;
        
        let bw = canvas.width, bh = canvas.width / vRatio;
        if (bh < canvas.height) { bh = canvas.height; bw = bh * vRatio; }

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, (canvas.width - bw)/2, (canvas.height - bh)/2, bw, bh);
    },

    setAspectRatio(ratio) {
        window.currentRatio = ratio;
        const wrapper = document.getElementById('preview-wrapper');
        const container = document.getElementById('canvas-container');
        
        const maxW = wrapper.clientWidth - 40;
        const maxH = wrapper.clientHeight - 40;

        // इंटरनल साइज फिक्स करना
        if (ratio >= 1) {
            window.canvas.height = 480; window.canvas.width = 480 * ratio;
        } else {
            window.canvas.width = 480; window.canvas.height = 480 / ratio;
        }

        let dw, dh;
        if (maxW / ratio <= maxH) { dw = maxW; dh = maxW / ratio; } 
        else { dh = maxH; dw = maxH * ratio; }

        container.style.width = dw + 'px';
        container.style.height = dh + 'px';
        
        // ज़ूम और पोजीशन को रीसेट करना
        this.resetTransform();
    },

    // ज़ूम और फ्री मूव अप्लाई करना
    applyTransform() {
        const container = document.getElementById('canvas-container');
        container.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${this.scale})`;
    },

    resetTransform() {
        this.scale = 1; this.posX = 0; this.posY = 0;
        this.applyTransform();
        this.render();
    }
};
                                
