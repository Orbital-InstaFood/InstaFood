import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";

function DisplayArray ( {array, displayObjectFunc} ) {

    if (array.length === 0) {
        return;
    }

    const arrayAndUniqueID = array.map((item) => {
        return {
            content: item,
            uniqueID: generateUniqueID()
        };
    });

    return (
        <div>
            <ul>
                {arrayAndUniqueID.map((object) => {
                    return (
                        <li key={object.uniqueID}>
                            {displayObjectFunc(object.content)}
                        </li>
                    );
                }
                )}
            </ul>
        </div>

        
    );
}

export default DisplayArray;