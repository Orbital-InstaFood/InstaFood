import { Link } from "react-router-dom";
import viewUsersLinkManagerInstance from "./viewUsersLinkManager";

function DisplayUserLink({ userID }) {
    return (
        <Link
            to={`/viewOtherUsers`}
            onClick={() => viewUsersLinkManagerInstance.updateUserID(userID)}
        >
            {userID}
        </Link>
    );
}

export default DisplayUserLink;