const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.notifyFollowersAboutNewEvent = functions.https.onCall(async (request) => {
    const eventID = request.data.eventID;
    const followers = request.data.followers;

    for (const followerUserID of followers) {
        const followerUID = (await db.collection('backend_userID_UID').doc(followerUserID).get()).data().UID;
        await db.collection('users').doc(followerUID).update(
            {
                eventsToView: admin.firestore.FieldValue.arrayUnion(eventID),
            }
        );
    }

    return { result: "Followers notified!!" };
});