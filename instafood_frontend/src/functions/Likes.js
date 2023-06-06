import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';
import { useState, useEffect } from "react";

function Likes({ post, userOwnID, onLike }) {
    const [liked, setLiked] = useState(false);

    const likePost = httpsCallable(functions, 'likePost');
    const unlikePost = httpsCallable(functions, 'unlikePost');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setProcessing(true);
        const likes = post.likes;
        if (likes.includes(userOwnID)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
        setProcessing(false);
    }, [post, userOwnID]);

    const handleLike = () => {
        setLiked(true);
        likePost({ postID: post.postID, likerID: userOwnID });
        onLike(true);
    }

    const handleUnlike = () => {
        setLiked(false);
        unlikePost({ postID: post.postID, unlikerID: userOwnID });
        onLike(false);
    }

    if (processing) {
        return (
            <div>
                <p>Processing...</p>
            </div>
        );
    }

    if (liked) {
        return (
            <div>
                <p>You liked this post!</p>
                <button onClick={() =>
                    handleUnlike()
                }>
                    Unlike
                </button>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() =>
                handleLike()
            }>
                Like
            </button>
        </div>
    );
}

export default Likes;