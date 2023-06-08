const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

exports.unlikePost = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const unlikerID = request.data.unlikerID;

    const postRef = db.collection("posts").doc(postID);
    const postDoc = await postRef.get();
    const post = postDoc.data();

    const newLikes = post.likes.filter(likerID => likerID !== unlikerID);
    await postRef.update({ likes: newLikes });
    return { message: "Post unliked!" };
}
);