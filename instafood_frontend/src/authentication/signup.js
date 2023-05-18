import React from "react";

import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";


function Signup() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSignup = (e) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
            })
            .catch((error) => {
                console.log(error);
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
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
}

export default Signup;
