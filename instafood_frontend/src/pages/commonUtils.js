/**
 * This function combines the postIDs of selected fields into one array
 * The postIDs are retrieved from the fieldPostsObject
 * Since a post can be in multiple categories/ingredients, the array may contain duplicates
 * Thuus, the array is converted into a set and then back into an array to remove duplicates
 * 
 * @param {object} fieldPostsObject - Object with keys as categories/ingredients and values as arrays of postIDs
 * @param {string[]} selectedFields - Array of selected categories/ingredients
 * @returns {string[]} - Array of postIDs that are in the selected categories/ingredients
 */
export function combinePostIDsOfSelectedFields(fieldPostsObject, selectedFields) {

    let postIDsOfSelectedFields = [];
    for (const selectedField of selectedFields) {
        const postIDsOfSelectedField = fieldPostsObject[selectedField];
        postIDsOfSelectedFields.push(...postIDsOfSelectedField);
    }
    const combinedArrayWithoutDuplicates = [...new Set(postIDsOfSelectedFields)];
    return combinedArrayWithoutDuplicates;
}

/**
 * This function retrieves the postIDs of the selected categories/ingredients from the database
 * and creates a fieldPostsObject
 * where the keys are the categories/ingredients and the values are arrays of postIDs
 * 
 * It filters out posts that do not pass the verifierCallback
 * The verifierCallback is provided by the caller, 
 * thus this function should not be called directly
 * 
 * It ends by calling the callback function provided with the fieldPostsObject
 * 
 * @param {string} fieldName - Either 'ingredient' or 'category'
 * @param {string[]} array - Array of categories
 * @param {*} listenerImplementer 
 * @param {*} verifierCallback - Callback function that returns true if the postID passes the verification
 * @param {*} callback - Callback function called with the categorisedPostObject. Provided by the caller
 */
export async function setupFieldPostsObject( fieldName, array, listenerImplementer, verifierCallback, callback) {
    let fieldPostsObject = {};

    for (const member of array) {

        let fieldPostsListener;

        if (fieldName === 'ingredient') {
            fieldPostsListener = await listenerImplementer.getIngredientPostsListener(member);
        } else if (fieldName === 'category') {
            fieldPostsListener = await listenerImplementer.getCategorisedPostsListener(member);
        }

        if (fieldPostsListener === null) {
            fieldPostsObject[member] = [];
            continue;
        }
        
        const fieldPostsDoc = fieldPostsListener.getCurrentDocument();
        const fieldPosts = fieldPostsDoc.post_id_array;

        if(!fieldPosts) {
            fieldPostsObject[member] = [];
            continue;
        }

        const filteredFieldPosts = fieldPosts.filter((postID) => {
            return verifierCallback(postID);
        });

        fieldPostsObject[member] = filteredFieldPosts;
    }

    callback(fieldPostsObject);
}