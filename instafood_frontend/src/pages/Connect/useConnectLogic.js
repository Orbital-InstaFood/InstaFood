import { useEffect, useState } from 'react';

import textSearch from '../../functions/textSearch';

import listenerImplementer from '../../listeners/ListenerImplementer';
import userDocEditor from '../../editor/userDocEditor';

function useConnectLogic() {

    // State for listeners
    const [userDocListener, setUserDocListener] = useState(null);
    const [listOfUserIDsListener, setListOfUserIDsListener] = useState(null);
    const [publicUsersListener, setPublicUsersListener] = useState(null);

    // State for subscriptions to fields in the user document
    const [userDoc, setUserDoc] = useState(null);

    const [UserDocEditor, setUserDocEditor] = useState(null);

    // State for subscriptions to userIDs in the listOfUserIDs document
    const [userIDs, setUserIDs] = useState([]);
    const [publicUsers, setPublicUsers] = useState([]);

    const [isLoadingForSubscriptions, setIsLoadingForSubscriptions] = useState(true);

    // State for search bar
    const [input, setInput] = useState('');
    const [listOfPossibleMatches, setListOfPossibleMatches] = useState([]);

    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        const listOfUserIDsListener = await listenerImplementer.getListOfUserIDsListener();
        const publicUsersListener = await listenerImplementer.getPublicUsersListener();

        setUserDocListener(userDocListener);
        setListOfUserIDsListener(listOfUserIDsListener);
        setPublicUsersListener(publicUsersListener);
    }

    /**
     * Subscribes to relevant fields in the user document and the list of userIDs.
     * 
     * @returns {function} unsubscribeFromAllFields
     */
    function setupSubscriptions() {

        const unsubscribeFromUserIDs =
            listOfUserIDsListener.subscribeToField('userIDs', (userIDs) => {
                setUserIDs(userIDs);
            });

        const unsubscribeFromPublicUsers =
            publicUsersListener.subscribeToField('publicUsers', (publicUsers) => {
                setPublicUsers(publicUsers);
            });

        return () => {
            unsubscribeFromUserIDs();
            unsubscribeFromPublicUsers();
        }
    }

    function initializeUserDocAndEditor() {
        const userDoc = userDocListener.getCurrentDocument();
        setUserDoc(userDoc);

        const UserDocEditor = new userDocEditor(userDoc.userID, setUserDoc);
        setUserDocEditor(UserDocEditor);
    }

    function handleFollowRequest(otherUserID) {
        if (publicUsers.includes(otherUserID)) {
            UserDocEditor.followPublicUser(otherUserID);
        } else {
            UserDocEditor.makeFollowRequest(otherUserID);
        }
    }

    useEffect(() => {
        setupListeners();
    }, []);

    useEffect(() => {
        // Only set up subscriptions when both listeners are ready
        if (userDocListener && listOfUserIDsListener && publicUsersListener) {

            initializeUserDocAndEditor();
            const unsubscribeFromAllFields = setupSubscriptions();
            setIsLoadingForSubscriptions(false);

            // Unsubscribe from all fields when component unmounts
            return () => {
                unsubscribeFromAllFields();
            }
        }

    }, [userDocListener, listOfUserIDsListener, publicUsersListener]);

    useEffect(() => {
        const possibleMatches = textSearch(input, userIDs);
        const filteredMatchesWithoutUserOwnID = possibleMatches.filter(ID => ID !== userDoc.userID);
        setListOfPossibleMatches(filteredMatchesWithoutUserOwnID);
    }, [input]);

    return {
        isLoadingForSubscriptions,
        input,
        setInput,
        listOfPossibleMatches,
        userDoc,
        handleFollowRequest,
    }
}

export default useConnectLogic;

