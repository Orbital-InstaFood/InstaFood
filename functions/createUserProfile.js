const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

/**
 * @param {string} UID
 * @param {string} username
 * @param {string} bio
 * @param {boolean} isPrivate
 * @param {string} userID
 * 
 * This function creates a user document in the users collection,
 * a document in backend_userID_UID to store the UID,
 * updates the userIDs and publicUsers lists in the lists collection,
 */
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
    if (fcmToken === undefined || fcmToken === null) {
        return { result: "No fcmToken provided!!" };
    }

    const userDoc = {
        username: username,
        bio: bio,
        isPrivate: isPrivate,
        userID: userID,
        fcmToken: fcmToken,
        followers: [],
        followRequestsReceived: [],
        following: [],
        followRequestsSent: [],
        savedPosts: [],
        personalPosts: [],
        postsToView: []
    };

    await db.collection('users').doc(UID).set(userDoc);
    
    await db.collection("lists").doc("userIDs").update ({
        userIDs: admin.firestore.FieldValue.arrayUnion(userID),
    })

    if (!isPrivate) {
        await db.collection('lists').doc('publicUsers').update(
            {
                publicUsers: admin.firestore.FieldValue.arrayUnion(userID),
            }
        );
    }

    await db.collection('backend_userID_UID').doc(userID).set(
        {
            UID: UID,
        }
    );

    return { result: "Success!!" };

});



