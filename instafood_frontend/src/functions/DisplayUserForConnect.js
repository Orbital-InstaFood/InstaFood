import { functions } from '../firebaseConf';
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';
import DisplayUserLink from './DisplayUserLink';

function DisplayUserForConnect ({otherUserID, userOwnID, following, followRequestSent, onFollowRequestSent }) {

    const makeFollowRequest = httpsCallable(functions, 'makeFollowRequest');
    const [loadingMakeFollowRequest, setLoadingMakeFollowRequest] = useState(false);

    const handleFollowRequest = (e) => {
        e.preventDefault();
        setLoadingMakeFollowRequest(true);

        async function executeFollowRequest() {
            const result = await makeFollowRequest({ requesterUserID: userOwnID, requestedUserID: otherUserID});
            console.log(result.data.result);
            setLoadingMakeFollowRequest(false);
            onFollowRequestSent(otherUserID);
        };

        executeFollowRequest();
    };

    if ( loadingMakeFollowRequest ) {
        return (
        <div>
            <p>{otherUserID}: Loading...</p>
        </div>
        );
    }

    if ( following.includes(otherUserID)) {
        return (
        <div>
            <p><DisplayUserLink userID={otherUserID} />: You are already following {otherUserID}</p>
        </div>
        );
    }

    if ( followRequestSent.includes(otherUserID)) {
        return (
        <div>
            <p><DisplayUserLink userID={otherUserID} />: You have already sent a follow request to {otherUserID}</p>
        </div>
        );
    }

    if ( otherUserID === userOwnID ) {
        return;
    }

    return (
        <div>
            <p> <DisplayUserLink userID={otherUserID}/> : Not following {otherUserID} yet</p>
            <button onClick={handleFollowRequest}>Follow this user? </button>
        </div>
    );
}

export default DisplayUserForConnect;