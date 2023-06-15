import { onSnapshot, getDoc } from 'firebase/firestore';

class Listener {
    constructor(ref) {
        this.ref = ref;
        this.document = null;
        this.loading = true;
        this.fieldSubscriptions = {};
        this.unsubscribeFromListener = null;
    }

    async startSnapshotListener() {
        // Read the document once to initialize the property
        const snapshot = await getDoc(this.ref);
        this.document = snapshot.data();
        this.loading = false;

        this.unsubscribeFromListener = onSnapshot(this.ref, (latestSnapshot) => {
            this.document = latestSnapshot.data();
            this.notifySubscribers();
        });
    }

    getCurrentDocument() {
        return this.document;
    }

    stopSnapshotListener() {
        this.unsubscribeFromListener();
    }


    subscribeToField(field, callback) {
        if (!this.fieldSubscriptions[field]) {
            this.fieldSubscriptions[field] = [];
        }
        this.fieldSubscriptions[field].push(callback);

        // Call the callback immediately with the current value
        const currentValue = this.document[field];
        callback(currentValue);

        return () => {
            this.unsubscribeFromField(field, callback);
        }

    }

    notifySubscribers() {
        for (const field in this.fieldSubscriptions) {
            const callbacksBySubscribers = this.fieldSubscriptions[field];
            for (const callback of callbacksBySubscribers) {
                callback(this.document[field]);
            }
        }
    }

    unsubscribeFromField(field, callback) {
        const callbacksBySubscribers = this.fieldSubscriptions[field];
        const index = callbacksBySubscribers.indexOf(callback);
        this.fieldSubscriptions[field].splice(index, 1);
    }
}

export default Listener;