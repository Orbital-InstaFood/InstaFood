import Listener from "./ListenerClass";
import { doc } from "firebase/firestore";
import { db, auth } from "../firebaseConf";

class ListenerImplementer {

    constructor() {
        this.userDocListener = null;
        this.listOfUserIDsListener = null;
    }

    async getPostListener(postID) {
        const postRef = doc(db, 'posts', postID);
        const postListener = new Listener(postRef);
        await postListener.startSnapshotListener()
            .catch((error) => {
                console.log("Error starting post listener: ", error);
                this.postListener = null;
            });
        return postListener;
    }

    async getUserDocListener() {
        if (!this.userDocListener) {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            const userDocListener = new Listener(userRef);
            await userDocListener.startSnapshotListener()
            this.userDocListener = userDocListener;
        }
        return this.userDocListener;
    }

    async getListOfUserIDsListener() {
        if (!this.listOfUserIDsListener) {
            const userIDsRef = doc(db, "lists", "userIDs");
            const listOfUserIDsListener = new Listener(userIDsRef);
            await listOfUserIDsListener.startSnapshotListener();
            this.listOfUserIDsListener = listOfUserIDsListener;
        }
        return this.listOfUserIDsListener;
    }
}

const listenerImplementer = new ListenerImplementer();
export default listenerImplementer;