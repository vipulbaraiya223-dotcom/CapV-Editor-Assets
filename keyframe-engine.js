/**
 * CAP-V Keyframe Engine
 * फीचर्स: Property Interpolation, Frame-accurate animation
 * स्टाइल: Alight Motion inspired ◆+ logic
 */

const KeyframeEngine = {
    // डेटा स्ट्रक्चर: { "layerId": { "property": [{time: 0, value: 100}, {time: 2, value: 200}] } }
    keyframes: {},

    /**
     * कीफ़्रेम जोड़ें या अपडेट करें
     * @param {string} layerId - लेयर की ID (जैसे 'main-video')
     * @param {string} property - प्रॉपर्टी का नाम ('x', 'y', 'scale', 'opacity')
     * @param {number} time - वह समय जहाँ ◆ बटन दबाया गया (seconds में)
     * @param {number} value - उस समय पर प्रॉपर्टी की वैल्यू
     */
    addKeyframe(layerId, property, time, value) {
        if (!this.keyframes[layerId]) this.keyframes[layerId] = {};
        if (!this.keyframes[layerId][property]) this.keyframes[layerId][property] = [];

        const propFrames = this.keyframes[layerId][property];
        
        // चेक करें कि क्या इस समय पर पहले से कोई कीफ़्रेम है?
        const existingIndex = propFrames.findIndex(f => Math.abs(f.time - time) < 0.01);

        if (existingIndex > -1) {
            propFrames[existingIndex].value = value; // अपडेट करें
        } else {
            propFrames.push({ time, value });
            // समय के हिसाब से कीफ़्रेम्स को सॉर्ट करें
            propFrames.sort((a, b) => a.time - b.time);
        }
        console.log(`Keyframe added: ${property} at ${time}s`);
    },

    /**
     * वर्तमान समय के लिए वैल्यू कैलकुलेट करना (Interpolation)
     */
    getValueAtTime(layerId, property, currentTime) {
        if (!this.keyframes[layerId] || !this.keyframes[layerId][property]) return null;

        const frames = this.keyframes[layerId][property];

        // 1. अगर कोई कीफ़्रेम नहीं है
        if (frames.length === 0) return null;

        // 2. अगर वर्तमान समय पहले कीफ़्रेम से भी पहले है
        if (currentTime <= frames[0].time) return frames[0].value;

        // 3. अगर वर्तमान समय आखिरी कीफ़्रेम के बाद है
        if (currentTime >= frames[frames.length - 1].time) return frames[frames.length - 1].value;

        // 4. बीच के कीफ़्रेम्स ढूंढें (Interpolation)
        for (let i = 0; i < frames.length - 1; i++) {
            const start = frames[i];
            const end = frames[i + 1];

            if (currentTime >= start.time && currentTime <= end.time) {
                // लीनियर इंटरपोलेशन (Linear Interpolation) फॉर्मूला
                // t = (current - start) / (end - start)
                const t = (currentTime - start.time) / (end.time - start.time);
                
                // वैल्यू = start + t * (end - start)
                return start.value + t * (end.value - start.value);
            }
        }
    },

    /**
     * कीफ़्रेम डिलीट करना
     */
    removeKeyframe(layerId, property, time) {
        if (this.keyframes[layerId] && this.keyframes[layerId][property]) {
            this.keyframes[layerId][property] = this.keyframes[layerId][property]
                .filter(f => Math.abs(f.time - time) > 0.01);
        }
    }
};

// ग्लोबल एक्सेस के लिए
window.KeyframeEngine = KeyframeEngine;
