import { useEffect, useState } from "react";
import saveOrUnsaveAPost from "./saveOrUnsaveAPost";

function DisplaySave({ postID, isASavedPost }) {

    const [isSaved, setIsSaved] = useState(isASavedPost);

    useEffect(() => {
        setIsSaved(isASavedPost);
    }, [isASavedPost]);

    return (
        isSaved ? (
            <div>
                <button onClick={() => saveOrUnsaveAPost(postID, false)}>You saved this post. Remove from your collection?</button>
            </div>
        ) : (
            <div>
                <button onClick={() => saveOrUnsaveAPost(postID, true)}>Save this post to your collection?</button>
            </div>
        )
    );
}

export default DisplaySave;