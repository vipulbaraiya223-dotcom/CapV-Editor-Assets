// --- ui-modals.js ---
const UIModals = {
    // 1. सभी राशियों की लिस्ट
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

    // सुधारा गया फाइल अपलोड लॉजिक
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Blob URL बनाएं और वीडियो सोर्स में डालें
        const blobURL = URL.createObjectURL(file);
        window.video.src = blobURL;

        window.video.onloadedmetadata = () => {
            // एस्पेक्ट रेशियो रिफ्रेश करें
            if (typeof PreviewControl !== 'undefined') {
                PreviewControl.setAspectRatio(window.currentRatio || 9/16);
            }
            
            // टाइमलाइन पर क्लिप विज़ुअल जोड़ें
            const trackContainer = document.getElementById('track-container');
            if (trackContainer && typeof Timeline !== 'undefined') {
                const trackWidth = window.video.duration * Timeline.PIXELS_PER_SEC;
                trackContainer.innerHTML = `
                    <div class="video-track-clip" style="width:${trackWidth}px">
                        ${file.name}
                    </div>`;
                
                Timeline.drawRuler(0);
            }

            // काली स्क्रीन दूर करने के लिए वीडियो को 0.1 सेकंड पर ले जाएँ
            window.video.currentTime = 0.1;
        };

        // जब वीडियो 0.1 सेकंड पर पहुँच जाए, तब प्रिव्यू रेंडर करें
        window.video.onseeked = () => {
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
