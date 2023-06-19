import DisplayArray from "../DisplayArray";
import displayImage from "../displayImage";
import { useEffect, useState } from "react";
import DisplayComment from "./DisplayComment";
import MakeComment from "./MakeComment";
import Likes from "./Likes";
import DisplayUserLink from "../DisplayUserLink";
import DisplaySave from "./DisplaySave";

import listenerImplementer from "../../listeners/ListenerImplementer";
import postDocEditor from "../../editor/postDocEditor";

function DisplayPost({ postID, userOwnID, isAPersonalPost, isASavedPost }) {

    const [postListener, setPostListener] = useState(null);

    const [postDoc, setPostDoc] = useState(null);
    const [PostDocEditor, setPostDocEditor] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    async function setupListeners() {
        const postListener = await listenerImplementer.getPostListener(postID);
        setPostListener(postListener);
    }

    function initializePostDocAndEditor() {
        const postDoc = postListener.getCurrentDocument();
        setPostDoc(postDoc);

        const PostDocEditor = new postDocEditor(postDoc, setPostDoc);
        setPostDocEditor(PostDocEditor);
    }

    useEffect(() => {
        setupListeners();
    }, []);

    useEffect(() => {

        // Check that the listener is fully set up before initializing userDoc and UserDocEditor
        if (postListener) {
            initializePostDocAndEditor();
            setIsLoading(false);
        }

    }, [postListener]);

    if (isLoading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div>
            <p>Creator: {postDoc.creator}</p>
            <h3>Title: {postDoc.title}</h3>
            <p>Caption: {postDoc.caption}</p>

            <Likes
                likes={postDoc.likes}
                userOwnID={userOwnID}
                likeOrDislike={PostDocEditor.likeOrDislike}
            />

            {postDoc.likes.map(likerID => {
                return (
                    <DisplayUserLink
                        userID={likerID}
                    />
                );
            })}

            <MakeComment
                commenterID={userOwnID}
                makeComment={PostDocEditor.makeComment}
            />

            {postDoc.comments.map(comment => {
                return (
                    <DisplayComment
                        comment={comment}
                        userOwnID={userOwnID}
                        deleteComment={PostDocEditor.deleteComment}
                    />
                );
            })}

            {!isAPersonalPost && (
                <DisplaySave
                    postID={postID}
                    isASavedPost={isASavedPost}
                />
            )}

            <DisplayArray array={postDoc.images} displayObjectFunc={displayImage} />

        </div>
    );
}

export default DisplayPost;
