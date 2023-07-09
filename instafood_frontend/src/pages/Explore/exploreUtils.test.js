import {
    explore_setupCategorisedPostsObject,
    rankPosts,
    handleTitleSearch   
} from './exploreUtils';

describe('explore_setupCategorisedPostsObject', () => {

    it('should reject a post if it is not public', async () => {

        const getCurrentDocument = jest.fn(() => {
            return {
                post_id_array: ['user1_post1', 'user2_post2', 'user3_post3']
            };
        });
        const listenerImplementer = {
            getCategorisedPostsListener: jest.fn((category) => {
                return {
                    getCurrentDocument: getCurrentDocument
                };
            })
        };

        const categories = ['category'];
        const callback = jest.fn();
        const userProfile = { personalPosts: [], };
        const publicUsers = ['user1'];

        await explore_setupCategorisedPostsObject(categories, listenerImplementer, callback, userProfile, publicUsers);

        expect(callback).toHaveBeenCalledWith(
            {
                category: ['user1_post1'],
            }
        );
    });

    it('should reject a post if it is the user\'s own post', async () => {

        const getCurrentDocument = jest.fn(() => {
            return {
                post_id_array: ['user1_post1', 'user2_post2', 'user3_post3']
            };
        });
        const listenerImplementer = {
            getCategorisedPostsListener: jest.fn((category) => {
                return {
                    getCurrentDocument: getCurrentDocument
                };
            })
        };

        const categories = ['category'];
        const callback = jest.fn();
        const userProfile = { personalPosts: ['user1_post1'], };
        const publicUsers = ['user2', 'user3'];

        await explore_setupCategorisedPostsObject(categories, listenerImplementer, callback, userProfile, publicUsers);

        expect(callback).toHaveBeenCalledWith(
            {
                category: ['user2_post2', 'user3_post3'],
            }
        );
    });

    it('should reject a post if either of the above conditions is true', async () => {

        const getCurrentDocument = jest.fn(() => {
            return {
                post_id_array: ['user1_post1']
            };
        });
        const listenerImplementer = {
            getCategorisedPostsListener: jest.fn((category) => {
                return {
                    getCurrentDocument: getCurrentDocument
                };
            })
        };

        const categories = ['category'];
        const callback = jest.fn();

        // Test 1: user1_post1 is user1's own post (rejected), but user1 is a public user (accepted)
        // user1_post1 should be rejected
        const userProfile1 = { personalPosts: ['user1_post1'], };
        const publicUsers1 = ['user1'];

        await explore_setupCategorisedPostsObject(categories, listenerImplementer, callback, userProfile1, publicUsers1);
        expect(callback).toHaveBeenCalledWith(
            {
                category: [],
            }
        );

        // Test 2: user1_post1 is not a personal post (accepted), but user1 is not a public user (rejected)
        // user1_post1 should be rejected

        const userProfile2 = { personalPosts: [], };
        const publicUsers2 = [];

        await explore_setupCategorisedPostsObject(categories, listenerImplementer, callback, userProfile2, publicUsers2);
        expect(callback).toHaveBeenCalledWith(
            {
                category: [],
            }
        );
    });

});


describe('rankPosts', () => {

    it('should return an empty array if filteredPosts is empty', () => {
        const filteredPosts = [];
        const postDocsThatMatchSelectedCategories = {
            'postID1': {
                likes: [],
                comments: [],
            },
            'postID2': {
                likes: [],
                comments: [],
            },
        };
        const rankedPosts = rankPosts(filteredPosts, postDocsThatMatchSelectedCategories);
        expect(rankedPosts).toEqual([]);
    });

    it('should return an array of postIDs sorted by postRank, where postRank is the sum of likes and comments', () => {
        const filteredPosts = ['postID1', 'postID2'];
        const postDocsThatMatchSelectedCategories = {
            'postID1': {
                likes: ['user1'],
                comments: ['comment1', 'comment2'],
            },
            'postID2': {
                likes: ['user1'],
                comments: ['comment1', 'comment2', 'comment3'],
            },
        };
        const rankedPosts = rankPosts(filteredPosts, postDocsThatMatchSelectedCategories);
        expect(rankedPosts).toEqual(['postID2', 'postID1']);
    });

    it('sorting works with more than 2 postIDs', () => {
        const filteredPosts = ['postID1', 'postID2', 'postID3'];
        const postDocsThatMatchSelectedCategories = {
            'postID1': {
                likes: ['user1'],
                comments: ['comment1'],
            },
            'postID2': {
                likes: ['user1'],
                comments: ['comment1', 'comment2'],
            },
            'postID3': {
                likes: ['user1'],
                comments: ['comment1', 'comment2', 'comment3'],
            },
        };
        const rankedPosts = rankPosts(filteredPosts, postDocsThatMatchSelectedCategories);
        expect(rankedPosts).toEqual(['postID3', 'postID2', 'postID1']);
    });
});

describe('handleTitleSearch', () => {

    it('returned array only includes postIDs that match the search query', () => {
        const combinedArrayOfPostIDsOfSelectedCategories = ['postID1', 'postID2', 'postID3'];
        const postDocsObjectOfSelectedCategories = {
            'postID1': {
                title: 'title1',
            },
            'postID2': {
                title: 'title2',
            },
            'postID3': {
                title: 'title3',
            },
        };
        const titleSearch = 'title1';
        const result = handleTitleSearch(combinedArrayOfPostIDsOfSelectedCategories, postDocsObjectOfSelectedCategories, titleSearch );
        expect(result).toEqual(['postID1']);
    });

    it('filter works with uppercase or lowercase search query', () => {
        const combinedArrayOfPostIDsOfSelectedCategories = ['postID1', 'postID2', 'postID3'];
        const postDocsObjectOfSelectedCategories = {
            'postID1': {
                title: 'title1',
            },
            'postID2': {
                title: 'title2',
            },
            'postID3': {
                title: 'title3',
            },
        };
        const titleSearch = 'TITLE1';
        const result = handleTitleSearch(combinedArrayOfPostIDsOfSelectedCategories, postDocsObjectOfSelectedCategories, titleSearch );
        expect(result).toEqual(['postID1']);
    });

    it('filter works with partial search query', () => {
        const combinedArrayOfPostIDsOfSelectedCategories = ['postID1', 'postID2', 'postID3'];
        const postDocsObjectOfSelectedCategories = {
            'postID1': {
                title: 'title1',
            },
            'postID2': {
                title: 'title2',
            },
            'postID3': {
                title: 'title3',
            },
        };
        const titleSearch = 'title';
        const result = handleTitleSearch(combinedArrayOfPostIDsOfSelectedCategories, postDocsObjectOfSelectedCategories, titleSearch );
        expect(result).toEqual(['postID1', 'postID2', 'postID3']);
    }); 
});