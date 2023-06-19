import { FieldValue, doc, updateDoc, arrayRemove, arrayUnion} from "firebase/firestore";
import { auth, db } from "../../firebaseConf";

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