import DisplayArray from "./DisplayArray";
import displayImage from "./displayImage";
import { useEffect, useState } from "react";
import DisplayComment from "./DisplayComment";
import MakeComment from "./MakeComment";
import Likes from "./Likes";
import DisplayUserLink from "./DisplayUserLink";

import { db } from '../firebaseConf';
import { getDoc, doc } from "firebase/firestore";


function DisplayPost({ postID, userOwnID }) {

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getPost() {
            const postRef = doc(db, 'posts', postID);
            const postDoc = await getDoc(postRef);
            if (postDoc.exists()) {
                setPost(postDoc.data());
                setLoading(false);
            }
        }
        getPost();
    }, [postID]);

    if (loading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    const handleLike = (liked) => {
        if (liked) {
            setPost({ ...post, likes: [...post.likes, userOwnID] });
        } else {
            const newLikes = post.likes.filter(liker => liker !== userOwnID);
            setPost({ ...post, likes: newLikes });
        }
    };

    const handleCommentMade = (comment) => {
        setPost({ ...post, comments: [...post.comments, comment] });
    };

    const handleDeleteComment = (commentID) => {
        const newComments = post.comments.filter(comment => comment.commentID !== commentID);
        setPost({ ...post, comments: newComments });
    };

    return (
        <div>
            <p>Creator: {post.creator}</p>
            <h3>Title: {post.title}</h3>
            <p>Caption: {post.caption}</p>

            <Likes
                post={post}
                userOwnID={userOwnID}
                onLike={handleLike}
            />

            <DisplayArray array={post.likes} displayObjectFunc={ liker => {
                return <DisplayUserLink
                        userID={liker}/>
            }} />

            <MakeComment
                postID={post.postID}
                commenterID={userOwnID}
                onCommentMade={handleCommentMade}
            />

            <DisplayArray array={post.comments} displayObjectFunc={comment => {
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