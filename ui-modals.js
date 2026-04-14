// --- ui-modals.js ---
const UIModals = {
    ratios: [
        { label: "9:16", value: 9/16 },
        { label: "16:9", value: 16/9 },
        { label: "1:1", value: 1/1 },
        { label: "4:5", value: 4/5 },
        { label: "2:3", value: 2/3 },
        { label: "21:9", value: 21/9 }
    ],

    toggleRatioModal() {
        const m = document.getElementById('ratio-modal-container');
        if (m) {
            m.style.display = (m.style.display === 'block') ? 'none' : 'block';
        }
    },

    selectRatio(r, label) {
        window.currentRatio = r;
        const ratioText = document.getElementById('current-ratio-text');
        if (ratioText) {
            ratioText.innerText = label + ' ▼';
        }
        if (typeof PreviewControl !== 'undefined') {
            PreviewControl.setAspectRatio(r);
        }
        this.toggleRatioModal(); 
    },

    applyCustomRatio() {
        const w = parseFloat(document.getElementById('custom-w').value);
        const h = parseFloat(document.getElementById('custom-h').value);
        if (w > 0 && h > 0) {
            this.selectRatio(w / h, `${w}:${h}`);
        } else {
            alert("कृपया वैध नंबर डालें");
        }
    },

    importFile() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.click();
    },

    // सुधारा गया फाइल अपलोड लॉजिक - इसे ध्यान से देखें
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // 1. पुरानी मेमोरी साफ़ करें
        if (window.video && window.video.src) {
            URL.revokeObjectURL(window.video.src);
        }

        const blobURL = URL.createObjectURL(file);
        
        // 2. वीडियो एलिमेंट को पूरी तरह रिफ्रेश करें
        window.video.pause();
        window.video.src = blobURL;
        window.video.load(); // ब्राउज़र को बताएं कि नया सोर्स है

        window.video.onloadedmetadata = () => {
            // एस्पेक्ट रेशियो सेट करें
            if (typeof PreviewControl !== 'undefined') {
                PreviewControl.setAspectRatio(window.currentRatio || 9/16);
            }
            
            // टाइमलाइन पर विज़ुअल जोड़ें
            const trackContainer = document.getElementById('track-container');
            if (trackContainer && typeof Timeline !== 'undefined') {
                const trackWidth = (window.video.duration || 10) * Timeline.PIXELS_PER_SEC;
                trackContainer.innerHTML = `
                    <div class="video-track-clip" style="width:${trackWidth}px">
                        ${file.name}
                    </div>`;
                Timeline.drawRuler(0);
            }

            // 3. ब्लैक स्क्रीन फिक्स: वीडियो को थोड़ा आगे बढ़ाएं ताकि पहला फ्रेम लोड हो
            window.video.currentTime = 0.1;
        };

        // 4. जैसे ही वीडियो फ्रेम तैयार हो, उसे कैनवास पर दिखाएं
        window.video.onseeked = () => {
            if (typeof PreviewControl !== 'undefined') {
                PreviewControl.render();
            }
        };

        // बैकअप के लिए: अगर seeked न चले तो canplay पर ड्रा करें
        window.video.oncanplay = () => {
            if (typeof PreviewControl !== 'undefined') {
                PreviewControl.render();
            }
        };
    }
};

// ग्लोबल फंक्शन्स
window.toggleRatioModal = () => UIModals.toggleRatioModal();
window.selectRatio = (r, l) => UIModals.selectRatio(r, l);
window.applyCustomRatio = () => UIModals.applyCustomRatio();
window.importFile = () => UIModals.importFile();
window.handleFileUpload = (e) => UIModals.handleFileUpload(e);
