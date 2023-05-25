import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div>
            <Link to="/">Dashboard      </Link>
            <Link to="/newPost">New Post    </Link>
            <Link to="/editProfile">Profile     </Link>
            <Link to="/connect">Connect     </Link>
        </div>
    );
}

export default Navbar;