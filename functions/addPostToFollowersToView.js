const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.addPostToFollowersToView = functions.https.onCall(async (request) => {
    const postID = request.data.postID;
    const creatorUID = request.data.creatorUID;
    if (postID === undefined) {
        return { result: "No postID provided!!" };
    }
    if (creatorUID === undefined) {
        return { result: "No creator provided!!" };
    }
    const userRef = db.collection('users').doc(creatorUID);
    const userDoc = await userRef.get();
    const followers = userDoc.data().followers;

    for (const follower of followers) {

        const followerUIDref = db.collection('backend_userID_UID').doc(follower);
        const followerUIDDoc = await followerUIDref.get();
        const followerUID = followerUIDDoc.data().UID;

        await db.collection('users').doc(followerUID).update({
            postsToView: admin.firestore.FieldValue.arrayUnion(postID)
        });

    }
    return { result: "Post added to followers to view successfully!" };
}
);