import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email, password)
            .then(
                navigate("/")
            )
            .catch((error) => {
                const errorMessage = error.message;
                return alert(errorMessage);
            });
    }

    return (
        <div>
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
                <button onClick={handleSignup}>Sign Up</button>
            </div>

            <div>
                <Link to="/">Login</Link>
            </div>
        </div>

    );
}

export default Signup;
