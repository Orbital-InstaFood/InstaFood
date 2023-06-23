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
                <button onClick={() => saveOrUnsaveAPost(postID, false)}>Unsave</button>
            </div>
        ) : (
            <div>
                <button onClick={() => saveOrUnsaveAPost(postID, true)}>Save</button>
            </div>
        )
    );
}

export default DisplaySave;