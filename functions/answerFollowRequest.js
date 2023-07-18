const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

/**
 * @param {string} followerUserID - ID of the user who sent the follow request
 * @param {string} followedUserID - ID of the user who received the follow request
 * @param {boolean} isAccepted - true if the follow request is accepted, false if rejected
 * 
 * This function is called when a user answers a follow request
 * It accepts the userIDs, visits backend_userID_UID to get the UIDs,
 * then updates the users' documents accordingly
 */
exports.answerFollowRequest = functions.https.onCall(async (request) => {
    const followerUserID = request.data.followerUserID;
    const followedUserID = request.data.followedUserID;
    const isAccepted = request.data.accept;

    if (followerUserID === undefined) {
        return { result: "No followerUserID provided!!" };
    }

    if (followedUserID === undefined) {
        return { result: "No followedUserID provided!!" };
    }

    if (isAccepted === undefined) {
        return { result: "No accept provided!!" };
    }

    const followerSnapshot = await db.collection('backend_userID_UID').doc(followerUserID).get();
    const followerUID = followerSnapshot.data().UID;

    const followedSnapshot = await db.collection('backend_userID_UID').doc(followedUserID).get();
    const followedUID = followedSnapshot.data().UID;

    if (isAccepted) {

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





