/*
This function allows users to search for other users and follow them.
*/

import { useEffect } from 'react';
import { db, auth } from '../firebaseConf';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';

function Connect() {

    const user = auth.currentUser;

    const uniqueIDsRef = doc(db, 'backend', "uniqueIDsDoc");
    const [userIDs, setUserIDs] = useState([]);
    const [loadingUserIDs, setLoadingUserIDs] = useState(true);

    const userRef = doc(db, 'users', user.uid);
    const [userOwnID, setUserOwnID] = useState('');
    const [following, setFollowing] = useState([]);
    const [loadingFollowing, setLoadingFollowing] = useState(true);

    const [input, setInput] = useState('');
    const [isMatchFound, setIsMatchFound] = useState(false);
    const [matchFound, setMatchFound] = useState('');

    useEffect(() => {
        async function getFollowing() {
            const userDoc = await getDoc(userRef);
            setUserOwnID(userDoc.data().userID);
            setFollowing(userDoc.data().following);
            setLoadingFollowing(false);
        }
        getFollowing();
    }, []);

    useEffect(() => {
        async function getUserIDs() {
            const uniqueIDsDoc = await getDoc(uniqueIDsRef);
            setUserIDs(uniqueIDsDoc.data().uniqueIDs);
            setLoadingUserIDs(false);
        }
        getUserIDs();
    }, []);

    useEffect(() => {
        async function checkIfMatchFound() {
            if (userIDs.includes(input) && input !== userOwnID) {
                setIsMatchFound(true);
                setMatchFound(input);
            } else {
                setIsMatchFound(false);
            }
        }
        checkIfMatchFound();
    }, [input]);

    if (loadingUserIDs || loadingFollowing) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div>
                <h2>Connect</h2>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>

            {isMatchFound && following.includes(matchFound) &&
                <div>
                    <p>You are already following {matchFound}</p>
                </div>
            }

            {isMatchFound && !following.includes(matchFound) &&
                <div>
                    <p>Not following {matchFound} yet</p>
                    <p>Follow {matchFound}?</p>
                </div>
            }
        </div>
    );
}


export default Connect;