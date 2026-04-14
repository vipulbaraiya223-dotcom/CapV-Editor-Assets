const Engine = {
    init() {
        window.canvas = document.getElementById('main-canvas');
        window.ctx = window.canvas.getContext('2d', { alpha: false });
        
        // वीडियो एलिमेंट सेटअप
        window.video = document.createElement('video');
        window.video.muted = true;
        window.video.playsInline = true;
        window.video.crossOrigin = "anonymous"; // CORS इश्यू से बचने के लिए
        
        // जब भी वीडियो 'seek' (आगे-पीछे) हो, रेंडर करें
        window.video.addEventListener('seeked', () => this.render());
        
        // मोबाइल और ब्राउज़र के लिए: डेटा लोड होते ही रेंडर की कोशिश करें
        window.video.addEventListener('loadeddata', () => {
            console.log("Video data loaded");
            this.render();
        });
    },

    render() {
        // अगर वीडियो अभी तैयार नहीं है, तो रेंडर न करें
        if (!window.video || window.video.readyState < 1) return;

        const canvas = window.canvas;
        const ctx = window.ctx;
        const video = window.video;

        // कैनवास साफ़ करें
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // वीडियो का असली साइज (Width/Height)
        const vWidth = video.videoWidth;
        const vHeight = video.videoHeight;
        
        if (vWidth === 0 || vHeight === 0) return;

        const vRatio = vWidth / vHeight;
        const cRatio = canvas.width / canvas.height;

        let drawW, drawH;

        // 'Contain' फिटिंग लॉजिक (वीडियो पूरा दिखेगा, कटेगा नहीं)
        if (vRatio > cRatio) {
            drawW = canvas.width;
            drawH = canvas.width / vRatio;
        } else {
            drawH = canvas.height;
            drawW = canvas.height * vRatio;
        }

        // सेंटर में ड्रा करना
        const x = (canvas.width - drawW) / 2;
        const y = (canvas.height - drawH) / 2;

        ctx.drawImage(video, x, y, drawW, drawH);
    }
};

// इंजन को शुरू करें
Engine.init();
