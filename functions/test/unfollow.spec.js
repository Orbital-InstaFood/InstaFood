const { expect } = require("chai");
const admin = require("firebase-admin");
const test = require("./config");
const myFunctions = require("../index");

describe("unfollow", () => {

    const userOwnID = "userOwnID";
    const userOwnUID = "userOwnUID";
    const otherUserID = "otherUserID";
    const otherUserUID = "otherUserUID";

    // UnrelatedIDs are used to test that the function does not remove unrelated data
    let initialUserDoc = {
        following: [otherUserID, "unrelatedUserID"],
        postsToView: ["postID","unrelatedPostID"],
    };

    let initialOtherUserDoc = {
        followers: [userOwnID, "unrelatedUserID"],
        personalPosts: ["postID"],
    };

    beforeEach(async () => {

        const userUIDRef = admin.firestore().doc("backend_userID_UID/userOwnID");
        await userUIDRef.set({
            UID: userOwnUID,
        });

        const otherUserUIDRef = admin.firestore().doc("backend_userID_UID/otherUserID");
        await otherUserUIDRef.set({
            UID: otherUserUID,
        });

        const userDocRef = admin.firestore().doc("users/userOwnUID");
        await userDocRef.set(initialUserDoc);

        const otherUserDocRef = admin.firestore().doc("users/otherUserUID");
        await otherUserDocRef.set(initialOtherUserDoc);
    });

    after(() => {
        test.cleanup();
    });

    it("terminates if no otherUserID provided", async () => {
        const wrapped = test.wrap(myFunctions.unfollow);
        await wrapped({ data: { userOwnID: "userOwnID" } });

        // Test that database has not changed
        const userDocRef = admin.firestore().doc("users/userOwnUID");
        const userDoc = (await userDocRef.get()).data();
        expect(userDoc).to.deep.equal(initialUserDoc);

        const otherUserDocRef = admin.firestore().doc("users/otherUserUID");
        const otherUserDoc = (await otherUserDocRef.get()).data();
        expect(otherUserDoc).to.deep.equal(initialOtherUserDoc);
    });

    it("terminates if no userOwnID provided", async () => {
        const wrapped = test.wrap(myFunctions.unfollow);
        await wrapped({ data: { otherUserID: "otherUserID" } });

        // Test that database has not changed
        const userDocRef = admin.firestore().doc("users/userOwnUID");
        const userDoc = (await userDocRef.get()).data();
        expect(userDoc).to.deep.equal(initialUserDoc);

        const otherUserDocRef = admin.firestore().doc("users/otherUserUID");
        const otherUserDoc = (await otherUserDocRef.get()).data();
        expect(otherUserDoc).to.deep.equal(initialOtherUserDoc);
    });

    it("removes otherUserID from userOwnID's following list", async () => {
        const wrapped = test.wrap(myFunctions.unfollow);
        await wrapped({ data: { userOwnID, otherUserID } });

        // Test that database has changed
        const userDocRef = admin.firestore().doc("users/userOwnUID");
        const userDoc = (await userDocRef.get()).data();
        expect(userDoc.following).to.deep.equal(["unrelatedUserID"]);
    });

    it("removes userOwnID from otherUserID's followers list", async () => {
        const wrapped = test.wrap(myFunctions.unfollow);
        await wrapped({ data: { userOwnID, otherUserID } });

        // Test that database has changed
        const otherUserDocRef = admin.firestore().doc("users/otherUserUID");
        const otherUserDoc = (await otherUserDocRef.get()).data();
        expect(otherUserDoc.followers).to.deep.equal(["unrelatedUserID"]);
    });

    it("removes posts from userOwnID's postsToView list", async () => {
        const wrapped = test.wrap(myFunctions.unfollow);
        await wrapped({ data: { userOwnID, otherUserID } });

        // Test that database has changed
        const userDocRef = admin.firestore().doc("users/userOwnUID");
        const userDoc = (await userDocRef.get()).data();
        expect(userDoc.postsToView).to.deep.equal(["unrelatedPostID"]);
    });

});