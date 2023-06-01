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
    console.log(postID, userOwnID);

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

    const handleLike = async () => {
        setProcessing(true);
        setLiked(true);
        const result = await likePost({ postID: postID, likerID: userOwnID });
        console.log(result.data.message);
        setProcessing(false);
        onLike(true);
    }

    const handleUnlike = async () => {
        setProcessing(true);
        setLiked(false);
        const result = await unlikePost({ postID: postID, unlikerID: userOwnID });
        console.log(result.data.message);
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