const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();


exports.makeComment = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const commenterID = request.data.commenterID;
    const commentText = request.data.commentText;
    const commentID = request.data.commentID;

    const postRef = db.collection("posts").doc(postID);
    const postDoc = await postRef.get();
    const post = postDoc.data();

    const newComment = {
        commentID: commentID,
        commenterID: commenterID,
        commentText: commentText,
    };

    await postRef.update({ comments: [...post.comments, newComment] });
    return { comment: newComment };
}
);