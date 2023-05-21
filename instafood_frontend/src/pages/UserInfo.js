import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db, auth } from '../firebase';
import displayArray from '../functions/displayArray';

import CreateUser from './createUser';

function UserInfo() {
    const navigate = useNavigate();

    const [username, setUserName] = useState('');
    const [bio, setBio] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [userID, setUserID] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [personalPosts, setPersonalPosts] = useState([]);

    const [userExists, setUserExists] = useState(null);
    const [userWantsToEdit, setUserWantsToEdit] = useState(false);

    const user = auth.currentUser;

    function confirmation(array, setArray, item, message) {
        if (window.confirm(message)) {
            const index = array.indexOf(item);
            if (index > -1) {
                const newArray = array.filter((element) => (element !== item));
                setArray(newArray);
            }
        }
    }

    function displayAndSelectToDelete(array, setArray, message) {
        return array.map((item) => {
            return (
                <div>
                    <ul>
                        <p>{item}</p>
                        <button
                            onClick={() => confirmation(array, setArray, item, message)}>
                            Delete
                        </button>
                    </ul>
                </div>
            );
        });
    }

    useEffect(() => {
        async function getUserInfo() {
            const userRef = doc(db, 'users', user.uid);
            const snapshot = await getDoc(userRef);

            if (snapshot.exists()) {
                const data = snapshot.data();

                setUserName(data.username);
                setBio(data.bio);
                setIsPrivate(data.isPrivate);
                setUserID(data.user_id);
                setFollowers(data.followers);
                setFollowing(data.following);
                setSavedPosts(data.saved_posts);
                setPersonalPosts(data.personal_posts);

                setUserExists(true);

            } else {
                setUserExists(false);
            }
        }
        getUserInfo();
    }, [user.uid]);

    const handleSubmitUserInfo = async (e) => {
        e.preventDefault();

        const userDoc = {
            username: username,
            bio: bio,
            isPrivate: isPrivate,
            followers: followers,
            following: following,
            saved_posts: savedPosts,
            personal_posts: personalPosts,
        };

        const userRef = doc(db, 'users', user.uid);

        await updateDoc(userRef, userDoc);
        console.log('User updated successfully!');
        navigate('/');
    };

    if (userExists === null) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!userExists) {
        return (
            <CreateUser />
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
                {displayArray(followers, 'Followers')}
                {displayArray(following, 'Following')}
                {displayArray(savedPosts, 'Saved Posts')}
                {displayArray(personalPosts, 'Personal Posts')}

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

            {followers.length > 0 && (
                <div>
                    <label>Followers</label>
                    {displayAndSelectToDelete(followers, setFollowers, 'Are you sure you want to remove this follower?')}
                </div>
            )}

            {following.length > 0 && (
                <div>
                    <label>Following</label>
                    {displayAndSelectToDelete(following, setFollowing, 'Are you sure you want to unfollow this user?')}
                </div>
            )}

            {savedPosts.length > 0 && (
                <div>
                    <label>Saved Posts</label>
                    {displayAndSelectToDelete(savedPosts, setSavedPosts, 'Are you sure you want to remove this saved post?')}
                </div>
            )}

            {personalPosts.length > 0 && (
                <div>
                    <label>Personal Posts</label>
                    {displayAndSelectToDelete(personalPosts, setPersonalPosts, 'Are you sure you want to delete this post?')}
                </div>
            )}

            <button onClick={handleSubmitUserInfo}>Submit</button>

        </div>
    );
}

export default UserInfo;


