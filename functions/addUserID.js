const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

exports.addUserID = functions.https.onCall(async (request) => {
    const userID = request.data.userID;
    const UID = request.data.UID;
    if (userID === undefined) {
        return { result: "No userID provided!!" };
    }
    if (UID === undefined) {
        return { result: "No UID provided!!" };
    }
    const result = db.collection('backend_userID_UID').doc(userID).set(
        {
            UID: UID,
        }
    );
    return { result: result };
});

