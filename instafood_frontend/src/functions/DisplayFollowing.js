import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';
import DisplayUserLink from './DisplayUserLink';

function DisplayFollowing ( {otherUserID, userOwnID, onFollowingRemoved}) {
    const unfollow = httpsCallable(functions, 'unfollow');
    const [unfollowIsBeingProcessed, setUnfollowIsBeingProcessed] = useState(false); 

    const handleUnfollow = async () => {
        setUnfollowIsBeingProcessed(true);
        const result = await unfollow({ otherUserID: otherUserID, userOwnID: userOwnID });
        console.log(result.data.result);
        setUnfollowIsBeingProcessed(false);
        onFollowingRemoved(otherUserID);
    }

    if (unfollowIsBeingProcessed) {
        return (
            <div>
                <p>Unfollowing {otherUserID}...</p>
            </div>
        );
    }

    return (
        <div>
            <DisplayUserLink userID={otherUserID}/>
            <button onClick={() => handleUnfollow()}>Unfollow?</button>
        </div>
    );
}

export default DisplayFollowing;