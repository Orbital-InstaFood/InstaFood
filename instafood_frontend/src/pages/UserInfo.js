import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConf';

import DisplayPost from '../functions/DisplayPost';
import DisplayArray from '../functions/DisplayArray';
import DisplayUserLink from '../functions/DisplayUserLink';
import DisplayRequestReceived from '../functions/DisplayRequestReceived';
import DisplayFollowing from '../functions/DisplayFollowing';
import DisplayFollower from '../functions/DisplayFollower';

/*
Edits of followers, following to be updated in the backend database 
*/

function UserInfo() {
    const navigate = useNavigate();

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

    const [userExists, setUserExists] = useState(null);
    const [userWantsToEdit, setUserWantsToEdit] = useState(false);

    const user = auth.currentUser;

    useEffect(() => {
        async function getUserInfo() {

            const userRef = doc(db, 'users', user.uid);
            const snapshot = await getDoc(userRef);

            if (snapshot.exists()) {
                const data = snapshot.data();

                setUserName(data.username);
                setBio(data.bio);
                setIsPrivate(data.isPrivate);
                setUserID(data.userID);
                setFollowers(data.followers);
                setFollowing(data.following);
                setFollowRequestsReceived(data.followRequestsReceived);
                setFollowRequestsSent(data.followRequestsSent);
                setSavedPosts(data.savedPosts);
                setPersonalPosts(data.personalPosts);

                setUserExists(true);

            } else {
                setUserExists(false);
            }
        }
        getUserInfo();
    }, []);

    const handleSubmitUserInfo = async (e) => {
        e.preventDefault();

        const userRef = doc(db, 'users', user.uid);

        await updateDoc(userRef, {
            username: username,
            bio: bio,
            isPrivate: isPrivate,
        });

        console.log('User updated successfully!');
        navigate('/dashboard');
    };

    const handleFollowerRemoved = (otherUserID) => {
        setFollowers(followers.filter((id) => id !== otherUserID));
    };

    const handleFollowingRemoved = (otherUserID) => {
        setFollowing(following.filter((id) => id !== otherUserID));
    };

    const handleFollowRequestAnswered = (otherUserID, accept) => {
        if (accept) {
            setFollowers([...followers, otherUserID]);
        }
        setFollowRequestsReceived(followRequestsReceived.filter((id) => id !== otherUserID));
    };

    if (userExists === null) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!userWantsToEdit) {
        return (
            <div>
                <h2>User Information</h2>
                <p>Username: {username}</p>
                <p>Bio: {bio}</p>
                <p>Private: {isPrivate.toString()}</p>
                <p>User ID: {userID}</p>

                <p>Followers</p>
                <DisplayArray array={followers} displayObjectFunc={c => {
                    return <DisplayFollower
                        otherUserID={c}
                        userOwnID={userID}
                        onFollowerRemoved={handleFollowerRemoved} />
                }} />

                <p>Following</p>
                <DisplayArray array={following} displayObjectFunc={c => {
                    return <DisplayFollowing
                        otherUserID={c}
                        userOwnID={userID}
                        onFollowingRemoved={handleFollowingRemoved} />
                }} />

                <p>Follow Requests Received</p>
                <DisplayArray array={followRequestsReceived} displayObjectFunc={c => {
                    return <DisplayRequestReceived
                        otherUserID={c}
                        userOwnID={userID}
                        onFollowRequestAnswered={handleFollowRequestAnswered} />
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

                <button
                    onClick={() => {
                        setUserWantsToEdit(true);
                    }}
                >
                    Edit User Information
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2>Edit User Information</h2>

            <div>
                <label>Username</label>
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>

            <div>
                <label>Bio</label>
                <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>

            <div>
                <label>Set as private</label>
                <input
                    type="checkbox"
                    required
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                />
            </div>

            <button onClick={handleSubmitUserInfo}>Submit</button>

        </div>
    );
}

export default UserInfo;


