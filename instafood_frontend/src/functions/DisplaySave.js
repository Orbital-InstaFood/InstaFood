import { useState, useEffect } from 'react';

function DisplaySave({ savedPosts, onSave, postID }) {
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (savedPosts.includes(postID)) {
            setSaved(true);
        }
    }, [savedPosts, postID]);


    return (
        <div>
            {saved ? (
                <button onClick={() => {
                    setSaved(false);
                    onSave(false);
                }
                }>Unsave</button>
            ) : (
                <button onClick={() => {
                    setSaved(true);
                    onSave(true);
                }
                }>Save</button>
            )}
        </div>
    );
}

export default DisplaySave;