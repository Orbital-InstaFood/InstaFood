import { functions } from '../firebaseConf';
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';
import DisplayUserLink from './DisplayUserLink';

function DisplayUserForConnect({ otherUserID, userOwnID, following, followRequestsSent }) {

    const makeFollowRequest = httpsCallable(functions, 'makeFollowRequest');
    const [loadingMakeFollowRequest, setLoadingMakeFollowRequest] = useState(false);

    const handleFollowRequest = async (e) => {
        e.preventDefault();
        setLoadingMakeFollowRequest(true);
        await makeFollowRequest({ requesterUserID: userOwnID, requestedUserID: otherUserID });
        setLoadingMakeFollowRequest(false);

    };

    if (loadingMakeFollowRequest) {
        return (
            <div>
                <p>{otherUserID}: Loading...</p>
            </div>
        );
    }

    if (following.includes(otherUserID)) {
        return (
            <div>
                <p><DisplayUserLink userID={otherUserID} />: You are already following {otherUserID}</p>
            </div>
        );
    }

    if (followRequestsSent.includes(otherUserID)) {
        return (
            <div>
                <p><DisplayUserLink userID={otherUserID} />: You have already sent a follow request to {otherUserID}</p>
            </div>
        );
    }

    if (otherUserID === userOwnID) {
        return;
    }

    return (
        <div>
            <p> <DisplayUserLink userID={otherUserID} /> : Not following {otherUserID} yet</p>
            <button onClick={handleFollowRequest}>Follow this user? </button>
        </div>
    );
}

export default DisplayUserForConnect;