import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, functions } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

import { httpsCallable } from 'firebase/functions';

/*
Unique userIDs are stored in the backend database.
*/

function CreateUser() {
    const [username, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [userID, setUserID] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    const user = auth.currentUser;

    const navigate = useNavigate();

    const [userIDUnique, setUserIDUnique] = useState(false);

    const addUserID = httpsCallable(functions, 'addUserID');

    const uniqueIDsRef = doc(db, 'backend', "uniqueIDsDoc");

    useEffect(() => {
        async function isUserIDUnique() {
            const uniqueIDsDoc = await getDoc(uniqueIDsRef);
            const userIDs = uniqueIDsDoc.data().uniqueIDs;
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

        await addUserID({ userID: userID });
        console.log('User created successfully!');
        navigate('/');
    };

    return (
        <div>
            <h2>Create User</h2>
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
                <p>UserID cannot be changed later</p>
                <label>User ID</label>
                <input
                    type="text"
                    required
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
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

            {
                userIDUnique ? (
                    <div>
                        <p>User ID is unique!</p>
                        <button onClick={handleSubmitUserInfo}>Submit</button>
                    </div>
                )
                    : (<p>User ID is not unique!</p>)
            }

        </div>
    )

}

export default CreateUser;