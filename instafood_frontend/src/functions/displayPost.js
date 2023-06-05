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

    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        async function getPost() {
            const postRef = doc(db, 'posts', postID);
            const postDoc = await getDoc(postRef);
            if (postDoc.exists()) {
                setPost(postDoc.data());
                setLoading(false);
                setLikes(postDoc.data().likes);
                setComments(postDoc.data().comments);
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
            setLikes([...likes, userOwnID]);
        } else {
            const newLikes = likes.filter(likerID => likerID !== userOwnID);
            setLikes(newLikes);
        }
    };

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