import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';

function DisplayRequestReceived ({otherUserID, userOwnID, onFollowRequestAnswered}) {
    const answerFollowRequest = httpsCallable(functions, 'answerFollowRequest');
    const [requestIsBeingProcessed, setRequestIsBeingProcessed] = useState(false); 


    const handleAcceptOrReject = async (accept) => {
        setRequestIsBeingProcessed(true);
        const result = await answerFollowRequest({ followerUserID: otherUserID, followedUserID: userOwnID, accept: accept });
        console.log(result.data.result);  
        setRequestIsBeingProcessed(false);
        onFollowRequestAnswered(otherUserID, accept);
    }

    if (requestIsBeingProcessed) {
        return (
            <div>
                <p>Request from {otherUserID} is being processed...</p>
            </div>
        );
    }

    return (
        <div>
            <p>{otherUserID}</p>
            <button onClick={() => handleAcceptOrReject(true)}>Accept</button>
            <button onClick={() => handleAcceptOrReject(false)}>Reject</button>
        </div>
    );
}

export default DisplayRequestReceived;