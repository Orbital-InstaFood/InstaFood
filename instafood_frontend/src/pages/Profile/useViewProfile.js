import { useEffect, useState } from 'react';

import listenerImplementer from '../../listeners/ListenerImplementer';

import userDocEditor from '../../editor/userDocEditor';

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

    const [isLoading, setIsLoading] = useState(true);

    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(userDocListener);
    }

    function setupSubscriptions() {
        const unsubscribeFromSavedPosts =
            userDocListener.subscribeToField('savedPosts',
                (savedPosts) => {
                    setSavedPosts(savedPosts);
                });

        return () => {
            unsubscribeFromSavedPosts();
        }
    }

    function initializeUserDocAndEditor() {
        const userDoc = userDocListener.getCurrentDocument();
        setUserDoc(userDoc);

        const UserDocEditor = new userDocEditor(userDoc.userID, setUserDoc);
        setUserDocEditor(UserDocEditor);
    }

    useEffect(() => {
        setupListeners();
    }, []);

    useEffect(() => {

        // Check that the listener is fully set up before setting up subscriptions,
        // and initializing userDoc and UserDocEditor
        if (userDocListener) {
            const unsubscribeFromSavedPosts = setupSubscriptions();
            initializeUserDocAndEditor();
            setIsLoading(false);

            return () => {
                unsubscribeFromSavedPosts();
            }

        }

    }, [userDocListener]);

    return {
        userDoc,
        UserDocEditor,
        savedPosts,
        isLoading
    }
}

export default useViewProfile


