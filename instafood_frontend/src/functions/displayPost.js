import DisplayArray from "./DisplayArray";
import displayImage from "./displayImage";
import { useState } from "react";
import DisplayComment from "./DisplayComment";
import MakeComment from "./MakeComment";
import Likes from "./Likes";
import DisplayUserLink from "./DisplayUserLink";


function DisplayPost({ post, userOwnID }) {

    const [likes, setLikes] = useState(post.likes);

    const handleLike = (liked) => {
        if (liked) {
            setLikes([...likes, userOwnID]);
        } else {
            const newLikes = likes.filter(likerID => likerID !== userOwnID);
            setLikes(newLikes);
        }
    };

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
            <p>Creator: {post.creator}</p>
            <h3>Title: {post.title}</h3>
            <p>Caption: {post.caption}</p>

            <Likes
                postID={post.postID}
                userOwnID={userOwnID}
                onLike={handleLike}
            />

            <DisplayArray array={likes} displayObjectFunc={ liker => {
                return <DisplayUserLink
                        userID={liker}/>
            }} />

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