const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

/**
 * @param {string} postID
 * @param {string} commentID
 * 
 * Deletes comment from post
 * This function is only accessible by the creator of the comment
 */
exports.deleteComment = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const commentID = request.data.commentID;

    const postRef = db.collection("posts").doc(postID);
    const postDoc = await postRef.get();
    const post = postDoc.data();

    const commentToDelete = post.comments.find(comment => comment.commentID === commentID);

    await postRef.update({
        comments: admin.firestore.FieldValue.arrayRemove(commentToDelete)
    });
    
    return { result: "success" };
});