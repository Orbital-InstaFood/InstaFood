import { auth } from "../firebaseConf";
import { sendEmailVerification } from "firebase/auth";

/**
 * Sends email verification to user
 * Use this instead of the default Firebase email verification
 * 
 * @param {*} email 
 * @param {*} password 
 */
export default async function SendEmailVerification(email, password) {

    const continueUrl = "https://orbital-386a9.web.app/signInAfterEmailVerification";
    const params = new URLSearchParams();
    params.append("userEmail", email);
    params.append("password", password);

    const actionCodeSettings = {
        url: continueUrl + "?" + params.toString(),
        handleCodeInApp: true,
    };

    try {
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        alert("Email verification sent. Please check your email and follow the instructions to verify your email address, or sign in with your Google account directly.");
    } catch (error) {
        console.log(error);
    }
}