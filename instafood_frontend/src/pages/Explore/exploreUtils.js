import { setupCategorisedPostsObject } from "../commonUtils";

export function explore_setupCategorisedPostsObject
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

    setupCategorisedPostsObject(categories, listenerImplementer, verifierCallback, callback);
}