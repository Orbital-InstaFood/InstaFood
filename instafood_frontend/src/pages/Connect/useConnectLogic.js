import { useEffect, useState } from 'react';

import textSearch from '../../functions/textSearch';

import listenerImplementer from '../../listeners/ListenerImplementer';

function useConnectLogic() {

    // State for listeners
    const [userDocListener, setUserDocListener] = useState(null);
    const [listOfUserIDsListener, setListOfUserIDsListener] = useState(null);

    // State for subscriptions to fields in the user document
    const [followRequestsSent, setFollowRequestsSent] = useState([]);
    const [userOwnID, setUserOwnID] = useState('');
    const [following, setFollowing] = useState([]);

    // State for subscriptions to userIDs in the listOfUserIDs document
    const [userIDs, setUserIDs] = useState([]);

    const [loadingForSubscriptions, setLoadingForSubscriptions] = useState(true);

    // State for search bar
    const [input, setInput] = useState('');
    const [listOfPossibleMatches, setListOfPossibleMatches] = useState([]);

    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        const listOfUserIDsListener = await listenerImplementer.getListOfUserIDsListener();

        setUserDocListener(userDocListener);
        setListOfUserIDsListener(listOfUserIDsListener);
    }

    /**
     * Subscribes to relevant fields in the user document and the list of userIDs.
     * 
     * @returns {function} unsubscribeFromAllFields
     */
    function setupSubscriptions() {
        const unsubscribeFromFollowing =
            userDocListener.subscribeToField('following',
                (following) => {
                    setFollowing(following);
                });

        const unsubscribeFromFollowRequestsSent =
            userDocListener.subscribeToField('followRequestsSent',
                (followRequestsSent) => {
                    setFollowRequestsSent(followRequestsSent);
                });

        const unsubscribeFromUserID =
            userDocListener.subscribeToField('userID', (userID) => {
                setUserOwnID(userID);
            });

        const unsubscribeFromUserIDs =
            listOfUserIDsListener.subscribeToField('userIDs', (userIDs) => {
                setUserIDs(userIDs);
            });

        return () => {
            unsubscribeFromFollowing();
            unsubscribeFromFollowRequestsSent();
            unsubscribeFromUserID();
            unsubscribeFromUserIDs();
        }
    }

    useEffect(() => {
        setupListeners();
    }, []);

    useEffect(() => {
        // Only set up subscriptions when both listeners are ready
        if (userDocListener && listOfUserIDsListener) {
            const unsubscribeFromAllFields = setupSubscriptions();
            setLoadingForSubscriptions(false);

            // Unsubscribe from all fields when component unmounts
            return () => {
                unsubscribeFromAllFields();
            }
        }
    }, [userDocListener, listOfUserIDsListener]);

    useEffect(() => {
        const possibleMatches = textSearch(input, userIDs);
        const filteredMatchesWithoutUserOwnID = possibleMatches.filter(c => c !== userOwnID);
        setListOfPossibleMatches(filteredMatchesWithoutUserOwnID);
    }, [input]);

    return {
        loadingForSubscriptions,
        input,
        setInput,
        listOfPossibleMatches,
        userOwnID,
        following,
        followRequestsSent,
    }
}

export default useConnectLogic;

