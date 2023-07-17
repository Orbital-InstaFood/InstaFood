import { doc, updateDoc, arrayRemove, arrayUnion} from "firebase/firestore";
import { auth, db } from "../../firebaseConf";

/**
 * This function saves or unsaves a post for the current user
 * It is isolated from a post component 
 * since saving or unsaving a post makes changes to the user document
 * instead of the post document
 * 
 * @param {string} postID - the ID of the post to be saved or unsaved
 * @param {boolean} isSaved - whether the post is saved or unsaved by the user. It must be updated to the opposite value
 */
export default function saveOrUnsaveAPost (postID, isSaved) {
    const userOwnRef = doc(db, 'users', auth.currentUser.uid);
    if (isSaved) {
        updateDoc(userOwnRef, {
            savedPosts: arrayUnion(postID)
        });
    } else {
        updateDoc(userOwnRef, {
            savedPosts: arrayRemove(postID)
        });
    }
}