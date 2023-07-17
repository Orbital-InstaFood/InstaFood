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

import getFCMToken from '../pages/Notification/fcmTokenService';
import { httpsCallable } from "firebase/functions";

const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubsribe = auth.onAuthStateChanged((user) => {

      if (user && user.emailVerified) {
        navigate("/dashboard");
      }

    });
    return () => unsubsribe();
  }, []);

  const handleGoogle = (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/dashboard");
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) {
          if (window.confirm("Email address not verified. Please verify your email address before logging in. Resend verification email?")) {
            await SendEmailVerification(email, password);
          }
          signOut(auth);
          navigate("/");
        } else {

          // update fcmToken for push notifications
          const uid = user.uid;
          try {
            const temp_fcmToken = await getFCMToken();

            const updateFCMToken = httpsCallable(functions, 'updateFCMToken');

            try {
              const temp_fcmToken = await getFCMToken();
            
              if (temp_fcmToken) {
                const result = await updateFCMToken({ token: temp_fcmToken });
                console.log(result.data.message);
              } else {
                console.log("Invalid fcmToken.");
              }
              navigate("/dashboard");
            } catch (error) {
              console.log("Error updating fcmToken: ", error);
            }
            


          } catch (error) {
            console.log("Error updating fcmToken: ", error);

          }

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
  };

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

  const handleLogout = (e) => {
    e.preventDefault();

    signOut(auth)
      .then(() => {
        navigate('/');
      })

      .catch((error) => {
        return alert(error.message);
      });
  }

  const handleSendPasswordResetEmail = (e) => {
    e.preventDefault();

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
        if (error.code === "auth/invalid-email") {
          alert("Invalid email address.");
        }

        if (error.code === "auth/user-not-found") {
          alert("You do not have an account. Please create an account.");
        }
      });
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleGoogle,
    handleLogin,
    handleSignup,
    handleLogout,
    handleSendPasswordResetEmail
  };
};

export default useAuth;