import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, functions } from "../../firebaseConf";
import { httpsCallable } from "firebase/functions";

import listenerImplementer from "../../listeners/ListenerImplementer";

export default function CreateProfile() {

    const user = auth.currentUser;

    const navigate = useNavigate();

    const [username, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [userID, setUserID] = useState("");

    const [userIDsListener, setUserIDsListener] = useState(null);
    const [existingUserIDs, setExistingUserIDs] = useState([]);
    const [isUniqueUserID, setIsUniqueUserID] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingUserProfile, setIsCreatingUserProfile] = useState(false);

    const createUserProfile = httpsCallable(functions, 'createUserProfile');

    async function checkIfUserDocAlreadyExists() {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            alert("You already have an account. Redirecting to home page with your account.");
            navigate("/dashboard");
            return;
        }
    }

    async function setupListeners() {
        const userIDsListener = await listenerImplementer.getListOfUserIDsListener();
        setUserIDsListener(userIDsListener);
    }

    function setupSubscriptions() {

        const unsubscribeFromUserIDs =
            userIDsListener.subscribeToField('userIDs',
                (userIDs) => {
                    setExistingUserIDs(userIDs);
                }
            );

        return () => {
            unsubscribeFromUserIDs();
        }
    }

    useEffect(() => {
        async function setup() {
            await checkIfUserDocAlreadyExists();
            await setupListeners();
        }
        setup();
    }, []);

    /**
     * This useEffect is used to setup subscriptions to the userIDsListener.
     * It is only run once the userIDsListener is set in the previous useEffect.
     */
    useEffect(() => {
        if (userIDsListener) {
            const unsubscribeFromUserIDs = setupSubscriptions();
            setIsLoading(false);
            return () => {
                unsubscribeFromUserIDs();
            }
        }
    }, [userIDsListener]);

    useEffect(() => {
        if (existingUserIDs.includes(userID) || userID === "") {
            setIsUniqueUserID(false);
        } else {
            setIsUniqueUserID(true);
        }
    }, [userID, existingUserIDs]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsCreatingUserProfile(true);

        await createUserProfile({
            UID: user.uid,
            username: username,
            bio: bio,
            isPrivate: isPrivate,
            userID: userID,
        });

        setIsCreatingUserProfile(false);
        navigate("/dashboard");
    }

    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }

    if (isCreatingUserProfile) {
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
                    isUniqueUserID ? (
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