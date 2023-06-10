import { auth } from "../firebaseConf";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

function SignInAfterEmailVerification() {
    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get("userEmail");
    const password = urlParams.get("password");

    // If user opens link on a different device, they will be prompted to sign in again
    // If user opens link on the same device, they will be signed in automatically

    useEffect(() => {
        signInWithEmailAndPassword(auth, userEmail, password)
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

                // Check userEmail or password is null
                if (userEmail === null || password === null) {
                    alert("Please sign in again.");
                }

            });
        navigate("/");
    }, []);
}

export default SignInAfterEmailVerification;