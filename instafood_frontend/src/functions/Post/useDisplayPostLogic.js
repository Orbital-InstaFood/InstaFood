import { useEffect, useState } from "react";

import listenerImplementer from "../../listeners/ListenerImplementer";
import postDocEditor from "../../editor/postDocEditor";

function useDisplayPostLogic ( {postID, userOwnID} ) {

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

        const PostDocEditor = new postDocEditor(postID, setPostDoc, userOwnID);
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

    return {
        postDoc,
        PostDocEditor,
        isLoading,
        postListener,
    };
}

export default useDisplayPostLogic;

