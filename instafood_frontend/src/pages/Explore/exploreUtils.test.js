import {
    explore_setupFieldPostsObject,
    handleTitleSearch,
    calculatePostScore,
    rankPosts,
} from './exploreUtils';

describe('explore_setupFieldPostsObject', () => {

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

        await explore_setupFieldPostsObject('category', categories, listenerImplementer, callback, userProfile, publicUsers);

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

        await explore_setupFieldPostsObject('category', categories, listenerImplementer, callback, userProfile, publicUsers);

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

        await explore_setupFieldPostsObject('category', categories, listenerImplementer, callback, userProfile1, publicUsers1);
        expect(callback).toHaveBeenCalledWith(
            {
                category: [],
            }
        );

        // Test 2: user1_post1 is not a personal post (accepted), but user1 is not a public user (rejected)
        // user1_post1 should be rejected

        const userProfile2 = { personalPosts: [], };
        const publicUsers2 = [];

        await explore_setupFieldPostsObject('category', categories, listenerImplementer, callback, userProfile2, publicUsers2);
        expect(callback).toHaveBeenCalledWith(
            {
                category: [],
            }
        );
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
        const result = handleTitleSearch(combinedArrayOfPostIDsOfSelectedCategories, postDocsObjectOfSelectedCategories, titleSearch);
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
        const result = handleTitleSearch(combinedArrayOfPostIDsOfSelectedCategories, postDocsObjectOfSelectedCategories, titleSearch);
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
        const result = handleTitleSearch(combinedArrayOfPostIDsOfSelectedCategories, postDocsObjectOfSelectedCategories, titleSearch);
        expect(result).toEqual(['postID1', 'postID2', 'postID3']);
    });
});

describe('calculatePostScore', () => {

    it('should return an empty array if there are no posts', () => {
        const postIDs = [];
        const postDocsObject = {
            'postID1': {
                likes: ['user1', 'user2'],
                comments: ['comment1', 'comment2'],
            },
            'postID2': {
                likes: ['user1', 'user2'],
                comments: ['comment1', 'comment2'],
            },
        };
        const result = calculatePostScore(postIDs, postDocsObject);
        expect(result).toEqual([]);
    });

    it('should return an array of postIDs ranked correctly with their corresponding scores', () => {
        const postIDs = ['postID1', 'postID2'];
        const postDocsObject = {
            'postID1': {
                likes: ['user1', 'user2', 'user3'],
                comments: ['comment1', 'comment2'],
            },
            'postID2': {
                likes: ['user1', 'user2'],
                comments: ['comment1', 'comment2'],
            },
        };
        const result = calculatePostScore(postIDs, postDocsObject);
        expect(result).toEqual([
            {
                postID: 'postID1',
                postRank: 5,
            },
            {
                postID: 'postID2',
                postRank: 4,
            }
        ]);
    });

    it('should return an array of postIDs ranked correctly, with more than 2 posts', () => {
        const postIDs = ['postID1', 'postID2', 'postID3'];
        const postDocsObject = {
            'postID1': {
                likes: ['user1', 'user2', 'user3'],
                comments: ['comment1', 'comment2'],
            },
            'postID2': {
                likes: ['user1', 'user2'],
                comments: ['comment1', 'comment2'],
            },
            'postID3': {
                likes: ['user1', 'user2', 'user3', 'user4'],
                comments: ['comment1', 'comment2'],
            },
        };
        const result = calculatePostScore(postIDs, postDocsObject);
        expect(result).toEqual([
            {
                postID: 'postID3',
                postRank: 6,
            },
            {
                postID: 'postID1',
                postRank: 5,
            },
            {
                postID: 'postID2',
                postRank: 4,
            }
        ]);
    });
});

describe('rankPosts', () => {

    it('should remove duplicate postScoreObjects', () => {
        const postScoreObjects1 = [
            {
                postID: 'postID1',
                postRank: 5,
            },
            {
                postID: 'postID2',
                postRank: 4,
            }
        ];
        const postScoreObjects2 = [
            {
                postID: 'postID1',
                postRank: 5,
            },
            {
                postID: 'postID3',
                postRank: 4,
            }
        ];
        const result = rankPosts(postScoreObjects1, postScoreObjects2);
        expect(result).toEqual(['postID1', 'postID2', 'postID3']);
    });

    it('duplicates are determined by postID, not postRank', () => {
        const postScoreObjects1 = [
            {
                postID: 'postID1',
                postRank: 5,
            },
        ];
        const postScoreObjects2 = [
            {
                postID: 'postID2',
                postRank: 5,
            },
        ];
        const result = rankPosts(postScoreObjects1, postScoreObjects2);
        expect(result).toEqual(['postID1', 'postID2']);
    });
});
