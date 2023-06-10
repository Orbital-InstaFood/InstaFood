import { Link } from "react-router-dom";
import { useState } from "react";

import { auth } from "../firebaseConf";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Check that email address is verified
                if (!userCredential.user.emailVerified) {
                    alert("Please verify your email address before logging in.");
                    signOut(auth);
                }
            })
            .catch((error) => {
                if (error.code === "auth/invalid-email") {
                    alert("Invalid email address.");
                }

                if (error.code === "auth/user-not-found") {
                    alert("You do not have an account. Please create an account.");
                }

                if (error.code === "auth/wrong-password") {
                    alert("Incorrect password.");
                }
            });
    }

    return (
        <div className="login-container">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <div>
                <Link to="/signup">Create Account</Link>
            </div>
        </div>
    );
}

export default Login;
