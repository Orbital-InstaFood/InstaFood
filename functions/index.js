const { logger } = require("firebase-functions/v2");

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { functions } = require("firebase-functions/v2");

initializeApp();
const admin = require("firebase-admin");
const db = getFirestore();

exports.addUserID = functions.https.onCall( async (request) => {
    const userID = request.data.userID;
    if (userID === undefined) {
        return { result: "No userID provided!!" };
    }
    const uniqueIDsRef = db.collection('backend').doc('uniqueIDsDoc');
    const result = await uniqueIDsRef.update({
        uniqueIDs: admin.firestore.FieldValue.arrayUnion(userID)
    });
    return { result: result };
}
);

