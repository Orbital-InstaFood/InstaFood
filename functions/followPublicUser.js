const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.followPublicUser = functions.https.onCall(async (request) => {
    const requesterUserID = request.data.requesterUserID;
    const publicUserID = request.data.publicUserID;

    if (requesterUserID === undefined) {
        return { result: "No requesterUserID provided!!" };
    }
    if (publicUserID === undefined) {
        return { result: "No publicUserID provided!!" };
    }

    const requesterSnapshot = await db.collection('backend_userID_UID').doc(requesterUserID).get();
    const requesterUID = requesterSnapshot.data().UID;

    const publicUserSnapshot = await db.collection('backend_userID_UID').doc(publicUserID).get();
    const publicUserUID = publicUserSnapshot.data().UID;

    await db.collection('users').doc(requesterUID).update(
        {
            following: admin.firestore.FieldValue.arrayUnion(publicUserID),
        }
    );

    await db.collection('users').doc(publicUserUID).update(
        {
            followers: admin.firestore.FieldValue.arrayUnion(requesterUserID),
        }
    );

    return { result: "Follow request sent successfully!" };

});