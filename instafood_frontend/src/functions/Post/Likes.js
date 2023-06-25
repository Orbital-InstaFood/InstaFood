import { useState, useEffect } from "react";

function Likes({ likes, userOwnID, likeOrDislike }) {

    const [hasLiked, setHasLiked] = useState(null);

    useEffect(() => {
        setHasLiked(likes.includes(userOwnID));
    }, [likes]);

    return (
        <div>
            {hasLiked ? (
                <button 
                className="unlike-button"
                onClick={() => likeOrDislike(false)}>You liked this post. Cancel Like? </button>
            ) : (
                <button 
                className="like-button"
                onClick={() => likeOrDislike(true)}>Love this post? </button>
            )}
        </div>
    );

}

export default Likes;