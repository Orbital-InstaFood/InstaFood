import { _setupCategorisedPostsObject } from "../commonUtils";

/**
 * This function is used to load postIDs of posts based on their categories.
 * It is an extension of the _setupCategorisedPostsObject function in commonUtils.js.
 * The provided verifierCallback filters out posts that are not public or are the user's own posts.
 * 
 * @param {string[]} categories - An array of categories
 * @param {*} listenerImplementer 
 * @param {*} callback - Called with the categorisedPostsObject
 * @param {object} userProfile - User document of the current user
 * @param {string[]} publicUsers - An array of userIDs of users whose accounts are public
 */
export async function explore_setupCategorisedPostsObject
    (
        categories,
        listenerImplementer,
        callback,
        userProfile,
        publicUsers,
    ) {

    const verifierCallback = (postID) => {
        const isOwnPost = userProfile.personalPosts.includes(postID);

        const creator = postID.split('_')[0];
        const isAPublicPost = publicUsers.includes(creator);

        return !isOwnPost && isAPublicPost;
    }

    await _setupCategorisedPostsObject(categories, listenerImplementer, verifierCallback, callback);
}

/**
 * This function is used to rank posts based on the number of likes and comments.
 * 
 * @param {string[]} postIDs - Array of postIDs that are not sorted
 * @param {object} postDocsObjectOfSelectedCategories - Object with keys as postIDs and values as post documents
 * @returns 
 */
export function rankPosts(postIDs, postDocsObjectOfSelectedCategories) {

    let rankedPostsObject = [];
    for (const postID of postIDs) {
        const postDoc = postDocsObjectOfSelectedCategories[postID];
        const postRank = postDoc.likes.length + postDoc.comments.length;
        rankedPostsObject.push({ postID, postRank });
    }
    rankedPostsObject.sort((a, b) => {
        return b.postRank - a.postRank;
    });

    let rankedPostIDs = [];
    for (const post of rankedPostsObject) {
        rankedPostIDs.push(post.postID);
    }

    return rankedPostIDs;
}

/**
 * This function is used to filter posts based on the title.
 * 
 * @param {string[]} postIDsOfSelectedCategories - Array of postIDs that are in the selected categories
 * @param {object} postDocsObjectOfSelectedCategpries - Object with keys as postIDs and values as post documents
 * @param {string} titleToSearch - Title to search for
 * @returns 
 */
export function handleTitleSearch(postIDsOfSelectedCategories, postDocsObjectOfSelectedCategpries, titleToSearch) {
    let filteredPosts = [];
    for (const postID of postIDsOfSelectedCategories) {
        const postDoc = postDocsObjectOfSelectedCategpries[postID];
        if (postDoc.title.toLowerCase().includes(titleToSearch.toLowerCase())) {
            filteredPosts.push(postID);
        }
    }
    return filteredPosts;
}

/**
 * This function is used to load post documents of posts that are in the selected categories.
 * This function loads post documents regardless of whether the post has been loaded before.
 * This ensures that the post documents are up to date with changes such as likes and comments,
 * when selected categories changes.
 * 
 * @param {object} postDocsObjectOfSelectedCategories - Object with keys as postIDs and values as post documents
 * @param {string[]} postIDsOfSelectedCategories - Array of postIDs that are in the selected categories
 * @param {*} listenerImplementer 
 * @returns 
 */
export async function loadPostsOfSelectedCategories(postDocsObjectOfSelectedCategories, postIDsOfSelectedCategories, listenerImplementer) {
    let localPostDocsObjectOfSelectedCategories = { ...postDocsObjectOfSelectedCategories };
    for (const postID of postIDsOfSelectedCategories) {
        const postListener = await listenerImplementer.getPostListener(postID);
        const postDoc = postListener.getCurrentDocument();
        localPostDocsObjectOfSelectedCategories[postID] = postDoc;
    }
    return localPostDocsObjectOfSelectedCategories;
}