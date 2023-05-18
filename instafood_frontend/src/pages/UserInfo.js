import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function UserInfo({ user }) {
    const [username, setUserName] = useState('');
    const [bio, setBio] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [userExists, setUserExists] = useState(null);
    const [userWantsToEdit, setUserWantsToEdit] = useState(false);
    const navigate = useNavigate();

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
    },[user.uid]);

    const handleSubmitUserInfo = async (e) => {
        e.preventDefault();

        const userDoc = {
            username: username,
            bio: bio,
            isPrivate: isPrivate,
            user_id: user.uid,
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


    function handleUserEdit () {
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
                type="checkbox"
                placeholder="Private"
                required
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <button onClick={handleSubmitUserInfo}>Submit</button>
        </div>
    );
}

export default UserInfo;


