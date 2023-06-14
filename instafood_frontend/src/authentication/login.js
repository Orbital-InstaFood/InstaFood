import { Link } from "react-router-dom";
import useAuth from "./authLogic";

export default function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        handleGoogle,
        handleLogin,
    } = useAuth();

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
                <button onClick={handleLogin}>LOG IN</button>
            </div>

            <div>
                <Link to="/forgotPassword">Forgot your password?</Link>
            </div>

            <div>
                <p>OR</p>
                <button onClick={handleGoogle}>CONTINUE WITH GOOGLE</button>
            </div>

            <div>
                <p>
                    Don't have an account? <Link to="/signup">SIGN UP FOR INSTAFOOD</Link>
                </p>
            </div>
        </div>
    );
}

