const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.unlikePost = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const unlikerID = request.data.unlikerID;

    await db.collection("posts").doc(postID).update({
        likes: admin.firestore.FieldValue.arrayRemove(unlikerID)
    });

    return { result: "success" };
});