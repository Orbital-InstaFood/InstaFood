import { useEffect, useState } from 'react';
import { db, auth, functions } from '../firebaseConf';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { httpsCallable } from 'firebase/functions';

function Connect() {

    const user = auth.currentUser;

    const getListOfUserIDs = httpsCallable(functions, 'getListOfUserIDs');
    const [userIDs, setUserIDs] = useState([]);
    const [loadingUserIDs, setLoadingUserIDs] = useState(true);

    const userRef = doc(db, 'users', user.uid);
    const [followRequestsSent, setFollowRequestsSent] = useState([]);
    const [userOwnID, setUserOwnID] = useState('');
    const [following, setFollowing] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);

    const [input, setInput] = useState('');
    const [isMatchFound, setIsMatchFound] = useState(false);
    const [matchFound, setMatchFound] = useState('');
    const makeFollowRequest = httpsCallable(functions, 'makeFollowRequest');

    const [loadingMakeFollowRequest, setLoadingMakeFollowRequest] = useState(false);

    useEffect(() => {
        async function getUser() {
            const userDoc = await getDoc(userRef);

            setFollowRequestsSent(userDoc.data().followRequestsSent);
            setUserOwnID(userDoc.data().userID);
            setFollowing(userDoc.data().following);
            setLoadingUser(false);
        }
        getUser();
    }, []);

    useEffect(() => {
        async function getUserIDs() {
            const result = await getListOfUserIDs({ ownUserID: userOwnID });
            setUserIDs(result.data.listOfUserIDs);
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

    const handleFollowRequest = (e) => {

        e.preventDefault();
        setLoadingMakeFollowRequest(true);

        async function executeFollowRequest() {
            const result = await makeFollowRequest({ requesterUserID: userOwnID, requestedUserID: matchFound });
            console.log(result.data.result);

            const newFollowRequestsSent = [...followRequestsSent, matchFound];
            setFollowRequestsSent(newFollowRequestsSent);

            await updateDoc(userRef, { followRequestsSent: newFollowRequestsSent });
            console.log('Follow request sent successfully!');

            setLoadingMakeFollowRequest(false);
        };
        executeFollowRequest();
    };

    if (loadingUserIDs || loadingUser || loadingMakeFollowRequest ) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div>
                <h2>Connect</h2>
                <label>Search for a user by his/her userID</label>
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

            {isMatchFound && followRequestsSent.includes(matchFound) &&
                <div>
                    <p>You have already sent a follow request to {matchFound}</p>
                </div>
            }

            {isMatchFound && !followRequestsSent.includes(matchFound) && !following.includes(matchFound) &&
                <div>
                    <p>Not following {matchFound} yet</p>
                    <button onClick={handleFollowRequest}>Follow {matchFound} ?</button>

                </div>
            }
        </div>
    );
}


export default Connect;