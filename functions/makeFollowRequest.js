const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

/**
 * This function adds the requested user to the requester's followRequestsSent list
 * and adds the requester to the requested user's followRequestsReceived list
 * This function manages follow requests sent to private users
 * Public users are followed using the followPublicUser function
 * 
 * @param {string} requesterUserID - The userID of the user who is requesting to follow the private user
 * @param {string} requestedUserID - The userID of the private user
 */
exports.makeFollowRequest = functions.https.onCall(async (request) => {
    const requesterUserID = request.data.requesterUserID;
    const requestedUserID = request.data.requestedUserID;

    if (requesterUserID === undefined) {
        return { result: "No requesterUserID provided!!" };
    }
    if (requestedUserID === undefined) {
        return { result: "No requestedUserID provided!!" };
    }

    const requesterSnapshot = await db.collection('backend_userID_UID').doc(requesterUserID).get();
    const requesterUID = requesterSnapshot.data().UID;

    const requestedSnapshot = await db.collection('backend_userID_UID').doc(requestedUserID).get();
    const requestedUID = requestedSnapshot.data().UID;

    await db.collection('users').doc(requesterUID).update(
        {
            followRequestsSent: admin.firestore.FieldValue.arrayUnion(requestedUserID),
        }
    );

    await db.collection('users').doc(requestedUID).update(
        {
            followRequestsReceived: admin.firestore.FieldValue.arrayUnion(requesterUserID),
        }
    );

    return { result: "Follow request sent successfully!" };

});