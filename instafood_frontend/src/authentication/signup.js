import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConf";
import { signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword} from "firebase/auth";
import SendEmailVerification from "./sendEmailVerification";
import { useState } from "react";

export default function SignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLoginWithGoogle = (e) => {
        e.preventDefault();

        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                navigate("/dashboard");
            })
    }

    const handleSignup = (e) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email, password)
            .then(async () => {

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

                if (error.code === "auth/missing-password") {
                    alert("Please enter a password.");
                }

                navigate("/signup");
            });
    }
    return (
        <div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleSignup}>SIGN UP</button>

            <div>
                <p>
                    OR
                </p>
                <button onClick={handleLoginWithGoogle}>CONTINUE WITH GOOGLE</button>
            </div>

            <div>
                <p> Already have an account? <Link to="/">LOG IN</Link></p>
            </div>
        </div>
    );
}