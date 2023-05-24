const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

exports.addUserID = onRequest(async (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    const userID = req.query.userID;

    const uniqueIDsDocRef = db.collection('backend').doc('uniqueIDsDoc');
    const uniqueIDsDoc = await uniqueIDsDocRef.get();
    const existingUniqueIDs = uniqueIDsDoc.data().uniqueIDs;

    await uniqueIDsDocRef.update({
        uniqueIDs: [...existingUniqueIDs, userID]
    });

    res.send("Success! User registered");
}
);
