const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.makeComment = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const comment = request.data.comment;

    await db.collection("posts").doc(postID).update({
        comments: admin.firestore.FieldValue.arrayUnion(comment)
    });

    return { result: "success" };
}
);