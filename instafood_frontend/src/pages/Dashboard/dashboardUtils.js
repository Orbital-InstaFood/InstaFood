import {
    _setupCategorisedPostsObject,
} from '../commonUtils';
/**
 * This function ranks the postIDs in the combinedArrayOfPostIDsOfSelectedCategories
 * The ranking is based on the order of the IDsOfAllPosts
 * Thus, IDsOfAllPosts must be sorted in the order that the posts should be displayed
 * 
 * @param {string[]} postIDsOfSelectedCategories 
 * @param {string[]} IDsOfAllPosts 
 * @returns {string[]} - Array of postIDs that are in the selected categories and ranked by date
 */
export function rankPostsByDate(postIDsOfSelectedCategories, IDsOfAllPosts) {
    let localIDsOfPostsToDisplay = [];

    for (const postID of IDsOfAllPosts) {
        if (postIDsOfSelectedCategories.includes(postID)) {
            localIDsOfPostsToDisplay.push(postID);
        }
    }

    return localIDsOfPostsToDisplay;
}

/**
 * This function is used to load postIDs of posts based on their categories.
 * It is an extension of the _setupCategorisedPostsObject function in commonUtils.js.
 * The provided verifierCallback filters out posts that are not in user's postsToView.
 * 
 * @param {string[]} categories - Array of categories 
 * @param {*} listenerImplementer 
 * @param {string[]} IDsOfAllposts - Array of postIDs that are in user's postsToView
 * @param {*} callback 
 */
export async function dashboard_setupCategorisedPostsObject (categories, listenerImplementer, IDsOfAllposts, callback) {

    const verifierCallback = (postID) => {
        return IDsOfAllposts.includes(postID);
    }

    await _setupCategorisedPostsObject(categories, listenerImplementer, verifierCallback, callback);
}