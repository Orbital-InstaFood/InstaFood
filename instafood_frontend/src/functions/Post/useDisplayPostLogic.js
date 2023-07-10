import { useEffect, useState } from "react";

import listenerImplementer from "../../listeners/ListenerImplementer";
import postDocEditor from "../../editor/postDocEditor";

import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";

function useDisplayPostLogic ( {postID, userOwnID} ) {

    const [postListener, setPostListener] = useState(null);

    const [postDoc, setPostDoc] = useState(null);
    const [PostDocEditor, setPostDocEditor] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [commentText, setCommentText] = useState('');

    async function setup() {
        const postListener = await listenerImplementer.getPostListener(postID);
        setPostListener(postListener);

        const postDoc = postListener.getCurrentDocument();
        setPostDoc(postDoc);

        const PostDocEditor = new postDocEditor(postID, setPostDoc, userOwnID);
        setPostDocEditor(PostDocEditor);

        setIsLoading(false);
    }

    useEffect(() => {
        setup();
    }, [postID]);


    function handleDeleteComment(commentID) {
        PostDocEditor.deleteComment(commentID);
    }

    function handleLikeOrDislike() {
        const currentLikeStatus = postDoc.likes.includes(userOwnID);
        PostDocEditor.likeOrDislike(!currentLikeStatus);
    }

    function handleMakeComment() {

        if (commentText === "") {
            return;
        }

        PostDocEditor.makeComment({
            commenterID: userOwnID,
            commentText: commentText,
            commentID: generateUniqueID()
        });

        setCommentText("");
    }

    return {       
        postDoc,
        isLoading,
        commentText, setCommentText,
        handleMakeComment, handleLikeOrDislike, handleDeleteComment,
    };
}

export default useDisplayPostLogic;

