/**
 * CAP-V Action Bar Module
 * फीचर्स: CapCut स्टाइल टूल्स, Alight Motion ◆+ की-फ्रेम बटन
 */

const ActionBar = {
    container: document.getElementById('action-bar'),
    
    init() {
        this.renderMainBar();
    },

    /**
     * मुख्य टूलबार रेंडर करना (CapCut स्टाइल)
     */
    renderMainBar() {
        const tools = [
            { id: 'edit', label: 'Edit', icon: '✂️' },
            { id: 'audio', label: 'Audio', icon: '🎵' },
            { id: 'text', label: 'Text', icon: 'T' },
            { id: 'overlay', label: 'Overlay', icon: '🖼️' },
            { id: 'effects', label: 'Effects', icon: '✨' },
            { id: 'ratio', label: 'Ratio', icon: '📱' }
        ];

        let html = `<div class="action-scroll-wrapper">`;
        tools.forEach(tool => {
            html += `
                <div class="action-item" onclick="ActionBar.handleTool('${tool.id}')">
                    <div class="action-icon">${tool.icon}</div>
                    <div class="action-label">${tool.label}</div>
                </div>`;
        });
        html += `</div>`;
        
        // Alight Motion स्टाइल की-फ्रेम बटन (सेंटर में या राइट में)
        html += `
            <div class="special-tools">
                <button id="keyframe-btn" class="kf-btn" onclick="ActionBar.toggleKeyframe()">
                    <span class="kf-icon">◆</span><span class="kf-plus">+</span>
                </button>
            </div>`;

        this.container.innerHTML = html;
    },

    /**
     * टूल क्लिक हैंडलर
     */
    handleTool(id) {
        console.log("Tool Clicked:", id);
        
        switch(id) {
            case 'edit':
                this.renderSubBar('edit');
                break;
            case 'ratio':
                if(window.UI) window.UI.toggleRatio();
                break;
            case 'effects':
                if(window.UI) window.UI.openPanel('filters');
                break;
            default:
                if(window.UI) window.UI.showToast(`${id} coming soon!`);
        }
    },

    /**
     * की-फ्रेम (◆+) बटन का लॉजिक
     */
    toggleKeyframe() {
        if (!window.Engine || !window.KeyframeEngine) return;
        
        const currentTime = window.Engine.video.currentTime;
        // अभी हम सिर्फ 'main-layer' की 'scale' पर ट्रायल कर रहे हैं
        const currentScale = 1.0; // यहाँ वास्तविक वर्तमान वैल्यू आएगी
        
        window.KeyframeEngine.addKeyframe('main-layer', 'scale', currentTime, currentScale);
        
        if (window.UI) {
            window.UI.showToast("Keyframe Added ◆");
        }
        
        // बटन को एक्टिव दिखाएँ
        const btn = document.getElementById('keyframe-btn');
        btn.classList.add('kf-active');
        setTimeout(() => btn.classList.remove('kf-active'), 300);
    },

    /**
     * सब-मेनू बार (जैसे Edit दबाने पर Split, Speed दिखना)
     */
    renderSubBar(category) {
        // यहाँ हम CapCut जैसा "Back" बटन और स्पेसिफिक टूल्स दिखाएंगे
        if (category === 'edit') {
            const subTools = [
                { id: 'back', label: 'Back', icon: '⬅️' },
                { id: 'split', label: 'Split', icon: '📂' },
                { id: 'speed', label: 'Speed', icon: '⏲️' },
                { id: 'volume', label: 'Volume', icon: '🔊' }
            ];
            // रेंडरिंग लॉजिक...
        }
    }
};

// इनिशियलाइज
ActionBar.init();
