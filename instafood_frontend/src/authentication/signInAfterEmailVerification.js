import { auth } from "../firebaseConf";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

/**
 * This component is used to sign in a user after they have verified their email address.
 * If the user opens the link on the same device, they will be signed in automatically.
 * If the user opens the link on a different device, they will be prompted to sign in again.
 */
export default function SignInAfterEmailVerification() {
    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get("userEmail");
    const password = urlParams.get("password");

    useEffect(() => {
        signInWithEmailAndPassword(auth, userEmail, password)
            .then((userCredential) => {

                if (userCredential.user.emailVerified) {
                    navigate("/dashboard");
                    return;
                }

                alert("Please verify your email address before logging in.");
                signOut(auth);
                navigate("/");
            })

            .catch((error) => {
                if (userEmail === null || password === null) {
                    alert("Please sign in again.");
                } else {
                    alert(error.code);
                }
                navigate("/");
            });
    }, []);
}