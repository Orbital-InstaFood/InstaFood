import { useEffect, useState } from 'react';

import textSearch from '../functions/textSearch';
import DisplayArray from '../functions/DisplayArray';
import DisplayUserForConnect from '../functions/DisplayUserForConnect';

import listenerImplementer from '../listeners/ListenerImplementer';

function Connect() {

    const [userDocListener, setUserDocListener] = useState(null);
    const [listOfUserIDsListener, setListOfUserIDsListener] = useState(null);

    const [followRequestsSent, setFollowRequestsSent] = useState([]);
    const [userOwnID, setUserOwnID] = useState('');
    const [following, setFollowing] = useState([]);

    const [userIDs, setUserIDs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [input, setInput] = useState('');
    const [listOfPossibleMatches, setListOfPossibleMatches] = useState([]);

    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        const listOfUserIDsListener = await listenerImplementer.getListOfUserIDsListener();

        setUserDocListener(userDocListener);
        setListOfUserIDsListener(listOfUserIDsListener);
    }

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
            setLoading(false);

            // Unsubscribe from all fields when component unmounts
            return () => {
                unsubscribeFromAllFields();
            }
        }
    }, [userDocListener, listOfUserIDsListener]);

    useEffect(() => {
        const possibleMatches = textSearch(input, userIDs);
        const filterOwnID = possibleMatches.filter(c => c !== userOwnID);
        setListOfPossibleMatches(filterOwnID);
    }, [input]);

    return (
        <div>
            <h2>Connect</h2>

            {loading &&
                <p>Loading...</p>
            }

            {!loading &&
                <>
                    <label>Search for a user by his/her userID</label>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <DisplayArray array={listOfPossibleMatches} displayObjectFunc={c =>
                        <DisplayUserForConnect
                            otherUserID={c}
                            userOwnID={userOwnID}
                            following={following}
                            followRequestsSent={followRequestsSent}
                        />}
                    />
                </>
            }
        </div>
    );
}

export default Connect;