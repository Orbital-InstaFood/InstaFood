const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.answerFollowRequest = functions.https.onCall(async (request) => {
    const followerUserID = request.data.followerUserID;
    const followedUserID = request.data.followedUserID;
    const accept = request.data.accept;

    if (followerUserID === undefined) {
        return { result: "No followerUserID provided!!" };
    }

    if (followedUserID === undefined) {
        return { result: "No followedUserID provided!!" };
    }

    if (accept === undefined) {
        return { result: "No accept provided!!" };
    }

    const followerSnapshot = await db.collection('backend_userID_UID').doc(followerUserID).get();
    const followerUID = followerSnapshot.data().UID;

    const followedSnapshot = await db.collection('backend_userID_UID').doc(followedUserID).get();
    const followedUID = followedSnapshot.data().UID;

    if (accept) {

        await db.collection('users').doc(followerUID).update(
            {
                followRequestsSent: admin.firestore.FieldValue.arrayRemove(followedUserID),
                following: admin.firestore.FieldValue.arrayUnion(followedUserID),
            }
        );

        await db.collection('users').doc(followedUID).update(
            {
                followRequestsReceived: admin.firestore.FieldValue.arrayRemove(followerUserID),
                followers: admin.firestore.FieldValue.arrayUnion(followerUserID),
            }
        );

        return { result: "Follow request accepted!!" };

    } else {

        await db.collection('users').doc(followerUID).update(
            {
                followRequestsSent: admin.firestore.FieldValue.arrayRemove(followedUserID),
            }
        );

        await db.collection('users').doc(followedUID).update(
            {
                followRequestsReceived: admin.firestore.FieldValue.arrayRemove(followerUserID),
            }
        );

        return { result: "Follow request rejected!!" };

    }
});





