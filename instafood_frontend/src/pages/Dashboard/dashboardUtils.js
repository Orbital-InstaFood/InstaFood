import {
    setupCategorisedPostsObject,
} from '../commonUtils';
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

export function dashboard_setupCategorisedPostsObject (categories, listenerImplementer, IDsOfAllposts, callback) {

    const verifierCallback = (postID) => {
        return IDsOfAllposts.includes(postID);
    }

    setupCategorisedPostsObject(categories, listenerImplementer, verifierCallback, callback);
}