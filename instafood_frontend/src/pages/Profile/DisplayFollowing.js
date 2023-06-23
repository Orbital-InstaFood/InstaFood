import { useState } from 'react';
import DisplayUserLink from '../../functions/DisplayUserLink';

function DisplayFollowing ( {otherUserID, unfollow }) {
    const [unfollowIsBeingProcessed, setUnfollowIsBeingProcessed] = useState(false); 

    const handleUnfollow = async () => {
        setUnfollowIsBeingProcessed(true);
        unfollow(otherUserID);

        setUnfollowIsBeingProcessed(false);
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