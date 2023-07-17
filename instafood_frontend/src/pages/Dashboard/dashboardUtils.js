import {
    setupFieldPostsObject,
} from '../commonUtils';
/**
 * This function ranks postIDs based on their orders in IDsOfAllPosts.
 * IDsOfAllPosts is sorted in descending order of date_created.
 * 
 * @param {string[]} postIDsOfSelectedCategoriesAndIngredients 
 * @param {string[]} IDsOfAllPosts 
 * @returns {string[]} - Array of postIDs that are in the selected categories and ingredients
 */
export function rankPostsByDate(postIDsOfSelectedCategoriesAndIngredients, IDsOfAllPosts) {
    let localIDsOfPostsToDisplay = [];

    for (const postID of IDsOfAllPosts) {
        if (postIDsOfSelectedCategoriesAndIngredients.includes(postID)) {
            localIDsOfPostsToDisplay.push(postID);
        }
    }

    return localIDsOfPostsToDisplay;
}

/**
 * This function is used to load postIDs of posts based on their categories/ingredients.
 * It is an extension of the _setupFieldPostsObject function in commonUtils.js.
 * The provided verifierCallback filters out posts that are not in user's postsToView.
 * 
 * @param {string} fieldName - 'category' or 'ingredient'
 * @param {string[]} array - Array of categories/ingredients
 * @param {*} listenerImplementer 
 * @param {string[]} IDsOfAllposts - Array of postIDs that are in user's postsToView
 * @param {*} callback 
 */
export async function dashboard_setupFieldPostsObject (fieldName, array, listenerImplementer, IDsOfAllposts, callback) {

    const verifierCallback = (postID) => {
        return IDsOfAllposts.includes(postID);
    }

    await setupFieldPostsObject(fieldName, array, listenerImplementer, verifierCallback, callback);
}