/**
 * This function combines the postIDs of selected categories
 * The postIDs are retrieved from the postCategoriesObject
 * If no categories are selected, then all postIDs are returned
 * Since a post can be in multiple categories, the returned array will not have duplicate postIDs
 * 
 * @param {{}} postCategoriesObject - Object with keys as categories and values as arrays of postIDs
 * @param {string[]} selectedCategories - Array of selected categories
 * @param {string[]} IDsOfAllPosts - Array of all postIDs that the user has access to at the moment
 * @returns {string[]} - Array of postIDs that are in the selected categories
 */
export function combinePostIDsOfSelectedCategories(postCategoriesObject, selectedCategories, IDsOfAllPosts) {

    if (selectedCategories.length === 0) {
        return [...IDsOfAllPosts];
    }

    let localCombinedArrayOfPostIDsOfSelectedCategories = [];
    for (const category of selectedCategories) {
        const postIDsOfCategory = postCategoriesObject[category];
        localCombinedArrayOfPostIDsOfSelectedCategories.push(...postIDsOfCategory);
    }
    const combinedArrayWithoutDuplicates = [...new Set(localCombinedArrayOfPostIDsOfSelectedCategories)];
    return combinedArrayWithoutDuplicates;
}

/**
 * This function ranks the postIDs in the combinedArrayOfPostIDsOfSelectedCategories
 * The ranking is based on the order of the IDsOfAllPosts
 * Thus, IDsOfAllPosts must be sorted in the order that the posts should be displayed
 * 
 * @param {string[]} combinedArrayOfPostIDsOfSelectedCategories 
 * @param {string[]} IDsOfAllPosts 
 * @returns {string[]} - Array of postIDs that are in the selected categories and ranked by date
 */
export function rankPostsByDate(combinedArrayOfPostIDsOfSelectedCategories, IDsOfAllPosts) {
    let localIDsOfPostsToDisplay = [];

    for (const postID of IDsOfAllPosts) {
        if (combinedArrayOfPostIDsOfSelectedCategories.includes(postID)) {
            localIDsOfPostsToDisplay.push(postID);
        }
    }

    return localIDsOfPostsToDisplay;
}

/**
 * This function sets up the categorisedPostsListeners
 * and creates a postCategoriesObject
 * where the keys are the categories and the values are the postIDs in the category
 * Only postIDs that are in the IDsOfAllPosts are added to the postCategoriesObject
 * It ends by calling the callback function with the postCategoriesObject
 * 
 * @param {string[]} categories - Array of categories
 * @param {*} listenerImplementer 
 * @param {*} IDsOfAllPosts - Array of all postIDs that the user has access to at the moment
 * @param {*} callback - Callback function called with the postCategoriesObject. Provided by the caller
 */
export async function setupCategorisedPostsListeners(categories, listenerImplementer, IDsOfAllPosts, callback) {
    let localPostCategoriesObject = {};

    for (const category of categories) {
        const categorisedPostsListener = await listenerImplementer.getCategorisedPostsListener(category);

        if (categorisedPostsListener === null) {
            localPostCategoriesObject[category] = [];
            continue;
        }
        
        const categorisedPostsDoc = categorisedPostsListener.getCurrentDocument();
        const categorisedPosts = categorisedPostsDoc.post_id_array;

        // Filter out posts that are not in the user's postsToView
        const filteredCategorisedPosts = categorisedPosts.filter((postID) => {
            return IDsOfAllPosts.includes(postID);
        });

        localPostCategoriesObject[category] = filteredCategorisedPosts;
    }

    callback(localPostCategoriesObject);
}