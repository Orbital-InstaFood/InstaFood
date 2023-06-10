import { auth } from "../firebaseConf";
import { sendEmailVerification } from "firebase/auth";

async function SendEmailVerification (email, password) {

    const continueUrl = "http://localhost:3000/signInAfterEmailVerification";
    const params = new URLSearchParams();
    params.append("userEmail", email);
    params.append("password", password);

    const actionCodeSettings = {
        url: continueUrl + "?" + params.toString(),
        handleCodeInApp: true,
    };

    sendEmailVerification(auth.currentUser, actionCodeSettings)
        .then(() => {
            alert("Email verification sent. Please check your email and follow the instructions to verify your email address.");
        })
        .catch((error) => {
            console.log(error);
        })

    return null;
}

export default SendEmailVerification;