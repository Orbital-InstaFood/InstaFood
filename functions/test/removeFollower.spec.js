const { expect } = require("chai");
const admin = require("firebase-admin");
const test = require("./config");
const myFunctions = require("../index");

describe("removeFollower", () => {
    let followerUserID = "followerUserID";
    let followerUserUID = "followerUserUID";
    let followedUserID = "followedUserID";
    let followedUserUID = "followedUserUID";

    // UnrelatedIDs are used to test that the function does not remove unrelated data
    let initialFollowerUserDoc = {
        following: [followedUserID, "unrelatedUserID"],
        postsToView: ["postID", "unrelatedPostID"],
    };

    let initialFollowedUserDoc = {
        followers: [followerUserID, "unrelatedUserID"],
        personalPosts: ["postID"],
    };

    beforeEach(async () => {
        const followerUserUIDRef = admin.firestore().doc("backend_userID_UID/followerUserID");
        await followerUserUIDRef.set({
            UID: followerUserUID,
        });

        const followedUserUIDRef = admin.firestore().doc("backend_userID_UID/followedUserID");
        await followedUserUIDRef.set({
            UID: followedUserUID,
        });
    });


    beforeEach(async () => {
        const followerUserDocRef = admin.firestore().doc("users/followerUserUID");
        await followerUserDocRef.set(initialFollowerUserDoc);

        const followedUserDocRef = admin.firestore().doc("users/followedUserUID");
        await followedUserDocRef.set(initialFollowedUserDoc);
    });

    after(() => {
        test.cleanup();
    });

    it("terminates if no followedUserID provided", async () => {
        const wrapped = test.wrap(myFunctions.removeFollower);
        await wrapped({ data: { followerUserID: "followerUserID" } });

        // Test that database has not changed
        const followerUserDocRef = admin.firestore().doc("users/followerUserUID");
        const followerUserDoc = (await followerUserDocRef.get()).data();
        expect(followerUserDoc).to.deep.equal(initialFollowerUserDoc);

        const followedUserDocRef = admin.firestore().doc("users/followedUserUID");
        const followedUserDoc = (await followedUserDocRef.get()).data();
        expect(followedUserDoc).to.deep.equal(initialFollowedUserDoc);
    });

    it("terminates if no followerUserID provided", async () => {
        const wrapped = test.wrap(myFunctions.removeFollower);
        await wrapped({ data: { followedUserID: "followedUserID" } });

        // Test that database has not changed
        const followerUserDocRef = admin.firestore().doc("users/followerUserUID");
        const followerUserDoc = (await followerUserDocRef.get()).data();
        expect(followerUserDoc).to.deep.equal(initialFollowerUserDoc);

        const followedUserDocRef = admin.firestore().doc("users/followedUserUID");
        const followedUserDoc = (await followedUserDocRef.get()).data();
        expect(followedUserDoc).to.deep.equal(initialFollowedUserDoc);
    });

    it("removes follower from followed user's followers list", async () => {
        const wrapped = test.wrap(myFunctions.removeFollower);
        await wrapped({ data: { followerUserID, followedUserID } });

        const followedUserDocRef = admin.firestore().doc("users/followedUserUID");
        const followedUserDoc = (await followedUserDocRef.get()).data();
        expect(followedUserDoc.followers).to.deep.equal(["unrelatedUserID"]);
    });

    it("removes followed user from follower's following list", async () => {
        const wrapped = test.wrap(myFunctions.removeFollower);
        await wrapped({ data: { followerUserID, followedUserID } });

        const followerUserDocRef = admin.firestore().doc("users/followerUserUID");
        const followerUserDoc = (await followerUserDocRef.get()).data();
        expect(followerUserDoc.following).to.deep.equal(["unrelatedUserID"]);
    });

    it("removes followed user's posts from follower's postsToView list", async () => {
        const wrapped = test.wrap(myFunctions.removeFollower);
        await wrapped({ data: { followerUserID, followedUserID } });

        const followerUserDocRef = admin.firestore().doc("users/followerUserUID");
        const followerUserDoc = (await followerUserDocRef.get()).data();
        expect(followerUserDoc.postsToView).to.deep.equal(["unrelatedPostID"]);
    });

});



