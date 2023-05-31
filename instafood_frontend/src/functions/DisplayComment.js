import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';
import { useState } from "react";

function DisplayComment ({ comment, userOwnID, postID, onDeleteComment }) {

    const [loadingDeleteComment, setLoadingDeleteComment] = useState(false);
    const deleteComment = httpsCallable(functions, 'deleteComment');

    const handleDeleteComment = async (e) => {
        setLoadingDeleteComment(true);
        const result = await deleteComment({ postID: postID, commentID: comment.commentID });
        console.log(result.data.result);
        onDeleteComment(comment.commentID);
        setLoadingDeleteComment(false);
    };

    if ( loadingDeleteComment ) {
        return (
        <div>
            <p>Deleting comment...</p>
        </div>
        );
    }

    if ( comment.commenterID === userOwnID ) {
        return (
        <div>
            <p>{comment.commenterID}: {comment.commentText}</p>
            <button onClick={ () => handleDeleteComment() }>Delete Comment</button>
        </div>
        );
    }

    return (
        <div>
            <p>{comment.commenterID}: {comment.commentText}</p>
        </div>
    );
}

export default DisplayComment;