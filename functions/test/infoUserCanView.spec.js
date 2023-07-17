const { expect } = require("chai");
const admin = require("firebase-admin");
const test = require("./config");
const myFunctions = require("../index");

describe("infoUserCanView", () => {

    const userOwnID = "userOwnID";

    const requestedUserID = "otherUserID";
    const requestedUID = "otherUserUID";

    beforeEach(async () => {

        const userUIDRef = admin.firestore().doc("backend_userID_UID/userOwnID");
        await userUIDRef.set({
            UID: userOwnID,
        });

        const requestedUserUIDRef = admin.firestore().doc("backend_userID_UID/otherUserID");
        await requestedUserUIDRef.set({
            UID: requestedUID,
        });
    });

    after(() => {
        test.cleanup();
    });

    it("personalPosts is empty if user is private and userOwnID is not a follower", async () => {
        let requestedUserDoc = {
            username: "username",
            bio: "bio",
            userID: requestedUserID,
            followers: ["followerID"],
            following: ["followingID"],
            personalPosts: ["postID"],
            isPrivate: true,
        };

        const requestedUserDocRef = admin.firestore().doc("users/otherUserUID");
        await requestedUserDocRef.set(requestedUserDoc);

        const wrapped = test.wrap(myFunctions.infoUserCanView);
        const response = await wrapped({ data: { userOwnID: userOwnID, requestedUserID: requestedUserID } });

        expect(response.userInfo.personalPosts).to.deep.equal([]);
    });

    it("personalPosts is not empty if user's account is public", async () => {
        let requestedUserDoc = {
            username: "username",
            bio: "bio",
            userID: requestedUserID,
            followers: ["followerID"],
            following: ["followingID"],
            personalPosts: ["postID"],
            isPrivate: false,
        };

        const requestedUserDocRef = admin.firestore().doc("users/otherUserUID");
        await requestedUserDocRef.set(requestedUserDoc);

        const wrapped = test.wrap(myFunctions.infoUserCanView);
        const response = await wrapped({ data: { userOwnID: userOwnID, requestedUserID: requestedUserID } });

        expect(response.userInfo.personalPosts).to.deep.equal(["postID"]);
    });

    it("personalPosts is not empty if user is private and userOwnID is a follower", async () => {
        let requestedUserDoc = {
            username: "username",
            bio: "bio",
            userID: requestedUserID,
            followers: ["followerID", userOwnID],
            following: ["followingID"],
            personalPosts: ["postID"],
            isPrivate: true,
        };

        const requestedUserDocRef = admin.firestore().doc("users/otherUserUID");
        await requestedUserDocRef.set(requestedUserDoc);

        const wrapped = test.wrap(myFunctions.infoUserCanView);
        const response = await wrapped({ data: { userOwnID: userOwnID, requestedUserID: requestedUserID } });

        expect(response.userInfo.personalPosts).to.deep.equal(["postID"]);
    });

    it("other info is returned", async () => {
        let requestedUserDoc = {
            username: "username",
            bio: "bio",
            userID: requestedUserID,
            followers: ["followerID"],
            following: ["followingID"],
            personalPosts: ["postID"],
            isPrivate: false,
        };

        const requestedUserDocRef = admin.firestore().doc("users/otherUserUID");
        await requestedUserDocRef.set(requestedUserDoc);

        const wrapped = test.wrap(myFunctions.infoUserCanView);
        const response = await wrapped({ data: { userOwnID: userOwnID, requestedUserID: requestedUserID } });

        expect(response.userInfo).to.deep.equal({
            username: "username",
            bio: "bio",
            userID: requestedUserID,
            followers: ["followerID"],
            following: ["followingID"],
            personalPostsLength: 1,
            personalPosts: ["postID"],
            isPrivate: false,
        });
    });
});