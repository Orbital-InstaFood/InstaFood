import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, functions } from "../firebaseConf";
import { httpsCallable } from "firebase/functions";

export default function CreateProfile() {
    const user = auth.currentUser;
    const [username, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [userID, setUserID] = useState("");

    const userIDsRef = doc(db, "lists", "userIDs");
    const [userIDUnique, setUserIDUnique] = useState(false);

    const createUserProfile = httpsCallable(functions, 'createUserProfile');
    const [creatingUserProfile, setCreatingUserProfile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkUserDocExists() {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                alert("You already have an account. Redirecting to home page with your account.");
                navigate("/dashboard");
                return;
            }
        }
        checkUserDocExists();
    }, []);


    useEffect(() => {
        async function checkUserIDUnique() {
            const snapshot = await getDoc(userIDsRef);
            const userIDs = snapshot.data().userIDs;
            if (!userIDs.includes(userID) && userID !== "") {
                setUserIDUnique(true);
            }
        }
        checkUserIDUnique();
    }, [userID]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreatingUserProfile(true);

        const result = await createUserProfile({
            UID: user.uid,
            username: username,
            bio: bio,
            isPrivate: isPrivate,
            userID: userID,
        })

        const userDocExists = result.data.userDocExists;

        // Additional check to prevent overwriting existing user doc
        if (userDocExists) {
            alert("You have already created a profile. Redirecting to home page with your account.");
            navigate("/dashboard");
            return;
        }

        setCreatingUserProfile(false);
        navigate("/dashboard");
    }

    if (creatingUserProfile) {
        return (
            <div>
                <p>Creating user profile...</p>
            </div>
        )
    }

    return (
        <div>
            <form onSubmit={handleCreate}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Required"
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
                        placeholder="Required"
                        required
                        value={userID}
                        onChange={(e) => setUserID(e.target.value)}
                    />
                </div>

                <div>
                    <label>Set as private</label>
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                </div>

                {
                    userIDUnique ? (
                        <div>
                            <p>User ID is available</p>
                            <button type="submit">CREATE A PROFILE</button>
                        </div>
                    )
                        : (<p>User ID already in use. Please pick a different user ID</p>)
                }
            </form>
        </div>
    )

}