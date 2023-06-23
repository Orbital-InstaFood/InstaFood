import useAuth from './authLogic';
import "./logout.css";

export default function Logout() {

    const { handleLogout } = useAuth();

    return (
        <div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

