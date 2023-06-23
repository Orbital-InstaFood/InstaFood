import { useState } from 'react';
import DisplayUserLink from '../../functions/DisplayUserLink';

function DisplayFollower ( {otherUserID, removeFollower } ) {
    const [removeFollowerIsBeingProcessed, setRemoveFollowerIsBeingProcessed] = useState(false); 

    const handleRemoveFollower = async () => {
        setRemoveFollowerIsBeingProcessed(true);
        removeFollower(otherUserID);
        setRemoveFollowerIsBeingProcessed(false);
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