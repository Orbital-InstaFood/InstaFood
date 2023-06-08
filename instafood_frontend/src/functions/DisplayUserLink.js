import { Link } from "react-router-dom";

function DisplayUserLink ({userID}) {
    return (
        <Link to={`/${userID}`}>{userID}</Link>
    );
}

export default DisplayUserLink;