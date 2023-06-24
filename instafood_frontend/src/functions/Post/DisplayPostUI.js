import DisplayComment from "./DisplayComment";
import MakeComment from "./MakeComment";
import Likes from "./Likes";
import DisplayUserLink from "../DisplayUserLink";
import DisplaySave from "./DisplaySave";
import displayImage from "../displayImage";

import useDisplayPostLogic from "./useDisplayPostLogic";
import "./DisplayPostUI.css";

function DisplayPostUI({ postID, userOwnID, isAPersonalPost, isASavedPost }) {

    const {
        postDoc,
        PostDocEditor,
        isLoading,
        postListener,
    } = useDisplayPostLogic({ postID, userOwnID });

    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="postContainer">
            <h2>Creator: {postDoc.creator}</h2>
            <h3>Title: {postDoc.title}</h3>
            <p>Caption: {postDoc.caption}</p>

            <div>
                <h4>Likes: {postDoc.likes.length}</h4>
                {postDoc.likes.map(likerID => {
                    return (
                        <DisplayUserLink
                            className="user-link"
                            userID={likerID}
                        />
                    );
                })}

                <Likes
                    className="likes"
                    likes={postDoc.likes}
                    userOwnID={userOwnID}
                    likeOrDislike={PostDocEditor.likeOrDislike}
                />
            </div>

            <br />
            <div>
                <h4>Comments: {postDoc.comments.length}</h4>

                {postDoc.comments.map(comment => {
                    return (
                        <DisplayComment
                            comment={comment}
                            userOwnID={userOwnID}
                            deleteComment={PostDocEditor.deleteComment}
                        />
                    );
                })}

                <br />
                <MakeComment
                    commenterID={userOwnID}
                    makeComment={PostDocEditor.makeComment}
                />
            </div>

            <br />
            <div>
                {!isAPersonalPost && (
                    <DisplaySave
                        className="save-button"
                        postID={postID}
                        isASavedPost={isASavedPost}
                    />
                )}
            </div>

            {postDoc.images.map(image => {
                return displayImage(image);
            })}

        </div>
    );
}

export default DisplayPostUI;
