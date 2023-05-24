import { auth, db } from '../firebaseConf';
import { doc, getDoc } from 'firebase/firestore';

async function getUserDoc() {
    const user = auth.currentUser;

    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        return snapshot;
    }
    return null;
}

export default getUserDoc;