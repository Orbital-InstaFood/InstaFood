const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

exports.likePost = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const likerID = request.data.likerID;

    const postRef = db.collection("posts").doc(postID);
    const postDoc = await postRef.get();
    const post = postDoc.data();

    const newLikes = [...post.likes, likerID];
    await postRef.update({ likes: newLikes });
    return { message: "Post liked!" };
}
);
