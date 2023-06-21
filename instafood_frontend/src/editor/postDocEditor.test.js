import { httpsCallable } from 'firebase/functions';
import postDocEditor from './postDocEditor';

jest.mock('firebase/functions', () => {
    return {
        getFunctions: jest.fn(),
        httpsCallable: jest.fn(),
    };
});

describe('postDocEditor', () => {
    let postDocEditorInstance;
    let postID = 'mockPostID';
    let setPostDoc = jest.fn();
    let userOwnID = 'mockUserOwnID';

    beforeEach(() => {
        postDocEditorInstance = new postDocEditor(postID, setPostDoc, userOwnID);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // httpsCallable mock returns a function in each test,
    // disabling the cloud function call
    describe('likeOrDislike', () => {

        it('should add the userOwnID to the likes array if isLiked is true', () => {
            httpsCallable.mockReturnValueOnce(() => { });
            const isLiked = true;
            postDocEditorInstance.likeOrDislike(isLiked);

            const prevState = {
                likes: [],
            };

            const expectedState = {
                likes: [userOwnID],
            };

            const functionToTest = postDocEditorInstance.setPostDoc.mock.calls[0][0];
            const newState = functionToTest(prevState);

            expect(newState).toEqual(expectedState);
        });

        it('should remove the userOwnID from the likes array if isLiked is false', () => {
            httpsCallable.mockReturnValueOnce(() => { });
            const isLiked = false;
            postDocEditorInstance.likeOrDislike(isLiked);

            const prevState = {
                likes: [userOwnID],
            };

            const expectedState = {
                likes: [],
            };

            const functionToTest = postDocEditorInstance.setPostDoc.mock.calls[0][0];
            const newState = functionToTest(prevState);

            expect(newState).toEqual(expectedState);
        });
    });

    describe('makeComment', () => {

        it('should add the comment to the comments array', () => {
            httpsCallable.mockReturnValueOnce(() => { });
            const comment = 'mockComment';
            postDocEditorInstance.makeComment(comment);

            const prevState = {
                comments: [],
            };

            const expectedState = {
                comments: [comment],
            };

            const functionToTest = postDocEditorInstance.setPostDoc.mock.calls[0][0];
            const newState = functionToTest(prevState);

            expect(newState).toEqual(expectedState);
        });

    });

    describe('deleteComment', () => {

        it('should remove the comment from the comments array', () => {
            httpsCallable.mockReturnValueOnce(() => { });
            const comment = {
                commentID: 'mockCommentID',
                commenterID: 'mockCommenterID',
                commentText: 'mockCommentText',
            }

            postDocEditorInstance.deleteComment(comment.commentID);

            const prevState = {
                comments: [comment],
            };

            const expectedState = {
                comments: [],
            };

            const functionToTest = postDocEditorInstance.setPostDoc.mock.calls[0][0];
            const newState = functionToTest(prevState);

            expect(newState).toEqual(expectedState);
        });

    });

});

