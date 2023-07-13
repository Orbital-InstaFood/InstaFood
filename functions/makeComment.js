const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

/**
 * @param {string} postID
 * @param {object} comment - The comment object, which contains the commentID, commenterID,cand commentText
 * 
 * Adds comment to comments of post
 */
exports.makeComment = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const comment = request.data.comment;

    await db.collection("posts").doc(postID).update({
        comments: admin.firestore.FieldValue.arrayUnion(comment)
    });

    return { result: "success" };
});