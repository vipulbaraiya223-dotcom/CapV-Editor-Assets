/**
 * CAP-V History Manager
 * फीचर्स: Undo, Redo (Action Tracking)
 */

const History = {
    undoStack: [],
    redoStack: [],
    maxHistory: 50,

    // कोई भी एक्शन होने पर इसे कॉल करें
    saveState(actionType, data) {
        const state = { type: actionType, data: JSON.parse(JSON.stringify(data)), time: Date.now() };
        this.undoStack.push(state);
        
        if (this.undoStack.length > this.maxHistory) {
            this.undoStack.shift(); // पुरानी हिस्ट्री डिलीट करें
        }
        this.redoStack = []; // नया काम करने पर रेडू स्टैक साफ़
        console.log("State Saved:", actionType);
    },

    undo() {
        if (this.undoStack.length <= 1) return;
        const currentState = this.undoStack.pop();
        this.redoStack.push(currentState);
        
        const previousState = this.undoStack[this.undoStack.length - 1];
        this.applyState(previousState);
    },

    redo() {
        if (this.redoStack.length === 0) return;
        const state = this.redoStack.pop();
        this.undoStack.push(state);
        this.applyState(state);
    },

    applyState(state) {
        // यहाँ हम तय करेंगे कि पिछले स्टेट को वापस कैसे लाना है
        console.log("Applying State:", state.type);
        // उदाहरण: if(state.type === 'filter') applyFilter(state.data);
    }
};
