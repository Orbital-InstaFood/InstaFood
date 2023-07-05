import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebaseConf';
import listenerImplementer from '../../listeners/ListenerImplementer';

import viewUsersLinkManagerInstance from '../../functions/viewUsersLinkManager';
import userDocEditor from '../../editor/userDocEditor';

function useViewOtherUsers() {
    const navigate = useNavigate();

    const [ userID, setUserID ] = useState(null);
    const [viewableUserInfo, setViewableUserInfo] = useState(null);

    const [UserDocListener, setUserDocListener] = useState(null);
    const [userOwnUserDoc, setUserOwnUserDoc] = useState(null);
    const [UserDocEditor, setUserDocEditor] = useState(null);
    const [savedPosts, setSavedPosts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const unsubscribeFromUserID = viewUsersLinkManagerInstance.subscribeToUserID((userID) => {
            setUserID(userID);
            setIsLoading(true);
        });

        return () => {
            unsubscribeFromUserID();
        }
    }, []);

    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(userDocListener);
    }

    useEffect(() => {
        setupListeners();
    }, []);

    function getUserOwnDoc() {
        const userDoc = UserDocListener.getCurrentDocument();
        setUserOwnUserDoc(userDoc);
    }

    function setupSubscriptions() {
        const unsubscribeFromSavedPosts =
            UserDocListener.subscribeToField('savedPosts', (savedPosts) => {
                setSavedPosts(savedPosts);
            });

        return () => {
            unsubscribeFromSavedPosts();
        }
    }

    useEffect(() => {
        // Only run after UserDocListener is set
        if (UserDocListener) {
            getUserOwnDoc();

            const unsubscribeFromAllFields = setupSubscriptions();
            return () => {
                unsubscribeFromAllFields();
            }
        }

    }, [UserDocListener, userID]);

    async function getViewableUserInfo() {
        const infoUserCanView = httpsCallable(functions, 'infoUserCanView');
        const result = await infoUserCanView(
            {
                userOwnID: userOwnUserDoc.userID,
                requestedUserID: userID
            });
        setViewableUserInfo(result.data.userInfo);
    }

    function checkIfUserIsViewingOwnProfile() {
        const userOwnID = userOwnUserDoc.userID;
        if (userOwnID === userID) {
            navigate('/viewProfile');
            return true;
        }
        return false;
    }

    function setupEditor() {    
        const UserDocEditor = new userDocEditor(userOwnUserDoc.userID, setUserOwnUserDoc);
        setUserDocEditor(UserDocEditor);
    }

    useEffect(() => {
        if (userOwnUserDoc) {

            const isUserViewingOwnProfile = checkIfUserIsViewingOwnProfile();
            if (isUserViewingOwnProfile) {
                return;
            }
            
            setupEditor();
            getViewableUserInfo();
        }
    }, [userOwnUserDoc, userID]);

    useEffect(() => {
        if (viewableUserInfo) {
            setIsLoading(false);
        }
    }, [viewableUserInfo]);

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

export default useViewOtherUsers;