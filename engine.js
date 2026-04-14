const Engine = {
    init() {
        window.canvas = document.getElementById('main-canvas');
        window.ctx = window.canvas.getContext('2d', { alpha: false });
        window.video = document.createElement('video');
        window.video.muted = true;
        window.video.playsInline = true;
        
        // जब भी वीडियो फ्रेम अपडेट हो, ड्रा करें
        window.video.addEventListener('seeked', () => this.render());
        window.video.addEventListener('loadeddata', () => this.render());
    },
    render() {
        // अगर वीडियो मेटाडेटा लोड नहीं हुआ है, तो रुकें
        if (!window.video || window.video.readyState < 1) return;

        const vWidth = window.video.videoWidth;
        const vHeight = window.video.videoHeight;
        if (vWidth === 0) return;

        const vRatio = vWidth / vHeight;
        const canvas = window.canvas;
        const ctx = window.ctx;

        // कैनवास साइज के हिसाब से फिटिंग लॉजिक
        let bw = canvas.width, bh = canvas.width / vRatio;
        if (bh < canvas.height) { 
            bh = canvas.height; 
            bw = bh * vRatio; 
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(window.video, (canvas.width - bw)/2, (canvas.height - bh)/2, bw, bh);
    }
};
Engine.init();
