import { httpsCallable } from 'firebase/functions';
import userDocEditor from './userDocEditor';

jest.mock('firebase/functions', () => {
    return {
        getFunctions: jest.fn(),
        httpsCallable: jest.fn(),
    };
});

describe('userDocEditor', () => {

    let userDocEditorInstance;
    let userID = 'mockUserID';
    let setState = jest.fn();

    beforeEach(() => {
        userDocEditorInstance = new userDocEditor(userID, setState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('removeFollower', () => {

        it('should remove the followerID from the followers array', () => {
            httpsCallable.mockReturnValueOnce(() => { });
            const followerID = 'mockFollowerID';
            userDocEditorInstance.removeFollower(followerID);

            const prevState = {
                followers: [followerID],
            };

            const expectedState = {
                followers: [],
            };

            const functionToTest = userDocEditorInstance.setState.mock.calls[0][0];
            const newState = functionToTest(prevState);

            expect(newState).toEqual(expectedState);
        });

    });

    describe('unfollow', () => {

        it('should remove the followedID from the following array', () => {
            httpsCallable.mockReturnValueOnce(() => { });
            const followedID = 'mockFollowedID';
            userDocEditorInstance.unfollow(followedID);

            const prevState = {
                following: [followedID],
            };

            const expectedState = {
                following: [],
            };

            const functionToTest = userDocEditorInstance.setState.mock.calls[0][0];
            const newState = functionToTest(prevState);

            expect(newState).toEqual(expectedState);
        });

    });

    describe('answerFollowRequest', () => {

        it('should add the otherUserID to the followers array if isAccepted is true', () => {
            httpsCallable.mockReturnValueOnce(() => { });
            const otherUserID = 'mockOtherUserID';
            const isAccepted = true;
            userDocEditorInstance.answerFollowRequest(otherUserID, isAccepted);

            const prevState = {
                followRequestsReceived: [otherUserID],
                followers: [],
            };

            const expectedState = {
                followRequestsReceived: [],
                followers: [otherUserID],
            };

            const functionToTest = userDocEditorInstance.setState.mock.calls[0][0];
            const newState = functionToTest(prevState);

            expect(newState).toEqual(expectedState);
        });

        it('should not add the otherUserID to the followers array if isAccepted is false', () => {
            httpsCallable.mockReturnValueOnce(() => { });
            const otherUserID = 'mockOtherUserID';
            const isAccepted = false;
            userDocEditorInstance.answerFollowRequest(otherUserID, isAccepted);

            const prevState = {
                followRequestsReceived: [otherUserID],
                followers: [],
            };

            const expectedState = {
                followRequestsReceived: [],
                followers: [],
            };

            const functionToTest = userDocEditorInstance.setState.mock.calls[0][0];
            const newState = functionToTest(prevState);

            expect(newState).toEqual(expectedState);
        });
    });

});
