import { Link } from "react-router-dom";

function DisplayUserLink({ userID }) {
    return (
        <div>
            <Link to={`/${userID}`}>{userID}</Link>
        </div>
    );
}

export default DisplayUserLink;