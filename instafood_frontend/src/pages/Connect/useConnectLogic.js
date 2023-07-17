import { useEffect, useState } from 'react';

import textSearch from '../../functions/textSearch';
import listenerImplementer from '../../listeners/ListenerImplementer';
import userDocEditor from '../../editor/userDocEditor';

/**
 * Custom hook for the Connect page
 * It retrieves the user document during setup,
 * matches input from the search bar to user IDs in the database
 * and exposes the following variables and functions:
 * @var userDoc - the user document
 * @var listOfPossibleMatches - matches from the search bar
 * @function handleFollowRequest - function to handle follow requests
 */
export default function useConnectLogic() {

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

    const [isLoading, setIsLoading] = useState(true);

    let cleanupFunctions = [];

    // State for search bar
    const [input, setInput] = useState('');
    const [listOfPossibleMatches, setListOfPossibleMatches] = useState([]);

    async function setup() {
        // Setup listeners
        const userDocListener = await listenerImplementer.getUserDocListener();
        const listOfUserIDsListener = await listenerImplementer.getListOfUserIDsListener();
        const publicUsersListener = await listenerImplementer.getPublicUsersListener();

        setUserDocListener(userDocListener);
        setListOfUserIDsListener(listOfUserIDsListener);
        setPublicUsersListener(publicUsersListener);

        const userDoc = userDocListener.getCurrentDocument();
        setUserDoc(userDoc);

        const UserDocEditor = new userDocEditor(userDoc.userID, setUserDoc);
        setUserDocEditor(UserDocEditor);

        const unsubscribeFromUserIDs =
            listOfUserIDsListener.subscribeToField('userIDs', (userIDs) => {
                setUserIDs(userIDs);
            });
        cleanupFunctions.push(unsubscribeFromUserIDs);

        const unsubscribeFromPublicUsers =
            publicUsersListener.subscribeToField('publicUsers', (publicUsers) => {
                setPublicUsers(publicUsers);
            });
        cleanupFunctions.push(unsubscribeFromPublicUsers);

        setIsLoading(false);
    }

    useEffect(() => {
        setup();
        return () => {
            cleanupFunctions.forEach(cleanupFunction => cleanupFunction());
        }
    }, []);

    function handleFollowRequest(otherUserID) {
        if (publicUsers.includes(otherUserID)) {
            UserDocEditor.followPublicUser(otherUserID);
        } else {
            UserDocEditor.makeFollowRequest(otherUserID);
        }
    }

    useEffect(() => {
        const possibleMatches = textSearch(input, userIDs);
        const filteredMatchesWithoutUserOwnID = possibleMatches.filter(ID => ID !== userDoc.userID);
        setListOfPossibleMatches(filteredMatchesWithoutUserOwnID);
    }, [input]);

    return {
        isLoading,
        input, setInput,
        listOfPossibleMatches,
        userDoc,
        handleFollowRequest,
    }
}

