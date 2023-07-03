const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.removeFollower = functions.https.onCall(async (request) => {
    const followerUserID = request.data.followerUserID;
    const followedUserID = request.data.followedUserID;

    if (followerUserID === undefined) {
        return { result: "No followerUserID provided!!" };
    }

    if (followedUserID === undefined) {
        return { result: "No followedUserID provided!!" };
    }

    const followerSnapshot = await db.collection('backend_userID_UID').doc(followerUserID).get();
    const followerUID = followerSnapshot.data().UID;

    const followedSnapshot = await db.collection('backend_userID_UID').doc(followedUserID).get();
    const followedUID = followedSnapshot.data().UID;

    const followedUserDocSnapshot = await db.collection('users').doc(followedUID).get();
    const postsToRemoveFromToView = followedUserDocSnapshot.data().personalPosts;

    await db.collection('users').doc(followerUID).update(
        {
            following: admin.firestore.FieldValue.arrayRemove(followedUserID),
        }
    );

    for (const postID of postsToRemoveFromToView) {
        await db.collection('users').doc(followerUID).update(
            {
                postsToView: admin.firestore.FieldValue.arrayRemove(postID),
            }
        );
    }

    await db.collection('users').doc(followedUID).update(
        {
            followers: admin.firestore.FieldValue.arrayRemove(followerUserID),
        }
    );

    return { result: "Follower removed!!" };
}
);