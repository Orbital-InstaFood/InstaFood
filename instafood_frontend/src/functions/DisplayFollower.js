import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';

function DisplayFollower ( {otherUserID, userOwnID} ) {
    const removeFollower = httpsCallable(functions, 'removeFollower');
    const [removeFollowerIsBeingProcessed, setRemoveFollowerIsBeingProcessed] = useState(false); 
    const [removeFollowerHasBeenProcessed, setRemoveFollowerHasBeenProcessed] = useState(false);

    const handleRemoveFollower = async () => {
        setRemoveFollowerIsBeingProcessed(true);
        const result = await removeFollower({ followerUserID: otherUserID, followedUserID: userOwnID });
        console.log(result.data.result);
        setRemoveFollowerHasBeenProcessed(true);   
        setRemoveFollowerIsBeingProcessed(false);
    }

    if (removeFollowerIsBeingProcessed) {
        return (
            <div>
                <p>Removing {otherUserID}...</p>
            </div>
        );
    }

    if (removeFollowerHasBeenProcessed) {
        window.location.reload();
    }

    return (
        <div>
            <p>{otherUserID}</p>
            <button onClick={() => handleRemoveFollower()}>Remove follower?</button>
        </div>
    );
}

export default DisplayFollower; 