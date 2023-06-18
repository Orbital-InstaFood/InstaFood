import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import DisplayPost from '../../functions/Post/DisplayPost';
import DisplayUserLink from '../../functions/DisplayUserLink';
import DisplayRequestReceived from './DisplayRequestReceived';
import DisplayFollowing from './DisplayFollowing';
import DisplayFollower from './DisplayFollower';

import listenerImplementer from '../../listeners/ListenerImplementer';

import userDocEditor from '../../editor/userDocEditor';

/*
Edits of followers, following to be updated in the backend database 
*/

function UserInfo() {

    // State for listeners
    const [userDocListener, setUserDocListener] = useState(null);

    // State for user info
    const [userDoc, setUserDoc] = useState(null);
    const [UserDocEditor, setUserDocEditor] = useState(null); 

    const [isLoading, setIsLoading] = useState(true);

    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(userDocListener);
    }

    function initializeUserDocAndEditor() {
        const userDoc = userDocListener.getCurrentDocument();  
        setUserDoc(userDoc);

        const UserDocEditor = new userDocEditor(userDoc, setUserDoc);
        setUserDocEditor(UserDocEditor);
    }

    useEffect(() => {
        setupListeners();
    }, []);

    useEffect(() => {

        // Check that the listener is fully set up before initializing userDoc and UserDocEditor
        if (userDocListener) {
            initializeUserDocAndEditor();
            setIsLoading(false);
        }

    }, [userDocListener]);

    if (isLoading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div>
            <h2>User Information</h2>
            <p>Username: {userDoc.username}</p>
            <p>Bio: {userDoc.bio}</p>
            <p>User ID: {userDoc.userID}</p>

            <Link to='/editProfile'>Edit Profile</Link>

            <p>Followers</p>
            {userDoc.followers.map(followerID => {
                return <DisplayFollower
                    otherUserID={followerID}
                    removeFollower={UserDocEditor.removeFollower}
                />
            })}

            <p>Following</p>
            {userDoc.following.map(followingID => {
                return <DisplayFollowing
                    otherUserID={followingID}
                    unfollow={UserDocEditor.unfollow}
                />
            })}

            <p>Follow Requests Received</p>
            {userDoc.followRequestsReceived.map(followRequestReceivedID => {
                return <DisplayRequestReceived
                    otherUserID={followRequestReceivedID}
                    answerFollowRequest={UserDocEditor.answerFollowRequest}
                />
            })}

            <p>Follow Requests Sent</p>
            {userDoc.followRequestsSent.map(followRequestSentID => {
                return <DisplayUserLink
                    userID={followRequestSentID}
                />
            })}

            <p>Personal Posts</p>
            {userDoc.personalPosts.map(postID => {
                return <DisplayPost
                    postID={postID}
                    userOwnID={userDoc.userID} />
            })}

            <p>Saved Posts</p>
            {userDoc.savedPosts.map(postID => {
                return <DisplayPost
                    postID={postID}
                    userOwnID={userDoc.userID} />
            })}

        </div>
    );
}

export default UserInfo;


