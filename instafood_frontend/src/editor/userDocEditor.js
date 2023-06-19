import { functions, auth, db } from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * This class is created to edit a local copy of the user document. 
 * The changes are then pushed to the database using Firebase Cloud Functions.
 * 
 * This keeps the local copy out of sync with changes committed by other users,
 * preventing the UI from re-rendering haphazardly.
 * It also allows for the UI to be updated immediately, without waiting for the database to update,
 * minimising lags due to cold starts.
 * 
 * @class userDocEditor
 * @param {Object} initialState - The initial user document data
 * @param {Function} setState - The setState function to update the local copy 
 * 
 * @method removeFollower - Removes a follower from the user document
 * @method unfollow - Removes a user from the following list of the user document
 * @method answerFollowRequest - Adds a user to the following list of the user document if request is accepted, and removes the request from the follower's document
 * @method unsaveAPost - Removes a post from the savedPosts list of the user document
 * 
 */
class userDocEditor {

    constructor(initialState, setState) {
        this.state = initialState;
        this.setState = setState;
        this._bindFunctions();
    }

    /**
     * Binds all functions to the class instance. 
     * @private
     */
    _bindFunctions() {
        this.removeFollower = this.removeFollower.bind(this);
        this.unfollow = this.unfollow.bind(this);
        this.answerFollowRequest = this.answerFollowRequest.bind(this);
    }

    /**
     * @param {string} followerID 
     */
    removeFollower (followerID) {

        // Operations on the state
        this.setState( (prevState) => {
            const newFollowers = prevState.followers.filter(follower => follower !== followerID);
            return { 
                ...prevState,
                followers: newFollowers 
            };
        });

        // Operations on the database
        const removeFollowerFn = httpsCallable(functions, 'removeFollower');
        removeFollowerFn ({ followerUserID: followerID, followedUserID: this.state.userID });

    }

    /**
     * 
     * @param {string} followedID 
     */
    unfollow (followedID) {

        // Operations on the state
        this.setState( (prevState) => {
            const newFollowing = prevState.following.filter(following => following !== followedID);
            return {
                ...prevState,
                following: newFollowing
            };
        });

        // Operations on the database
        const unfollowFn = httpsCallable(functions, 'unfollow');
        unfollowFn ({ otherUserID: followedID, userOwnID: this.state.userID });

    }

    /**
     * 
     * @param {string} otherUserID 
     * @param {boolean} isAccepted 
     */
    answerFollowRequest (otherUserID, isAccepted) {

        // Operations on the state
        this.setState( (prevState) => {
            let newFollowers = prevState.followers;
            if (isAccepted) {
                newFollowers = [...prevState.followers, otherUserID];
            }

            const newFollowRequestsReceived = prevState.followRequestsReceived.filter(followRequest => followRequest !== otherUserID);
            return {
                ...prevState,
                followRequestsReceived: newFollowRequestsReceived,
                followers: newFollowers
            };
        });

        // Operations on the database
        const answerFollowRequestFn = httpsCallable(functions, 'answerFollowRequest');
        answerFollowRequestFn ({ followerUserID: otherUserID, followedUserID: this.state.userID, accept: isAccepted });

    }

}

export default userDocEditor;