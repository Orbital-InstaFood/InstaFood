import { auth } from '../firebaseConf';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Logout() {

    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();

        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Sign-out successful.");
            navigate('/');
        }).catch((error) => {
            // An error happened.
            console.log(error);
            return alert(error.message);
        });
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Logout;

