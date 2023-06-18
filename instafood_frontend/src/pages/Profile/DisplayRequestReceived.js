import { useState } from 'react';
import DisplayUserLink from '../../functions/DisplayUserLink';

function DisplayRequestReceived ({otherUserID, answerFollowRequest }) {
    const [requestIsBeingProcessed, setRequestIsBeingProcessed] = useState(false); 

    const handleAcceptOrReject = async (isAccepted) => {
        setRequestIsBeingProcessed(true);
        answerFollowRequest(otherUserID, isAccepted);
        setRequestIsBeingProcessed(false);
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
            <DisplayUserLink userID={otherUserID}/>
            <button onClick={() => handleAcceptOrReject(true)}>Accept</button>
            <button onClick={() => handleAcceptOrReject(false)}>Reject</button>
        </div>
    );
}

export default DisplayRequestReceived;