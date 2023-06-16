import Listener from "./ListenerClass";
import { doc } from "firebase/firestore";
import { db, auth } from "../firebaseConf";

class ListenerImplementer {
    constructor() {
        this.listeners = {};
    }

    async getListener(docRef) {
        const listenerKey = docRef.id;

        if (!this.listeners[listenerKey]) {
            const listener = new Listener(docRef);

            try {
                await listener.startSnapshotListener();
                this.listeners[listenerKey] = listener;
            } catch (error) {
                console.log(error);
            }
        }

        return this.listeners[listenerKey];
    }

    async getPostListener(postID) {
        const postRef = doc(db, "posts", postID);
        return this.getListener(postRef);
    }

    async getUserDocListener() {
        const userRef = doc(db, "users", auth.currentUser.uid);
        return this.getListener(userRef);
    }

    async getListOfUserIDsListener() {
        const userIDsRef = doc(db, "lists", "userIDs");
        return this.getListener(userIDsRef);
    }
}

const listenerImplementer = new ListenerImplementer();
export default listenerImplementer;
