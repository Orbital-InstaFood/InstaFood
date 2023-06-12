const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.createUserProfile = functions.https.onCall(async (request) => {
    const UID = request.data.UID;
    const username = request.data.username;
    const bio = request.data.bio;
    const isPrivate = request.data.isPrivate;
    const userID = request.data.userID;

    if (UID === undefined || UID === null) {
        return { result: "No UID provided!!" };
    }
    if (username === undefined || username === null) {
        return { result: "No username provided!!" };
    }
    if (bio === undefined || bio === null) {
        return { result: "No bio provided!!" };
    }
    if (isPrivate === undefined || isPrivate === null) {
        return { result: "No isPrivate provided!!" };
    }
    if (userID === undefined || userID === null) {
        return { result: "No userID provided!!" };
    }

    const userDoc = {
        username: username,
        bio: bio,
        isPrivate: isPrivate,
        userID: userID,
        followers: [],
        followRequestsReceived: [],
        following: [],
        followRequestsSent: [],
        savedPosts: [],
        personalPosts: [],
        postsToView: []
    };

    // Check if profile already exists
    const userRef = db.collection('users').doc(UID);
    const userDocExists = (await userRef.get()).exists;
    if (userDocExists) {
        return { userDocExists: true };
    }

    await db.collection('users').doc(UID).set(userDoc);
    
    await db.collection("lists").doc("userIDs").update ({
        userIDs: admin.firestore.FieldValue.arrayUnion(userID),
    })

    await db.collection('backend_userID_UID').doc(userID).set(
        {
            UID: UID,
        }
    );

    return { userDocExists: false };

});



