import { Link } from "react-router-dom";
import  useAuth  from "./authLogic";

export default function SignUp() {

    const {
        email,
        setEmail,
        password,
        setPassword,
        handleSignup,
        handleGoogle,
    } = useAuth();

    return (
        <div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleSignup}>SIGN UP</button>

            <div>
                <p>
                    OR
                </p>
                <button onClick={handleGoogle}>CONTINUE WITH GOOGLE</button>
            </div>

            <div>
                <p> Already have an account? <Link to="/">LOG IN</Link></p>
            </div>
        </div>
    );
}