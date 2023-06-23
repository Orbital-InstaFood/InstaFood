import { useState, useEffect } from "react";

function Likes({ likes, userOwnID, likeOrDislike }) {

    const [hasLiked, setHasLiked] = useState(null);

    useEffect(() => {
        setHasLiked(likes.includes(userOwnID));
    }, [likes]);

    return (
        <div>
            {hasLiked ? (
                <button onClick={() => likeOrDislike(false)}>Dislike</button>
            ) : (
                <button onClick={() => likeOrDislike(true)}>Like</button>
            )}
        </div>
    );

}

export default Likes;