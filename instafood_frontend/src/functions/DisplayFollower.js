import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';
import DisplayUserLink from './DisplayUserLink';

function DisplayFollower ( {otherUserID, userOwnID, onFollowerRemoved } ) {
    const removeFollower = httpsCallable(functions, 'removeFollower');
    const [removeFollowerIsBeingProcessed, setRemoveFollowerIsBeingProcessed] = useState(false); 

    const handleRemoveFollower = async () => {
        setRemoveFollowerIsBeingProcessed(true);
        const result = await removeFollower({ followerUserID: otherUserID, followedUserID: userOwnID });
        console.log(result.data.result);  
        setRemoveFollowerIsBeingProcessed(false);
        onFollowerRemoved(otherUserID);
    }

    if (removeFollowerIsBeingProcessed) {
        return (
            <div>
                <p>Removing {otherUserID}...</p>
            </div>
        );
    }


    return (
        <div>
            <DisplayUserLink userID={otherUserID} />
            <button onClick={() => handleRemoveFollower()}>Remove follower?</button>
        </div>
    );
}

export default DisplayFollower; 