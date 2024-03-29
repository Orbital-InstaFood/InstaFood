const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

/**
 * @param {string} userOwnID - The userID of the user who is requesting to view the requested user's info
 * @param {string} requestedUserID - The userID of the requested user
 * @returns {object} - { fullReadAccess: boolean, userInfo: object }
 * 
 * All requests to view a user's info must go through this function
 * to determine if the user has full read access to the requested user's info.
 */
exports.infoUserCanView = functions.https.onCall(async (request) => {
    const userOwnID = request.data.userOwnID;
    const requestedUserID = request.data.requestedUserID;

    const requestedUIDSnapshot = await db.collection('backend_userID_UID').doc(requestedUserID).get();
    const requestedUID = requestedUIDSnapshot.data().UID;

    const requestedUserSnapshot = await db.collection('users').doc(requestedUID).get();
    const requestedUser = requestedUserSnapshot.data();

    const userInfo = {
        username: requestedUser.username,
        bio: requestedUser.bio,
        userID: requestedUser.userID,
        followers: requestedUser.followers,
        following: requestedUser.following,
        personalPostsLength: requestedUser.personalPosts.length,
        personalPosts: [],
        isPrivate: requestedUser.isPrivate,
    }

    if (!requestedUser.isPrivate || requestedUser.followers.includes(userOwnID)) {
        userInfo.personalPosts = requestedUser.personalPosts;
        return {
            fullReadAccess: true,
            userInfo: userInfo,
        }
    }

    return {
        fullReadAccess: false,
        userInfo: userInfo,
    }
});
