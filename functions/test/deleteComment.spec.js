const { expect } = require("chai");
const admin = require("firebase-admin");
const test = require("./config");
const myFunctions = require("../index");

describe("deleteComment", () => {

    after(() => {
        test.cleanup();
    });

    it("delete the comment specified", async () => {

        const postID = "postID";
        const commentIDOfCommentToDelete = "commentIDOfCommentToDelete";

        const initialPostDoc = {
            comments: [
                { commentID: commentIDOfCommentToDelete },
                { commentID: "unrelatedCommentID" }
            ],
        };

        const postDocRef = admin.firestore().doc(`posts/${postID}`);
        await postDocRef.set(initialPostDoc);

        const wrapped = test.wrap(myFunctions.deleteComment);
        await wrapped({ data: { postID: postID, commentID: commentIDOfCommentToDelete } });

        const finalPostDoc = (await postDocRef.get()).data();
        expect(finalPostDoc.comments).to.deep.equal([{ commentID: "unrelatedCommentID" }]);
    });
});