import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth, functions } from '../firebaseConf';
import { useNavigate } from 'react-router-dom';

import { httpsCallable } from 'firebase/functions';

function CreateUser() {
    const [username, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [userID, setUserID] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    const user = auth.currentUser;
    const navigate = useNavigate();

    const [userIDUnique, setUserIDUnique] = useState(false);
    const [listOfUserIDs, setListOfUserIDs] = useState([]);
    const getListOfUserIDs = httpsCallable(functions, 'getListOfUserIDs');

    const addUserID = httpsCallable(functions, 'addUserID');

    useEffect(() => {
        async function getUserIDs() {
            const result = await getListOfUserIDs({ ownUserID: null });
            setListOfUserIDs(result.data.listOfUserIDs);
        }
        getUserIDs();
    }, []);

    useEffect(() => {
        setUserIDUnique(!listOfUserIDs.includes(userID));
    }, [userID]);

    const handleSubmitUserInfo = async (e) => {
        e.preventDefault();

        const userDoc = {
            username: username,
            bio: bio,
            isPrivate: isPrivate,
            userID: userID,
            followers: [],
            followRequestsReceived: [],
            following: [],
            followRequestsSent: [],
            saved_posts: [],
            personal_posts: [],
            postsToView: []
        };

        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, userDoc);

        const result = await addUserID({ userID: userID, UID: user.uid });
        console.log(result.data.result);

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