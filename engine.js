const Engine = {
    init() {
        window.canvas = document.getElementById('main-canvas');
        window.ctx = window.canvas.getContext('2d', { alpha: false });
        window.video = document.createElement('video');
        window.video.muted = true;
        window.video.playsInline = true;
        
        window.video.addEventListener('seeked', () => this.render());
    },
    render() {
        if (window.video.readyState < 2) return;
        const vRatio = window.video.videoWidth / window.video.videoHeight;
        let bw = window.canvas.width, bh = window.canvas.width / vRatio;
        if (bh < window.canvas.height) { bh = window.canvas.height; bw = bh * vRatio; }
        window.ctx.fillStyle = "#000";
        window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        window.ctx.drawImage(window.video, (window.canvas.width - bw)/2, (window.canvas.height - bh)/2, bw, bh);
    }
};
Engine.init();
