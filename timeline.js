// --- Timeline.js ---
const Timeline = {
    POINTS_PER_SEC: 60,
    PIXELS_PER_POINT: 6,
    PIXELS_PER_SEC: 360, // 60 * 6
    isSnapping: false,
    scrollTimeout: null,

    // रूलर ड्राइंग (एक्टिव पॉइंट हाईलाइट के साथ)
    drawRuler(activeX = -1) {
        const rCanvas = document.getElementById('ruler-canvas');
        if (!rCanvas) return;
        const rCtx = rCanvas.getContext('2d');
        const duration = window.video.duration || 30; 
        const totalWidth = duration * this.PIXELS_PER_SEC;
        
        rCanvas.width = totalWidth; 
        rCanvas.height = 40;
        rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);
        
        rCtx.font = "10px Arial";
        rCtx.fillStyle = "#888";

        for (let x = 0; x <= totalWidth; x += this.PIXELS_PER_POINT) {
            const pointIndex = Math.round(x / this.PIXELS_PER_POINT);
            const isSecond = pointIndex % 60 === 0;
            const isHalfSec = pointIndex % 15 === 0 && !isSecond;

            // चेक करें कि क्या यह पॉइंट प्लेहेड के सबसे करीब है
            const distance = Math.abs(x - activeX);
            const isActive = distance <= (this.PIXELS_PER_POINT / 2);

            rCtx.beginPath();
            // अगर एक्टिव है तो कलर पीला, नहीं तो डार्क ग्रे
            rCtx.strokeStyle = isActive ? '#fbbf24' : '#444';
            rCtx.lineWidth = isActive ? 2 : 1; 

            if (isSecond) {
                rCtx.moveTo(x, isActive ? 2 : 5); rCtx.lineTo(x, 35);
                rCtx.fillStyle = isActive ? "#fbbf24" : "#888";
                rCtx.fillText(Math.floor(pointIndex/60) + "s", x + 4, 15);
            } else if (isHalfSec) {
                rCtx.moveTo(x, isActive ? 10 : 15); rCtx.lineTo(x, 35);
            } else {
                rCtx.moveTo(x, isActive ? 20 : 25); rCtx.lineTo(x, 35);
            }
            rCtx.stroke();
        }
    },

    // टाइम लेबल अपडेट करना (00:00:00:00 फॉर्मेट)
    updateTimeLabel(t) {
        if (isNaN(t) || t < 0) t = 0;
        const timeDisplay = document.getElementById('time-display');
        const m = Math.floor(t / 60).toString().padStart(2, '0');
        const s = Math.floor(t % 60).toString().padStart(2, '0');
        const f = Math.floor((t % 1) * 60).toString().padStart(2, '0');
        if (timeDisplay) {
            timeDisplay.innerText = `00:${m}:${s}:${f}`;
        }
    }
};
