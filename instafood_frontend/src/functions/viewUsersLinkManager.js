class viewUsersLinkManager {
    constructor() {
        this.userID = null;
        this.subscriptions = [];
    }

    updateUserID(userID) {
        if (this.userID === userID) {
            return;
        }
        
        this.userID = userID;
        this._notifySubscribers();
    }

    subscribeToUserID(callback) {
        // Call the callback immediately with the current value
        callback(this.userID);

        this.subscriptions.push(callback);

        return () => {
            this._unsubscribeFromUserID(callback);
        }
    }

    _notifySubscribers() {
        for (const callback of this.subscriptions) {
            callback(this.userID);
        }
    }

    _unsubscribeFromUserID(callback) {
        const index = this.subscriptions.indexOf(callback);
        if (index > -1) {
            this.subscriptions.splice(index, 1);
        }
    }

}

const viewUsersLinkManagerInstance = new viewUsersLinkManager();
export default viewUsersLinkManagerInstance;