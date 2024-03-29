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
 * @method getEventDocListener - Returns a listener for the event document.
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

        if (this.listeners[listenerKey] === undefined) {
            const listener = new Listener(docRef);
            await listener.startSnapshotListener();
            this.listeners[listenerKey] = listener;
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

    /**
     * @returns {Listener} - A listener for the list of public user IDs document
     */
    async getPublicUsersListener() {
        const publicUsersRef = doc(db, "lists", "publicUsers");
        return this._getListener(publicUsersRef);
    }

    /**
     * @returns {Listener} - A listener for the list of public user IDs document
     */
    async getCategoriesListener() {
        const categoriesRef = doc(db, "lists", "categories");
        return this._getListener(categoriesRef);
    }
    /**
     * @returns {Listener} - A listener for the list of post categories
     */
    async getCategorisedPostsListener(category) {
        const categorisedPostsRef = doc(db, "categorisedPosts", category);
        return this._getListener(categorisedPostsRef);
    }

    /**
     * @returns {Listener} - A listener for the event IDs document
     */ 
    async getEventDocListener(eventID) {
        const eventRef = doc(db, "events", eventID);
        return this._getListener(eventRef);
    }
    async getIngredientsListener() {
        const ingredientsRef = doc(db, "lists", "Ingredients");
        return this._getListener(ingredientsRef);
    }

    async getIngredientPostsListener(ingredient) {
        const ingredientPostsRef = doc(db, "ingredientPosts", ingredient);
        return this._getListener(ingredientPostsRef);
    }
}

const listenerImplementer = new ListenerImplementer();
export default listenerImplementer;
