import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Logout() {
    const handleLogout = (e) => {
        e.preventDefault();

        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Sign-out successful.");
        }).catch((error) => {
            // An error happened.
            console.log(error);
        });
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Logout;

