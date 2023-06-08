const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

exports.deleteComment = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const commentID = request.data.commentID;

    const postRef = db.collection("posts").doc(postID);
    const postDoc = await postRef.get();
    const post = postDoc.data();

    const newComments = post.comments.filter( c => c.commentID !== commentID );
    await postRef.update({ comments: newComments });
    return { result: "success" };
});