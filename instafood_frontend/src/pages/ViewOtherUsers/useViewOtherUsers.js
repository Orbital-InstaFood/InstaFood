import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebaseConf';
import listenerImplementer from '../../listeners/ListenerImplementer';

import viewUsersLinkManagerInstance from '../../functions/viewUsersLinkManager';
import userDocEditor from '../../editor/userDocEditor';

/**
 * This hook handles the logic for the view other users page.
 */
export default function useViewOtherUsers() {
    const navigate = useNavigate();

    const [targetUserID, setTargetUserID] = useState(null);
    const [viewableUserInfo, setViewableUserInfo] = useState(null);

    const [UserDocListener, setUserDocListener] = useState(null);
    const [userOwnUserDoc, setUserOwnUserDoc] = useState(null);
    const [UserDocEditor, setUserDocEditor] = useState(null);
    const [savedPosts, setSavedPosts] = useState([]);

    let cleanupFunctions = [];

    const [isLoading, setIsLoading] = useState(true);

    async function setup() {

        setIsLoading(true);

        const UserDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(UserDocListener);

        const userOwnUserDoc = UserDocListener.getCurrentDocument();
        setUserOwnUserDoc(userOwnUserDoc);

        const targetUserID = viewUsersLinkManagerInstance.getCurrentUserID();
        const userOwnID = userOwnUserDoc.userID;
        if (userOwnID === targetUserID) {
            navigate('/viewProfile');
            return;
        }

        const unsubscribeFromSavedPosts =
            UserDocListener.subscribeToField('savedPosts', (savedPosts) => {
                setSavedPosts(savedPosts);
            });
        cleanupFunctions.push(unsubscribeFromSavedPosts);

        const unsubscribeFromUserID = viewUsersLinkManagerInstance.subscribeToUserID((userID) => {
            setTargetUserID(userID);
        });
        cleanupFunctions.push(unsubscribeFromUserID);

        const UserDocEditor = new userDocEditor(userOwnUserDoc.userID, setUserOwnUserDoc);
        setUserDocEditor(UserDocEditor);

        const infoUserCanView = httpsCallable(functions, 'infoUserCanView');
        const result = await infoUserCanView(
            {
                userOwnID: userOwnUserDoc.userID,
                requestedUserID: targetUserID
            });
        setViewableUserInfo(result.data.userInfo);

        setIsLoading(false);
    }

    useEffect(() => {
        setup();
        return () => {
            cleanupFunctions.forEach((cleanupFunction) => {
                cleanupFunction();
            });
        };
    }, [targetUserID]);

    function handleFollow() {
        if (viewableUserInfo.isPrivate) {
            UserDocEditor.makeFollowRequest(viewableUserInfo.userID);
        } else {
            UserDocEditor.followPublicUser(viewableUserInfo.userID);
        }
    }

    return {
        viewableUserInfo,
        isLoading,
        userOwnUserDoc,
        savedPosts,
        handleFollow
    };

}