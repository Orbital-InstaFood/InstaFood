import { useEffect, useState } from 'react';

import listenerImplementer from '../../../listeners/ListenerImplementer';

import userDocEditor from '../../../editor/userDocEditor';

/*
Edits of followers, following to be updated in the backend database 
*/

function useViewProfile() {

    // State for listeners
    const [userDocListener, setUserDocListener] = useState(null);

    // State for user info
    const [userDoc, setUserDoc] = useState(null);
    const [UserDocEditor, setUserDocEditor] = useState(null);

    // State for subscriptions
    const [savedPosts, setSavedPosts] = useState([]);

    let cleanupFunctions = [];

    const [isLoading, setIsLoading] = useState(true);

    async function setup() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(userDocListener);

        const userDoc = userDocListener.getCurrentDocument();
        setUserDoc(userDoc);

        const UserDocEditor = new userDocEditor(userDoc.userID, setUserDoc);
        setUserDocEditor(UserDocEditor);

        const unsubscribeFromSavedPosts =
            userDocListener.subscribeToField('savedPosts',
                (savedPosts) => {
                    setSavedPosts(savedPosts);
                });

        cleanupFunctions.push(unsubscribeFromSavedPosts);
    
        setIsLoading(false);
    }

    useEffect(() => {
        setup();
        return () => {
            cleanupFunctions.forEach((cleanupFunction) => {
                cleanupFunction();
            });
        }
    }, []);

    return {
        userDoc,
        UserDocEditor,
        savedPosts,
        isLoading
    }
}

export default useViewProfile


