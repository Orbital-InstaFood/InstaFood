import { useEffect, useState } from "react";
import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";

import listenerImplementer from "../../listeners/ListenerImplementer";
import postDocEditor from "../../editor/postDocEditor";

/**
 * Custom hook for displaying a post
 * It retrieves the post document during setup
 * and provides the following functions:
 * 
 * @function handleDeleteComment - delete a comment - assumes that the user is the owner of the comment
 * @function handleLikeOrDislike - like or dislike a post
 * @function handleMakeComment - add a comment to the post
 */
export default function useDisplayPostLogic ( {postID, userOwnID} ) {

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

