import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';


function DisplayFollowing ( {otherUserID, userOwnID }) {
    const unfollow = httpsCallable(functions, 'unfollow');
    const [unfollowIsBeingProcessed, setUnfollowIsBeingProcessed] = useState(false); 
    const [unfollowHasBeenProcessed, setUnfollowHasBeenProcessed] = useState(false);

    const handleUnfollow = async () => {
        setUnfollowIsBeingProcessed(true);
        const result = await unfollow({ otherUserID: otherUserID, userOwnID: userOwnID });
        console.log(result.data.result);
        setUnfollowHasBeenProcessed(true);   
        setUnfollowIsBeingProcessed(false);
    }

    if (unfollowIsBeingProcessed) {
        return (
            <div>
                <p>Unfollowing {otherUserID}...</p>
            </div>
        );
    }

    if (unfollowHasBeenProcessed) {
        window.location.reload();
    }

    return (
        <div>
            <p>{otherUserID}</p>
            <button onClick={() => handleUnfollow()}>Unfollow?</button>
        </div>
    );
}

export default DisplayFollowing;