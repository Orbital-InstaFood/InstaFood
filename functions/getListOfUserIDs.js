const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

exports.getListOfUserIDs = functions.https.onCall(async (request) => {
    const listOfUserIDs = [];
    const ownUserID = request.data.ownUserID;
    const snapshot = await db.collection('backend_userID_UID').get();
    snapshot.forEach(doc => {
        if ( doc.id !== ownUserID) {
            listOfUserIDs.push(doc.id);
        }
    });
    return { listOfUserIDs: listOfUserIDs };
});