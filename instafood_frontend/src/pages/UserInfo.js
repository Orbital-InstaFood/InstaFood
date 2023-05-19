import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function UserInfo() {
    const navigate = useNavigate();

    const [username, setUserName] = useState('');
    const [bio, setBio] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [userID, setUserID] = useState('');
    const [userIDUnique, setUserIDUnique] = useState(false);

    const [userExists, setUserExists] = useState(null);
    const [userWantsToEdit, setUserWantsToEdit] = useState(false);

    const user = auth.currentUser;

    // To move this to backend:
    const logicRef = doc(db, 'backend_logic', 'uXGhybdqAbR8zIDfaf7I');

    useEffect(() => {
        async function getUserInfo() {
            const userRef = doc(db, 'users', user.uid);
            const snapshot = await getDoc(userRef);
            if (snapshot.exists()) {
                const data = snapshot.data();
                setUserName(data.username);
                setBio(data.bio);
                setIsPrivate(data.isPrivate);
                setUserExists(true);
            } else {
                setUserExists(false);
            }
        }
        getUserInfo();
    }, [user.uid]);

    // To move this to backend:
    useEffect(() => {
        async function isUserIDUnique() {
            const logicSnapshot = await getDoc(logicRef);
            const logicData = logicSnapshot.data();
            const userIDs = logicData.userIDs;
            setUserIDUnique(!userIDs.includes(userID));
        }
        isUserIDUnique();
    }, [userID]);

    const handleSubmitUserInfo = async (e) => {
        e.preventDefault();

        const userDoc = {
            username: username,
            bio: bio,
            isPrivate: isPrivate,
            user_id: userID,
            followers: [],
            following: [],
            saved_posts: [],
            personal_posts: [],
        };

        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, userDoc);

        console.log('User created/updated successfully!');
        navigate('/');
    };

    if (userExists === null) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }


    function handleUserEdit() {
        setUserWantsToEdit(true);
    }

    if (userExists && !userWantsToEdit) {
        return (
            <div>
                <h2>User Information</h2>
                <p>Username: {username}</p>
                <p>Bio: {bio}</p>
                <p>Private: {isPrivate.toString()}</p>
                <button onClick={handleUserEdit}>Edit</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Create User</h2>
            <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />
            <input
                type="text"
                placeholder="User ID"
                required
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
            />
            <input
                type="checkbox"
                placeholder="Private"
                required
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
            />
            {
                userIDUnique ?
                    <div>
                        <p>User ID is unique!</p>
                        <button onClick={handleSubmitUserInfo}>Submit</button>
                    </div>
                    : <p>User ID is not unique!</p>
            }
        </div>
    );
}

export default UserInfo;


