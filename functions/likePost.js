const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.likePost = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const likerID = request.data.likerID;

    await db.collection("posts").doc(postID).update({
        likes: admin.firestore.FieldValue.arrayUnion(likerID)
    });
}
);
