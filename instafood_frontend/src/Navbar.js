import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div>
            <Link to="/">Dashboard</Link>
            <Link to="/create">New Post</Link>
            <Link to="/profile">Profile</Link>
        </div>
    );
}

export default Navbar;