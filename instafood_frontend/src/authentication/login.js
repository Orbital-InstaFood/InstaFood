import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConf";
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import SendEmailVerification from "./sendEmailVerification";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user && user.emailVerified) {
                navigate("/dashboard");
            }
        });
    }, []);

    const handleLoginWithGoogle = (e) => {
        e.preventDefault();

        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                navigate("/dashboard");
            }
            )
    }

    const handleLogin = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)

            .then(async (userCredential) => {
                // Check that email address is verified
                const user = userCredential.user;
                if (!user.emailVerified) {
                    if (window.confirm("Email address not verified. Please verify your email address before logging in. Resend verification email?")) {
                        await SendEmailVerification(email, password);
                    }
                    signOut(auth);
                } else {
                    navigate("/dashboard")
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
        <div>
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

            <div>
                <Link to="/forgotPassword">Forgot your password?</Link>
            </div>
            <button onClick={handleLogin}>LOG IN</button>

            <div>
                <p>
                    OR
                </p>
                <button onClick={handleLoginWithGoogle}>CONTINUE WITH GOOGLE</button>
            </div>

            <div>
                <p> Don't have an account? <Link to="/signup">SIGN UP FOR INSTAFOOD</Link></p>
            </div>

        </div>
    );
}

export default Login;
