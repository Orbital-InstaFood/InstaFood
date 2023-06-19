import { functions } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';

class postDocEditor {

    constructor(postDoc, setPostDoc ) {
        this.postDoc = postDoc;
        this.setPostDoc = setPostDoc;
        this._bindFunctions();
    }

    _bindFunctions() {
        this.likeOrDislike = this.likeOrDislike.bind(this);
        this.makeComment = this.makeComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    likeOrDislike(isLiked) {

        // Operations on the state
        this.setPostDoc((prevState) => {

            let newLikes = null;

            if (isLiked) {
                newLikes = [...prevState.likes, this.postDoc.creator];
            } else {
                newLikes = prevState.likes.filter(like => like !== this.postDoc.creator);
            }

            return {
                ...prevState,
                likes: newLikes
            };

        });

        // Operations on the database
        if (isLiked) {
            const likePost = httpsCallable(functions, 'likePost');
            likePost({ postID: this.postDoc.postID, likerID: this.postDoc.creator});
        } else {
            const unlikePost = httpsCallable(functions, 'unlikePost');
            unlikePost({ postID: this.postDoc.postID, unlikerID: this.postDoc.creator});
        }

    }

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