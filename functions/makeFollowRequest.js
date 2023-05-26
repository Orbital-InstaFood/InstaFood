const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.makeFollowRequest = functions.https.onCall(async (request) => {
    const requesterUserID = request.data.requesterUserID;
    const requestedUserID = request.data.requestedUserID;
    if (requesterUserID === undefined) {
        return { result: "No requesterUserID provided!!" };
    }
    if (requestedUserID === undefined) {
        return { result: "No requestedUserID provided!!" };
    }
    const requestedSnapshot = await db.collection('backend_userID_UID').doc(requestedUserID).get();

    if (!requestedSnapshot.exists) {
        return { result: "No user with that requestedUserID exists!!" };
    }

    const requestedUID = requestedSnapshot.data().UID;

    const result = await db.collection('users').doc(requestedUID).update(
        {
            followRequestsReceived: admin.firestore.FieldValue.arrayUnion(requesterUserID),
        }
    );

    return { result: result };
});