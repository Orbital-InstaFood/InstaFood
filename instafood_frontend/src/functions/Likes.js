import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';
import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConf';

function Likes({ postID, userOwnID, onLike }) {
    const [liked, setLiked] = useState(false);

    const likePost = httpsCallable(functions, 'likePost');
    const unlikePost = httpsCallable(functions, 'unlikePost');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setProcessing(true);
        const checkIfLiked = async () => {
            setProcessing(true);
            const post = await getDoc(doc(db, "posts", postID));
            const likes = post.data().likes;
            if (likes.includes(userOwnID)) {
                setLiked(true);
            } else {
                setLiked(false);
            }
            setProcessing(false);
        }
        checkIfLiked();
    }, []);

    const handleLike = () => {
        setProcessing(true);
        setLiked(true);
        likePost({ postID: postID, likerID: userOwnID });
        setProcessing(false);
        onLike(true);
    }

    const handleUnlike = () => {
        setProcessing(true);
        setLiked(false);
        unlikePost({ postID: postID, unlikerID: userOwnID });
        setProcessing(false);
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