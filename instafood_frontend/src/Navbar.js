import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Dashboard, Add, Person, PeopleAlt, Explore, Event } from '@mui/icons-material';
import './Navbar.css';
import useAuth from './authentication/authLogic';

const links = [
    { path: '/dashboard', icon: <Dashboard />, label: 'Dashboard' },
    { path: '/newPost', icon: <Add />, label: 'Create' },
    { path: '/viewProfile', icon: <Person />, label: 'Profile' },
    { path: '/connect', icon: <PeopleAlt />, label: 'Connect' },
    { path: '/explore', icon: <Explore />, label: 'Explore' },
    { path: '/event', icon: <Event />, label: 'Event' }
  ];

function Navbar() {
    const location = useLocation();
    const { pathname } = location;
    const { handleLogout } = useAuth();

    const Logout = () => {
        return (
            <div className="logout-container">
                <Link to={'/'} onClick={handleLogout}>
                    Logout
                </Link>
            </div>
        );
    };

    if (pathname === '/createProfile') {
        return (
            <div className="navbar">
                <Logout />
            </div>
        );
    }

    return (
        <div className="navbar">
            <div className="links-container">
                {links.map((link, index) => (
                    <Link
                        to={link.path}
                        key={index}
                        className={`navbar-link ${pathname === link.path ? 'active' : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <Logout />
        </div>
    );
}

export default Navbar;
