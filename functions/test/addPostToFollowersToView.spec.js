const { expect } = require("chai");
const admin = require("firebase-admin");
const test = require("./config");
const myFunctions = require("../index");

describe("addPostToFollowersToView", () => {
    const postID = "postID";
    const creatorUID = "creatorUID";

    const creatorUserDoc = {
        followers: ["follower1UserID", "follower2UserID"],
    };

    const follower1UserDoc = {
        postsToView: [],
    };

    const follower2UserDoc = {
        postsToView: [],
    };

    beforeEach(async () => {
        const creatorUserDocRef = admin.firestore().doc("users/creatorUID");
        await creatorUserDocRef.set(creatorUserDoc);

        const follower1UserDocRef = admin.firestore().doc("users/follower1UID");
        await follower1UserDocRef.set(follower1UserDoc);

        const follower2UserDocRef = admin.firestore().doc("users/follower2UID");
        await follower2UserDocRef.set(follower2UserDoc);

        const userIDuidRef = admin.firestore().doc("backend_userID_UID/follower1UserID");
        await userIDuidRef.set({
            UID: "follower1UID",
        });

        const userIDuidRef2 = admin.firestore().doc("backend_userID_UID/follower2UserID");
        await userIDuidRef2.set({
            UID: "follower2UID",
        });
    });

    after(() => {
        test.cleanup();
    });

    it("adds postID to postsToView of all followers", async () => {
        const wrapped = test.wrap(myFunctions.addPostToFollowersToView);
        await wrapped({ data: { postID: postID, creatorUID: creatorUID } });

        const follower1UserDocRef = admin.firestore().doc("users/follower1UID");
        const follower1UserDoc = (await follower1UserDocRef.get()).data();
        expect(follower1UserDoc.postsToView).to.deep.equal([postID]);

        const follower2UserDocRef = admin.firestore().doc("users/follower2UID");
        const follower2UserDoc = (await follower2UserDocRef.get()).data();
        expect(follower2UserDoc.postsToView).to.deep.equal([postID]);
    });
});