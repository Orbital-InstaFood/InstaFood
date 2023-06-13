import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Navbar() {

    const location = useLocation();
    const { pathname } = location;

    // Prevent users from navigating to other pages
    // Which require profile information
    // Before they have created a profile
    if (pathname === '/createProfile') {
        return null;
    }

    return (
        <div>
            <Link to="/dashboard">Dashboard  |</Link>
            <Link to="/newPost">New Post  |</Link>
            <Link to="/editProfile">Profile  |</Link>
            <Link to="/connect">Connect  |</Link>
            <Link to="/viewPosts">View Posts</Link>
        </div>
    );
}

export default Navbar;