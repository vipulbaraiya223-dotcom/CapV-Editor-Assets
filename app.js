// --- app.js ---
const App = {
    // एडिटर शुरू करने का फंक्शन
    init() {
        // प्रिव्यू और एस्पेक्ट रेशियो सेट करें
        if (typeof PreviewControl !== 'undefined') {
            PreviewControl.setAspectRatio(window.currentRatio || 9/16);
        }

        // टाइमलाइन शुरू करें
        if (typeof Timeline !== 'undefined') {
            Timeline.drawRuler(0);
        }

        // स्क्रॉल और स्नैपिंग इवेंट्स सेटअप करें
        this.setupScrollEvents();
    },
// App.js के अंदर setupScrollEvents के पास इसे डालें
const previewWrapper = document.getElementById('preview-wrapper');
let isDragging = false, startX, startY;

previewWrapper.onmousedown = (e) => {
    if (e.button === 1 || e.ctrlKey) { // मिडिल माउस या Ctrl के साथ ड्रैग
        isDragging = true;
        startX = e.clientX - PreviewControl.posX;
        startY = e.clientY - PreviewControl.posY;
    }
};

window.onmousemove = (e) => {
    if (!isDragging) return;
    PreviewControl.posX = e.clientX - startX;
    PreviewControl.posY = e.clientY - startY;
    PreviewControl.applyTransform();
};

window.onmouseup = () => isDragging = false;

// माउस व्हील से ज़ूम (Zoom)
previewWrapper.onwheel = (e) => {
    e.preventDefault();
    PreviewControl.scale += e.deltaY * -0.001;
    PreviewControl.scale = Math.min(Math.max(.125, PreviewControl.scale), 4); // लिमिट
    PreviewControl.applyTransform();
};


    // टाइमलाइन को प्लेबैक के साथ सिंक करना
    syncTimeline() {
        if (!window.isPlaying) return;

        const scrollArea = document.getElementById('timeline-scroll-area');
        const video = window.video;

        if (scrollArea && video) {
            // वीडियो के समय के हिसाब से स्क्रॉल पोजीशन सेट करना
            scrollArea.scrollLeft = video.currentTime * Timeline.PIXELS_PER_SEC;

            // UI अपडेट (टाइम लेबल और रूलर कलर)
            if (typeof Timeline !== 'undefined') {
                Timeline.updateTimeLabel(video.currentTime);
                Timeline.drawRuler(scrollArea.scrollLeft);
            }

            // प्रिव्यू अपडेट
            if (typeof PreviewControl !== 'undefined') {
                PreviewControl.render();
            }
        }

        // अगले फ्रेम के लिए लूप
        requestAnimationFrame(() => this.syncTimeline());
    },

    // स्क्रबिंग और मैग्नेटिक स्नैपिंग इवेंट्स
    setupScrollEvents() {
        const scrollArea = document.getElementById('timeline-scroll-area');
        if (!scrollArea) return;

        scrollArea.addEventListener('scroll', () => {
            // अगर वीडियो चल रहा है या स्नैपिंग हो रही है, तो कुछ न करें
            if (window.isPlaying || Timeline.isSnapping) return;

            const currX = scrollArea.scrollLeft;
            const seekTime = currX / Timeline.PIXELS_PER_SEC;

            // वीडियो को उस समय पर ले जाएं
            window.video.currentTime = seekTime;

            // तुरंत UI अपडेट करें
            if (typeof Timeline !== 'undefined') {
                Timeline.updateTimeLabel(seekTime);
                Timeline.drawRuler(currX);
            }
            if (typeof PreviewControl !== 'undefined') {
                PreviewControl.render();
            }

            // मैग्नेटिक स्नैपिंग (रुकने के बाद)
            clearTimeout(Timeline.scrollTimeout);
            Timeline.scrollTimeout = setTimeout(() => {
                const snapX = Math.round(currX / Timeline.PIXELS_PER_POINT) * Timeline.PIXELS_PER_POINT;
                
                if (Math.abs(snapX - currX) > 0.5) {
                    Timeline.isSnapping = true;
                    scrollArea.scrollTo({ left: snapX, behavior: 'smooth' });
                    
                    setTimeout(() => {
                        Timeline.isSnapping = false;
                        Timeline.drawRuler(snapX);
                    }, 300);
                }
            }, 150);
        });
    }
};

// जब पूरी विंडो लोड हो जाए तब एडिटर शुरू करें
window.onload = () => App.init();

// प्लेबैक फंक्शन को App के सिंक से जोड़ना (ग्लोबल एक्सेस के लिए)
window.togglePlayback = () => {
    if (typeof PreviewControl !== 'undefined') {
        PreviewControl.togglePlayback();
    }
};
