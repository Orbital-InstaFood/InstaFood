const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

/**
 * @param {string} postID
 * @param {string} unlikerID - The userID of the user who is unliking the post
 * 
 * Removes unlikerID from likes of post
 */
exports.unlikePost = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const unlikerID = request.data.unlikerID;

    if (!postID) {
        return { result: "failure", error: "No postID provided" };
    }

    if (!unlikerID) {
        return { result: "failure", error: "No unlikerID provided" };
    }

    await db.collection("posts").doc(postID).update({
        likes: admin.firestore.FieldValue.arrayRemove(unlikerID)
    });

    return { result: "success" };
});