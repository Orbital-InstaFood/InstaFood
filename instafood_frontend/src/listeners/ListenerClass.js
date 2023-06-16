import { onSnapshot, getDoc } from 'firebase/firestore';

/**
 * This class is responsible for creating listeners and managing subscriptions to fields in documents.
 * Use the ListenerImplementer class to maintain a single instance of this class. Do not initialize this class directly.
 * 
 * @class Listener
 * @param {DocumentReference} ref - A reference to the document to listen to
 * 
 * @method startSnapshotListener - Starts listening to the document. This method must be called before any other methods.
 * @method getCurrentDocument - Returns the current document. Returns null if the document does not exist.
 * @method stopSnapshotListener - Stops listening to the document.
 * @method subscribeToField - Subscribes to a field in the document. The callback is called whenever the field changes.
 */
class Listener {
    constructor(ref) {
        this.ref = ref;
        this.document = null;
        this.fieldSubscriptions = {};
        this.unsubscribeFromListener = null;
    }

    async startSnapshotListener() {
        // Read the document once to initialize the property
        const snapshot = await getDoc(this.ref);
        if (!snapshot.exists()) {
            throw new Error("Document does not exist");
        } else {
            this.document = snapshot.data();
            this.unsubscribeFromListener = onSnapshot(this.ref, (latestSnapshot) => {
                this.document = latestSnapshot.data();
                this._notifySubscribers();
            });
        }
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
            this._unsubscribeFromField(field, callback);
        }
    }

    /**
     * This method is called whenever the document changes to trigger the callbacks.
     * @private
     */
    _notifySubscribers() {
        for (const field in this.fieldSubscriptions) {
            const callbacksBySubscribers = this.fieldSubscriptions[field];
            for (const callback of callbacksBySubscribers) {
                callback(this.document[field]);
            }
        }
    }

    /**
     * This method is called when a subscriber unsubscribes from a field.
     * Do not call this method directly. Use the return value of subscribeToField() instead.
     * @private
     */
    _unsubscribeFromField(field, callback) {
        const callbacksBySubscribers = this.fieldSubscriptions[field];
        const index = callbacksBySubscribers.indexOf(callback);
        this.fieldSubscriptions[field].splice(index, 1);
    }
}

export default Listener;