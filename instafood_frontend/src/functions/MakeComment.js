import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';
import { useState } from "react";
import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';

function MakeComment({ postID, commenterID, onCommentMade }) {

    const [commentText, setCommentText] = useState("");

    const makeComment = httpsCallable(functions, 'makeComment');
    const [loadingSubmitComment, setLoadingSubmitComment] = useState(false);

    const handleMakeComment = async (e) => {
        setLoadingSubmitComment(true);

        const result = await makeComment(
            {
                postID: postID,
                commenterID: commenterID,
                commentText: commentText,
                commentID: generateUniqueID()
            });
        onCommentMade(result.data.comment);
        setLoadingSubmitComment(false);
        setCommentText("");
    };

    if (loadingSubmitComment) {
        return (
            <div>
                <p>Submitting comment...</p>
            </div>
        );
    }

    return (
        <div>
            <label>
                Give your comment:
                <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                />
            </label>
            <button onClick={() => {
                handleMakeComment();
            }
            }>
                Submit Comment
            </button>
        </div>
    );
}

export default MakeComment;
