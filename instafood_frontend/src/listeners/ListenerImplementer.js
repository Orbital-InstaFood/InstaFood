import Listener from "./ListenerClass";
import { doc } from "firebase/firestore";
import { db, auth } from "../firebaseConf";

/**
 * This class is responsible for creating and managing listeners.
 * The main purpose of this class is to prevent multiple listeners from being created for the same document
 * This class is a singleton. Only one instance of this class is exported.
 * 
 * @class ListenerImplementer
 * @property {Object} listeners - A dictionary of listeners. The keys are the document IDs and the values are the listeners.
 * 
 * @method getPostListener - Returns a listener for a post document.
 * @method getUserDocListener - Returns a listener for the user document of the current user.
 * @method getListOfUserIDsListener - Returns a listener for the list of user IDs document.
 * 
 */
class ListenerImplementer {
    constructor() {
        this.listeners = {};
    }

    /**
     * @param {DocumentReference} docRef
     * @returns {Listener} - A listener for the document
     */
    async _getListener(docRef) {
        const listenerKey = docRef.id;

        if (!this.listeners[listenerKey]) {
            const listener = new Listener(docRef);

            try {
                await listener.startSnapshotListener();
                this.listeners[listenerKey] = listener;
            } catch (error) {
                this.listeners[listenerKey] = null;
            }
        }

        return this.listeners[listenerKey];
    }

    /**
     * @param {string} postID 
     * @returns {Listener} - A listener for the post document
     */
    async getPostListener(postID) {
        const postRef = doc(db, "posts", postID);
        return this._getListener(postRef);
    }

    /**
     * @returns {Listener} - A listener for the user document of the current user
     */
    async getUserDocListener() {
        const userRef = doc(db, "users", auth.currentUser.uid);
        return this._getListener(userRef);
    }

    /**
     * @returns {Listener} - A listener for the list of user IDs document
     */
    async getListOfUserIDsListener() {
        const userIDsRef = doc(db, "lists", "userIDs");
        return this._getListener(userIDsRef);
    }

    async getPublicUsersListener() {
        const publicUsersRef = doc(db, "lists", "publicUsers");
        return this._getListener(publicUsersRef);
    }
    
}

const listenerImplementer = new ListenerImplementer();
export default listenerImplementer;
