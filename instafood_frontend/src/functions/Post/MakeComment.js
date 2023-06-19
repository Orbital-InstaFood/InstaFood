import { useState } from "react";
import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";

function MakeComment({ commenterID, makeComment }) {

    const [commentText, setCommentText] = useState("");

    const handleMakeComment = (e) => {

        makeComment( {
            commenterID: commenterID,
            commentText: commentText,
            commentID: generateUniqueID()
        });

        setCommentText("");
    };

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
