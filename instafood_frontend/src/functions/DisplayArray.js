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
                {arrayAndUniqueID.map((object) => {
                    return (
                        <div key={object.uniqueID}>
                            {displayObjectFunc(object.content)}
                        </div>
                    );
                }
                )}
        </div>

        
    );
}

export default DisplayArray;
