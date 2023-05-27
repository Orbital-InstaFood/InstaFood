import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";
import DisplayRequest from "./DisplayRequest";

function DisplayRequestArray ( {requestArray, userOwnUserID } ) {

    if (requestArray.length === 0) {
        return;
    }

    const requestArrayAndUniqueID = requestArray.map((request) => {
        return {
            content: request,
            uniqueID: generateUniqueID()
        };
    });

    return (
        <div>
            <ul>
                {requestArrayAndUniqueID.map((object) => {
                    return (
                        <li key={object.uniqueID}>
                            <DisplayRequest otherUserID={object.content} userOwnID={userOwnUserID} />
                        </li>
                    );
                }
                )}
            </ul>
        </div>
    );
}

export default DisplayRequestArray;
