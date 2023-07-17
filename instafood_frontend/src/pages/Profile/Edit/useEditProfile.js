import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../../firebaseConf';

import listenerImplementer from '../../../listeners/ListenerImplementer';

/**
 * This hook handles the logic for the edit profile page.
 * It handles database updates when user changes their account privacy settings.
 */
export default function useEditProfile () {

    const navigate = useNavigate();

    // State for listeners
    const [userDocListener, setUserDocListener] = useState(null);

    // State for subscriptions to fields in the user document
    const [username, setUserName] = useState('');
    const [bio, setBio] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [userID, setUserID] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    async function setup() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(userDocListener);

        const userDoc = userDocListener.getCurrentDocument();
        setUserName(userDoc.username);
        setBio(userDoc.bio);
        setIsPrivate(userDoc.isPrivate);
        setUserID(userDoc.userID);

        setIsLoading(false);
    }

    useEffect(() => {
        setup();
    }, []);

    const handleSubmitUserInfo = async () => {
        const userRef = doc(db, 'users', auth.currentUser.uid);

        await updateDoc(userRef, {
            username: username,
            bio: bio,
            isPrivate: isPrivate,
        });

        const publicUsersRef = doc(db, 'lists', 'publicUsers');
        if (isPrivate) {
            await updateDoc(publicUsersRef, {
                publicUsers: arrayRemove(userID),
            });
        } else {
            await updateDoc(publicUsersRef, {
                publicUsers: arrayUnion(userID),
            });
        }

        navigate('/viewProfile');
    };

    return {
        username, setUserName,
        bio, setBio,
        isPrivate, setIsPrivate,
        isLoading,
        handleSubmitUserInfo,
    };

}