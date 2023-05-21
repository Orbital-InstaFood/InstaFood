import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";

function displayArray ( array, name ) {

    const arrayAndUniqueID = array.map((item) => {
        return {
            item: item,
            uniqueID: generateUniqueID()
        };
    });

    if (array.length === 0) {
        return;
    }
    return (
        <div>
            <h3>{name}</h3>
            <ul>
                {arrayAndUniqueID.map((item) => {
                    return <li key={item.uniqueID}>{item.item}</li>;
                }
                )}
            </ul>
        </div>
    );
}

export default displayArray;