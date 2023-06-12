import {auth} from "../firebaseConf";
import {sendPasswordResetEmail} from "firebase/auth";
import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";

export default function ForgotPassword () {
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const handleSendEmail = (e) => {
        e.preventDefault();

        const continueUrl = "http://localhost:3000/";

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

    return (
        <div>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendEmail}>Send Password Reset Email</button>
            <br />
            <Link to="/">Back to Login</Link>
        </div>
    )
}