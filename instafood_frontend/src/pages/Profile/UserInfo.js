import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import DisplayPost from '../../functions/DisplayPost';
import DisplayArray from '../../functions/DisplayArray';
import DisplayUserLink from '../../functions/DisplayUserLink';
import DisplayRequestReceived from './DisplayRequestReceived';
import DisplayFollowing from './DisplayFollowing';
import DisplayFollower from './DisplayFollower';

import listenerImplementer from '../../listeners/ListenerImplementer';

/*
Edits of followers, following to be updated in the backend database 
*/

function UserInfo() {

    // State for listeners
    const [userDocListener, setUserDocListener] = useState(null);

    // State for subscriptions to fields in the user document
    const [username, setUserName] = useState('');
    const [bio, setBio] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [userID, setUserID] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followRequestsReceived, setFollowRequestsReceived] = useState([]);
    const [followRequestsSent, setFollowRequestsSent] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [personalPosts, setPersonalPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(userDocListener);
    }

    function initializeUserInfo() {
        const userDoc = userDocListener.getCurrentDocument();

        setUserName(userDoc.username);
        setBio(userDoc.bio);
        setIsPrivate(userDoc.isPrivate);
        setUserID(userDoc.userID);
        setFollowers(userDoc.followers);
        setFollowing(userDoc.following);
        setFollowRequestsReceived(userDoc.followRequestsReceived);
        setFollowRequestsSent(userDoc.followRequestsSent);
        setSavedPosts(userDoc.savedPosts);
        setPersonalPosts(userDoc.personalPosts);

    }

    function setupSubscriptions() {
        const unsubscribeFromFollowers =
            userDocListener.subscribeToField('followers',
                (followers) => {
                    setFollowers(followers);
                });

        const unsubscribeFromFollowing =
            userDocListener.subscribeToField('following',
                (following) => {
                    setFollowing(following);
                });

        const unsubscribeFromFollowRequestsReceived =
            userDocListener.subscribeToField('followRequestsReceived',
                (followRequestsReceived) => {
                    setFollowRequestsReceived(followRequestsReceived);
                });

        return () => {
            unsubscribeFromFollowers();
            unsubscribeFromFollowing();
            unsubscribeFromFollowRequestsReceived();
        }
    };

    useEffect(() => {
        setupListeners();
    }, []);

    useEffect(() => {
        // Check that the listener is fully set up before initializing the user info and subscriptions
        if (userDocListener) {

            initializeUserInfo();
            const unsubscribeFromAllFields = setupSubscriptions();
            setLoading(false);

            // Return the unsubscribe function to ensure that the subscriptions are removed when the component is unmounted
            return () => {
                unsubscribeFromAllFields();
            }

        }
    }, [userDocListener]);

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div>
            <h2>User Information</h2>
            <p>Username: {username}</p>
            <p>Bio: {bio}</p>
            <p>Private: {isPrivate.toString()}</p>
            <p>User ID: {userID}</p>

            <Link to='/editProfile'>Edit Profile</Link>

            <p>Followers</p>
            <DisplayArray array={followers} displayObjectFunc={c => {
                return <DisplayFollower
                    otherUserID={c}
                    userOwnID={userID}
                />
            }} />

            <p>Following</p>
            <DisplayArray array={following} displayObjectFunc={c => {
                return <DisplayFollowing
                    otherUserID={c}
                    userOwnID={userID}
                />
            }} />

            <p>Follow Requests Received</p>
            <DisplayArray array={followRequestsReceived} displayObjectFunc={c => {
                return <DisplayRequestReceived
                    otherUserID={c}
                    userOwnID={userID}
                />
            }} />

            <p>Follow Requests Sent</p>
            <DisplayArray array={followRequestsSent} displayObjectFunc={DisplayUserLink} />

            <p>Personal Posts</p>
            <DisplayArray array={personalPosts} displayObjectFunc={c => {
                return <DisplayPost
                    postID={c}
                    userOwnID={userID}
                />
            }} />

            <p>Saved Posts</p>
            <DisplayArray array={savedPosts} displayObjectFunc={c => {
                return <DisplayPost
                    postID={c}
                    userOwnID={userID}
                />
            }} />
        </div>
    );
}

export default UserInfo;


