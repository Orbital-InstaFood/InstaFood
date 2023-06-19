import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';

/**
 * This class provides methods to edit a post document,
 * making instant changes to state variables.
 * It also invokes the corresponding cloud functions to make changes to the database, 
 * but does not wait for the response.
 * 
 * Note: The post document is meant to provide initial information to the editor.
 * The document that is edited is the one in the state variable.
 * Thus, the post document passed to the constructor will not be updated.
 * 
 * @param {Object} postDoc - The post document that provides initial information
 * @param {Function} setPostDoc - The function that sets the state variable
 * @returns {Object} - An object with methods to edit the post document
 * 
 * @method likeOrDislike - Adds or removes the user's like from the post document
 * @method makeComment - Adds a comment to the post document
 * @method deleteComment - Removes a comment from the post document
 * 
 */
class postDocEditor {

    constructor(postDoc, setPostDoc, userOwnID ) {
        this.postDoc = postDoc;
        this.setPostDoc = setPostDoc;
        this.userOwnID = userOwnID;
        this._bindFunctions();
    }

    /**
     * Binds the functions to the class instance
     * @private
     */
    _bindFunctions() {
        this.likeOrDislike = this.likeOrDislike.bind(this);
        this.makeComment = this.makeComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    /**
     * @param {boolean} isLiked 
     */
    likeOrDislike(isLiked) {

        // Operations on the state
        this.setPostDoc((prevState) => {

            let newLikes = null;

            if (isLiked) {
                newLikes = [...prevState.likes, this.userOwnID];
            } else {
                newLikes = prevState.likes.filter(like => like !== this.userOwnID);
            }

            return {
                ...prevState,
                likes: newLikes
            };

        });

        // Operations on the database
        if (isLiked) {
            const likePost = httpsCallable(functions, 'likePost');
            likePost({ postID: this.postDoc.postID, likerID: this.userOwnID});
        } else {
            const unlikePost = httpsCallable(functions, 'unlikePost');
            unlikePost({ postID: this.postDoc.postID, unlikerID: this.userOwnID});
        }

    }

    /**
     * @param {object} comment 
     */
    makeComment(comment) {

        // Operations on the state
        this.setPostDoc((prevState) => {
            return {
                ...prevState,
                comments: [...prevState.comments, comment]
            };
        });

        // Operations on the database
        const makeCommentFn = httpsCallable(functions, 'makeComment');
        makeCommentFn({
            postID: this.postDoc.postID,
            commenterID: comment.commenterID,
            commentText: comment.commentText,
            commentID: comment.commentID
        });

    }

    /**
     * @param {string} commentID 
     */
    deleteComment(commentID) {

        // Operations on the state
        this.setPostDoc((prevState) => {
            return {
                ...prevState,
                comments: prevState.comments.filter(comment => comment.commentID !== commentID)
            };
        });

        // Operations on the database
        const deleteCommentFn = httpsCallable(functions, 'deleteComment');
        deleteCommentFn({ postID: this.postDoc.postID, commentID: commentID });

    }
}

export default postDocEditor;