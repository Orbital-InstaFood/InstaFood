import {Link} from "react-router-dom";
import useAuth from "./authLogic";

export default function ForgotPassword () {

    const {
        email,
        setEmail,
        handleSendPasswordResetEmail
    } = useAuth();

    return (
        <div>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendPasswordResetEmail}>Send Password Reset Email</button>
            <br />
            <Link to="/">Back to Login</Link>
        </div>
    )
}