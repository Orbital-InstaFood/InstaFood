import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, functions } from "../firebaseConf";
import {
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import SendEmailVerification from "./sendEmailVerification";

import getFCMToken from '../firebase/notification';
import { httpsCallable } from "firebase/functions";

/**
 * Custom hook for authentication
 * The following functions are available:
 * @function handleGoogle - sign in with Google
 * @function handleLogin - sign in with email and password
 * @function handleSignup - sign up with email and password
 * @function handleLogout - sign out
 * @function handleSendPasswordResetEmail - send password reset email
 */
export default function useAuth() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => { });
    return () => unsubscribe();
  }, []);

  const handleGoogle = (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => { navigate("/dashboard") })
      .catch((error) => {
        if (error.code === "auth/popup-closed-by-user") {
          return;
        }
        alert(error.code)
      });

  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        if (userCredential.user.emailVerified) {

          try {
            await getFCMToken(auth.currentUser.uid);
            navigate("/dashboard");
          } catch (error) {
            console.log("Error updating fcmToken: ", error);
          }
  
          return;
        }

        if (window.confirm("Email address not verified. Please verify your email address before logging in. Resend verification email?")) {
          await SendEmailVerification(email, password);
        }

        signOut(auth);
        navigate("/");
      })

      .catch((error) => { alert(error.code) });
  };

  const handleSignup = () => {

    createUserWithEmailAndPassword(auth, email, password)
      .then(async () => {
        await SendEmailVerification(email, password);
        signOut(auth);
        navigate("/");
      })

      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("Password should be at least 6 characters.");
        } else {
          alert(error.code)
        }
        navigate("/signup");
      });
  }

  const handleLogout = (e) => {
    e.preventDefault();

    signOut(auth)
      .then(() => { navigate('/') })
      .catch((error) => { alert(error.code) });
  }

  const handleSendPasswordResetEmail = () => {

    const continueUrl = "https://orbital-386a9.web.app";

    const actionCodeSettings = {
      url: continueUrl,
      handleCodeInApp: true,
    };

    sendPasswordResetEmail(auth, email, actionCodeSettings)
      .then(() => {
        alert("Password reset email sent.");
        navigate("/");
      })

      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          alert("You do not have an account. Please create an account.");
        } else {
          alert(error.code);
        }
      });
  }

  return {
    email, setEmail,
    password, setPassword,
    handleGoogle,
    handleLogin,
    handleSignup,
    handleLogout,
    handleSendPasswordResetEmail
  };
};