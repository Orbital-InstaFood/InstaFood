import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import DisplayPostUI from '../../functions/Post/DisplayPostUI';
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

    // State for subscriptions
    const [savedPosts, setSavedPosts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(userDocListener);
    }

    function setupSubscriptions() {
        const unsubscribeFromSavedPosts =
            userDocListener.subscribeToField('savedPosts',
                (savedPosts) => {
                    setSavedPosts(savedPosts);
                });

        return () => {
            unsubscribeFromSavedPosts();
        }
    }

    function initializeUserDocAndEditor() {
        const userDoc = userDocListener.getCurrentDocument();
        setUserDoc(userDoc);

        const UserDocEditor = new userDocEditor(userDoc.userID, setUserDoc);
        setUserDocEditor(UserDocEditor);
    }

    useEffect(() => {
        setupListeners();
    }, []);

    useEffect(() => {

        // Check that the listener is fully set up before setting up subscriptions,
        // and initializing userDoc and UserDocEditor
        if (userDocListener) {
            const unsubscribeFromSavedPosts = setupSubscriptions();
            initializeUserDocAndEditor();
            setIsLoading(false);

            return () => {
                unsubscribeFromSavedPosts();
            }

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
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3 style={{ marginRight: '20px' }}>{userDoc.username}</h3>
                <Link
                    to="/editProfile"
                    style={{
                        padding: '5px 10px',
                        backgroundColor: 'red',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '1px',
                    }}
                >
                    Edit Profile
                </Link>
            </div>
            <p>Bio: {userDoc.bio}</p>
            <p>User ID: {userDoc.userID}</p>

            <Link to='/editProfile'>Edit Profile</Link>

            <p>{userDoc.followers.length} Followers</p>
            {userDoc.followers.map(followerID => {
                return <DisplayFollower
                    otherUserID={followerID}
                    removeFollower={UserDocEditor.removeFollower}
                />
            })}

            <p>{userDoc.following.length} Following</p>
            {userDoc.following.map(followingID => {
                return <DisplayFollowing
                    otherUserID={followingID}
                    unfollow={UserDocEditor.unfollow}
                />
            })}

            <p>{userDoc.followRequestsReceived.length} Follow Requests Received</p>
            {userDoc.followRequestsReceived.map(followRequestReceivedID => {
                return <DisplayRequestReceived
                    otherUserID={followRequestReceivedID}
                    answerFollowRequest={UserDocEditor.answerFollowRequest}
                />
            })}

            <p>{userDoc.followRequestsSent.length} Follow Requests Sent</p>
            {userDoc.followRequestsSent.map(followRequestSentID => {
                return <DisplayUserLink
                    userID={followRequestSentID}
                />
            })}

            <p>{userDoc.personalPosts.length} Posts</p>
            {userDoc.personalPosts.map(postID => {
                return <DisplayPostUI
                    postID={postID}
                    userOwnID={userDoc.userID}
                    isAPersonalPost={true}
                    isASavedPost={false}
                />
            })}

            <p>{savedPosts.length} Saved Posts</p>
            {savedPosts.map(postID => {
                return <DisplayPostUI
                    postID={postID}
                    userOwnID={userDoc.userID}
                    isAPersonalPost={false}
                    isASavedPost={true}
                />
            })}

        </div>
    );
}

export default UserInfo;


