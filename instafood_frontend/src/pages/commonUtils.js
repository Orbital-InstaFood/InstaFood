/**
 * This function combines the postIDs of selected categories
 * The postIDs are retrieved from the categorisedPostsObject
 * Since a post can be in multiple categories, the returned array will not have duplicate postIDs
 * 
 * @param {{}} categorisedPostsObject - Object with keys as categories and values as arrays of postIDs
 * @param {string[]} selectedCategories - Array of selected categories
 * @returns {string[]} - Array of postIDs that are in the selected categories
 */
export function combinePostIDsOfSelectedCategories(categorisedPostsObject, selectedCategories) {

    let localCombinedArrayOfPostIDsOfSelectedCategories = [];
    for (const category of selectedCategories) {
        const postIDsOfCategory = categorisedPostsObject[category];
        localCombinedArrayOfPostIDsOfSelectedCategories.push(...postIDsOfCategory);
    }
    const combinedArrayWithoutDuplicates = [...new Set(localCombinedArrayOfPostIDsOfSelectedCategories)];
    return combinedArrayWithoutDuplicates;
}


/**
 * This function retrieves the postIDs of the selected categories from the database
 * and creates a categorisedPostObject
 * where the keys are the categories and the values are the postIDs in the category
 * It filters out posts that do not pass the verifierCallback
 * 
 * It ends by calling the callback function with the categorisedPostObject
 * 
 * @param {string[]} categories - Array of categories
 * @param {*} listenerImplementer 
 * @param {*} verifierCallback - Callback function that returns true if the postID passes the verification
 * @param {*} callback - Callback function called with the categorisedPostObject. Provided by the caller
 */
export async function setupCategorisedPostsObject(categories, listenerImplementer, verifierCallback, callback) {
    let categorisedPostObject = {};

    for (const category of categories) {
        const categorisedPostsListener = await listenerImplementer.getCategorisedPostsListener(category);

        if (categorisedPostsListener === null) {
            categorisedPostObject[category] = [];
            continue;
        }
        
        const categorisedPostsDoc = categorisedPostsListener.getCurrentDocument();
        const categorisedPosts = categorisedPostsDoc.post_id_array;

        // Filter out posts that are not in the user's postsToView
        const filteredCategorisedPosts = categorisedPosts.filter((postID) => {
            return verifierCallback(postID);
        });

        categorisedPostObject[category] = filteredCategorisedPosts;
    }

    callback(categorisedPostObject);
}