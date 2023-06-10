import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { auth, db, functions } from "../firebaseConf";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import SendEmailVerification from "./sendEmailVerification";
import { doc, getDoc } from 'firebase/firestore';

import { httpsCallable } from 'firebase/functions';

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [userID, setUserID] = useState("");

    const userIDsRef = doc(db, "lists", "userIDs");
    const [userIDUnique, setUserIDUnique] = useState(false);

    const createUserProfile = httpsCallable(functions, 'createUserProfile');
    const navigate = useNavigate();

    // Retrieve list of existing userIDs 
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

    const handleSignup = (e) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email, password)
            .then( async () => {
                const user = auth.currentUser;

                createUserProfile({
                    UID: user.uid,
                    username: username,
                    bio: bio,
                    isPrivate: isPrivate,
                    userID: userID,
                })

                // Send email verification
                await SendEmailVerification(email, password);
                signOut(auth);
                navigate("/");
            })

            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    alert("Email already in use. Please use a different email address.");
                }

                if (error.code === "auth/invalid-email") {
                    alert("Invalid email address.");
                }

                if (error.code === "auth/weak-password") {
                    alert("Password must be at least 6 characters.");
                }

                // missing password
                if (error.code === "auth/missing-password") {
                    alert("Please enter a password.");
                }

                navigate("/signup");
            });
    }

    return (
        <div>
            <form onSubmit={handleSignup}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Required"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Required"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

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
                            <button type="submit">Sign Up</button>
                        </div>
                    )
                        : (<p>User ID already in use. Please pick a different user ID</p>)
                }
            </form>

            <div>
                <Link to="/">Return to Login</Link>
            </div>

        </div>

    );
}

export default Signup;
