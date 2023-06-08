const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

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
    }

    if (requestedUser.isPublic || requestedUser.followers.includes(userOwnID)) {
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
