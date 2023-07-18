import { setupFieldPostsObject } from "../commonUtils";
import {
    combinePostIDsOfSelectedFields
  } from '../commonUtils';

/**
 * This function is used to load postIDs of posts based on their categories/ingredients.
 * It is an extension of the setupFieldPostsObject function in commonUtils.js.
 * The provided verifierCallback filters out posts that are not public or are the user's own posts.
 * 
 * @param {string} fieldName - 'category' or 'ingredient'
 * @param {string[]} array - Array of categories/ingredients
 * @param {*} listenerImplementer 
 * @param {*} callback - Called with the fieldPostsObject
 * @param {object} userProfile - User document of the current user
 * @param {string[]} publicUsers - An array of userIDs of users whose accounts are public
 */
export async function explore_setupFieldPostsObject
    (
        fieldName,
        array,
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

    await setupFieldPostsObject(fieldName, array, listenerImplementer, verifierCallback, callback);
}

/**
 * This function is used to rank posts based on the number of likes and comments.
 * It assumes that the posts are already retrieved from the database,
 * and stored in an object with keys as postIDs and values as post documents.
 * Only posts in the postIDs array are ranked.
 * 
 * Exported for testing purposes.
 * 
 * @param {string[]} postIDs - Array of postIDs 
 * @param {object} postDocsObject - Object with keys as postIDs and values as post documents
 * @returns {object[]} - Array of objects with two fields: postID and postRank
 */
export function calculatePostScore(postIDs, postDocsObject) {

    let postScoreObject = [];
    for (const postID of postIDs) {
        const postDoc = postDocsObject[postID];
        const postRank = postDoc.likes.length + postDoc.comments.length;
        postScoreObject.push({ postID, postRank });
    }

    postScoreObject.sort((a, b) => {
        return b.postRank - a.postRank;
    });

    return postScoreObject;
}

/**
 * This function is used to compare two arrays of postScoreObjects and rank them.
 * It assumes that the postScoreObjects are already sorted in descending order.
 * 
 * Exported for testing purposes.
 * 
 * @param {*} postScoreObject1 
 * @param {*} postScoreObject2 
 * @returns {string[]} - Array of postIDs in descending order of rank
 */
export function rankPosts(postScoreObject1, postScoreObject2) {

    let postScoreObject = postScoreObject1.concat(postScoreObject2);

    //remove duplicates
    postScoreObject = postScoreObject.filter((post, index, self) =>
        index === self.findIndex((t) => (
            t.postID === post.postID
        ))
    );

    postScoreObject.sort((a, b) => {
        return b.postRank - a.postRank;
    });

    let rankedPosts = [];
    for (const post of postScoreObject) {
        rankedPosts.push(post.postID);
    }

    return rankedPosts;
}

/**
 * This function is used to filter posts based on the title.
 * 
 * Exported for testing purposes.
 * 
 * @param {string[]} postIDsOfSelectedFields - Array of postIDs that are in the selected categories/ingredients
 * @param {object} postDocsObjectOfSelectedFields - Object with keys as postIDs and values as post documents
 * @param {string} titleToSearch - Title to search for
 * @returns {string[]} - Array of postIDs that are in the selected categories/ingredients and have the title
 */
export function handleTitleSearch(postIDsOfSelectedFields, postDocsObjectOfSelectedFields, titleToSearch) {
    let filteredPosts = [];
    for (const postID of postIDsOfSelectedFields) {
        const postDoc = postDocsObjectOfSelectedFields[postID];
        if (postDoc.title.toLowerCase().includes(titleToSearch.toLowerCase())) {
            filteredPosts.push(postID);
        }
    }
    return filteredPosts;
}

/**
 * This function is used to load post documents of posts that are in the selected categories/ingredients.
 * This function loads post documents regardless of whether the post has been loaded before.
 * This ensures that the post documents are up to date with changes such as likes and comments,
 * when selected categories/ingredients change
 * 
 * Exported for testing purposes.
 * 
 * @param {object} postDocsObjectOfSelectedFields - Object with keys as postIDs and values as post documents
 * @param {string[]} postIDsOfSelectedFields - Array of postIDs that are in the selected categories/ingredients
 * @param {*} listenerImplementer 
 * @returns {object} - Object with keys as postIDs and values as post documents
 */
export async function loadPostsOfSelectedFields(postDocsObjectOfSelectedFields, postIDsOfSelectedFields, listenerImplementer) {
    let localPostDocsObjectOfSelectedFields = { ...postDocsObjectOfSelectedFields };
    for (const postID of postIDsOfSelectedFields) {
        const postListener = await listenerImplementer.getPostListener(postID);
        const postDoc = postListener.getCurrentDocument();
        localPostDocsObjectOfSelectedFields[postID] = postDoc;
    }
    return localPostDocsObjectOfSelectedFields;
}

/**
 * This function is used to handle the change in selected categories/ingredients.
 * A refers to the field that changes, B refers to the other field.
 * @returns {object} - An object with the following fields:
 * postIDsOfSelectedFieldA: Array of postIDs that are in the selected categories/ingredients
 * postDocsObjectOfSelectedFieldAUpdated: Object with keys as postIDs and values as post documents
 * postScoreObjectAUpdated: Array of objects with two fields: postID and postRank
 * rankedPosts: Array of postIDs in descending order of rank
 */
export async function handleSelectedFieldAChange ({
    listenerImplementer, postDocsObject, titleToSearch,
    fieldPostsObjectA, selectedFieldA,
    postScoreObjectB,
}) {
    const postIDsOfSelectedFieldA 
    = combinePostIDsOfSelectedFields(fieldPostsObjectA, selectedFieldA);

    const postDocsObjectUpdated
    = await loadPostsOfSelectedFields(postDocsObject, postIDsOfSelectedFieldA, listenerImplementer);

    const postsFilteredByFieldAandTitle
    = handleTitleSearch(postIDsOfSelectedFieldA, postDocsObjectUpdated, titleToSearch);

    const postScoreObjectAUpdated
    = calculatePostScore(postsFilteredByFieldAandTitle, postDocsObjectUpdated);

    const rankedPosts
    = rankPosts(postScoreObjectAUpdated, postScoreObjectB);

    return {
        postIDsOfSelectedFieldA,
        postDocsObjectUpdated,
        postScoreObjectAUpdated,
        rankedPosts,
    }
}

/**
 * This function is used to handle the change in title.
 * 
 * @param {object} postDocsObject - Object with keys as postIDs and values as post documents
 * @param {string} titleToSearch - Title to search for
 * @param {string[]} postIDsOfSelectedFieldA - Array of postIDs that are in the selected categories/ingredients
 * @param {string[]} postIDsOfSelectedFieldB - Array of postIDs that are in the other field
 * @returns {string[]} - Array of postIDs that are in the selected categories/ingredients and have the title
 */
export function handleTitleChange ({
    postDocsObject, titleToSearch,
    postIDsOfSelectedFieldA, postIDsOfSelectedFieldB
}) {
    const postsFilteredByFieldAandTitle
    = handleTitleSearch(postIDsOfSelectedFieldA, postDocsObject, titleToSearch);
    const postScoreObjectAUpdated
    = calculatePostScore(postsFilteredByFieldAandTitle, postDocsObject);

    const postsFilteredByFieldBandTitle
    = handleTitleSearch(postIDsOfSelectedFieldB, postDocsObject, titleToSearch);
    const postScoreObjectBUpdated
    = calculatePostScore(postsFilteredByFieldBandTitle, postDocsObject);

    const rankedPosts
    = rankPosts(postScoreObjectAUpdated, postScoreObjectBUpdated);

    return rankedPosts;
}
