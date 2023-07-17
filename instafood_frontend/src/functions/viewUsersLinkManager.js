/**
 * This module is used to manage the user ID that is being viewed.
 * by maintaining a single source of truth for the user ID
 * and notifying all components that are subscribed to the user ID
 * when the user ID is updated.
 * It assumes that only one user ID can be viewed at a time.
 * 
 * It is used by the following components:
 * - DisplayUserLink
 * - ViewOtherUsers
 */
class viewUsersLinkManager {
    constructor() {
        this.userID = null;
        this.subscriptions = [];
    }

    getCurrentUserID() {
        return this.userID;
    }

    updateUserID(userID) {
        if (this.userID === userID) {
            return;
        }
        
        this.userID = userID;
        this._notifySubscribers();
    }

    subscribeToUserID(callback) {
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