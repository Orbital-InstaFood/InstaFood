import DisplayArray from "./DisplayArray";
import displayImage from "./displayImage";
import { useState } from "react";
import DisplayComment from "./DisplayComment";
import MakeComment from "./MakeComment";

function DisplayPost({ post, userOwnID }) {

    const [comments, setComments] = useState(post.comments);

    const handleCommentMade = (comment) => {
        setComments([...comments, comment]);
    };

    const handleDeleteComment = (commentID) => {
        const newComments = comments.filter(c => c.commentID !== commentID);
        setComments(newComments);
    };

    return (
        <div>
            <p>{post.creator}</p>
            <h3>{post.title}</h3>
            <p>{post.caption}</p>

            <MakeComment
                postID={post.postID}
                commenterID={userOwnID}
                onCommentMade={handleCommentMade}
            />

            <DisplayArray array={comments} displayObjectFunc={comment => {
                return (
                    <DisplayComment
                        comment={comment}
                        userOwnID={userOwnID}
                        postID={post.postID}
                        onDeleteComment={handleDeleteComment}
                    />
                );
            }}
            />

            <DisplayArray array={post.images} displayObjectFunc={displayImage} />

        </div>
    );
}

export default DisplayPost;