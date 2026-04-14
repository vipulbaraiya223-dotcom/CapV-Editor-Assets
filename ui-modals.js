// --- ui-modals.js ---
const UIModals = {
    // 1. सभी राशियों की लिस्ट (जोड़ी गई)
    ratios: [
        { label: "9:16", value: 9/16 },
        { label: "16:9", value: 16/9 },
        { label: "1:1", value: 1/1 },
        { label: "4:5", value: 4/5 },
        { label: "2:3", value: 2/3 },
        { label: "21:9", value: 21/9 }
    ],

    // रेशियो मोडल को खोलने या बंद करने का फंक्शन
    toggleRatioModal() {
        const m = document.getElementById('ratio-modal-container');
        if (m) {
            m.style.display = (m.style.display === 'block') ? 'none' : 'block';
        }
    },

    // प्री-सेट रेशियो चुनने के लिए
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

    // कस्टम रेशियो अप्लाई करना
    applyCustomRatio() {
        const w = parseFloat(document.getElementById('custom-w').value);
        const h = parseFloat(document.getElementById('custom-h').value);
        
        if (w > 0 && h > 0) {
            this.selectRatio(w / h, `${w}:${h}`);
        } else {
            alert("कृपया वैध नंबर डालें");
        }
    },

    // फाइल इम्पोर्ट बटन के लिए
    importFile() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.click();
    },

    // फाइल अपलोड होने के बाद का लॉजिक (जैसा था वैसा ही)
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        window.video.src = URL.createObjectURL(file);
        
        window.video.onloadedmetadata = () => {
            if (typeof PreviewControl !== 'undefined') {
                PreviewControl.setAspectRatio(window.currentRatio || 9/16);
            }
            
            const trackContainer = document.getElementById('track-container');
            if (trackContainer && typeof Timeline !== 'undefined') {
                const trackWidth = window.video.duration * Timeline.PIXELS_PER_SEC;
                trackContainer.innerHTML = `
                    <div class="video-track-clip" style="width:${trackWidth}px">
                        ${file.name}
                    </div>`;
                
                Timeline.drawRuler(0);
            }
            
            if (typeof PreviewControl !== 'undefined') {
                PreviewControl.render();
            }
        };
    }
};

// ग्लोबल फंक्शन्स (ताकि HTML के onclick से सीधे कॉल हो सकें)
window.toggleRatioModal = () => UIModals.toggleRatioModal();
window.selectRatio = (r, l) => UIModals.selectRatio(r, l);
window.applyCustomRatio = () => UIModals.applyCustomRatio();
window.importFile = () => UIModals.importFile();
window.handleFileUpload = (e) => UIModals.handleFileUpload(e);
