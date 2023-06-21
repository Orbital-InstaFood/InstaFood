import DisplayArray from "../DisplayArray";
import DisplayComment from "../DisplayComment";
import MakeComment from "../MakeComment";
import Likes from "../Likes";
import DisplayUserLink from "../DisplayUserLink";
import DisplaySave from "../DisplaySave";
import displayImage from "../displayImage";

import useDisplayPostLogic from "./useDisplayPostLogic";

function DisplayPostUI({ postID, userOwnID, isAPersonalPost, isASavedPost }) {

    const {
        postDoc,
        PostDocEditor,
        isLoading,
        postListener,
    } = useDisplayPostLogic({ postID, userOwnID});

    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
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

export default DisplayPostUI;
