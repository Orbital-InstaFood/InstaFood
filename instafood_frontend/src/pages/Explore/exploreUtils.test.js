import {
    explore_setupFieldPostsObject,
    handleTitleSearch,
    calculatePostScore,
    rankPosts,
    handleSelectedFieldAChange,
    handleTitleChange
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

describe('handleSelectedFieldAChange', () => {
    const post1 = {
        'title': 'title1',
        'comments': ['commentA', 'commentB', 'commentC'],
        'likes': ['userA', 'userB'],
    }; // postRank: 5
    const post2 = {
        'title': 'title2',
        'comments': ['commentA', 'commentB'],
        'likes': ['userA'],
    }; // postRank: 3
    const post3 = {
        'title': 'title3',
        'comments': ['commentA',],
        'likes': ['userA'],
    }; // postRank: 2
    const post4 = {
        'title': 'title4',
        'comments': ['commentA', 'commentB'],
        'likes': ['userA', 'userB'],
    }; // postRank: 4

    it('integration test: postDocsObject is updated correctly when selectedField changes', async () => {

        const getCurrentDocument1 = jest.fn(() => {
            return post1;
        });
        const getCurrentDocument2 = jest.fn(() => {
            return post2;
        });
        const getCurrentDocument3 = jest.fn(() => {
            return post3;
        });
        const getCurrentDocument4 = jest.fn(() => {
            return post4;
        });
    
        let listenerImplementer = {
            getPostListener: jest.fn((postID) => {
                let localGetCurrentDocument;
                if (postID === 'postID1') {
                    localGetCurrentDocument = getCurrentDocument1;
                } else if (postID === 'postID2') {
                    localGetCurrentDocument = getCurrentDocument2;
                } else if (postID === 'postID3') {
                    localGetCurrentDocument = getCurrentDocument3;
                } else if (postID === 'postID4') {
                    localGetCurrentDocument = getCurrentDocument4;
                }
                return {
                    getCurrentDocument: localGetCurrentDocument,
                };
            }),
        };

        const initialPostDocsObject = {
            'postID1': post1,
            'postID2': post2,
        };
        const titleToSearch = 'title';
        const fieldPostsObjectA = {
            'category1': ['postID1', 'postID2'],
            'category2': ['postID3'],
        };
        const selectedFieldA = ['category1', 'category2'];
        const postScoreObjectB = [{ postID: 'postID1', postRank: 5 }, { postID: 'postID2', postRank: 3 }];
        const {
            postIDsOfSelectedFieldA,
            postDocsObjectUpdated,
            postScoreObjectAUpdated,
            rankedPosts
        } = await handleSelectedFieldAChange({
            postDocsObject: initialPostDocsObject,
            titleToSearch: titleToSearch,
            fieldPostsObjectA: fieldPostsObjectA,
            selectedFieldA: selectedFieldA,
            postScoreObjectB: postScoreObjectB,
            listenerImplementer: listenerImplementer,
        });

        const expectedPostDocsObject = {
            'postID1': post1,
            'postID2': post2,
            'postID3': post3,
        };

        expect(postDocsObjectUpdated).toEqual(expectedPostDocsObject);
    });

    it('integration test: postScoreObjectA is updated correctly when selectedField changes', async () => {

        const getCurrentDocument1 = jest.fn(() => {
            return post1;
        });
        const getCurrentDocument2 = jest.fn(() => {
            return post2;
        });
        const getCurrentDocument3 = jest.fn(() => {
            return post3;
        });
        const getCurrentDocument4 = jest.fn(() => {
            return post4;
        });
    
        let listenerImplementer = {
            getPostListener: jest.fn((postID) => {
                let localGetCurrentDocument;
                if (postID === 'postID1') {
                    localGetCurrentDocument = getCurrentDocument1;
                } else if (postID === 'postID2') {
                    localGetCurrentDocument = getCurrentDocument2;
                } else if (postID === 'postID3') {
                    localGetCurrentDocument = getCurrentDocument3;
                } else if (postID === 'postID4') {
                    localGetCurrentDocument = getCurrentDocument4;
                }
                return {
                    getCurrentDocument: localGetCurrentDocument,
                };
            }),
        };

        const initialPostDocsObject = {
            'postID1': post1,
            'postID2': post2,
        };
        const titleToSearch = 'title';
        const fieldPostsObjectA = {
            'category2': ['postID3', 'postID4'],
        };
        const selectedFieldA = ['category2'];
        const postScoreObjectB = [{ postID: 'postID1', postRank: 5 }, { postID: 'postID2', postRank: 3 }];
        const {
            postIDsOfSelectedFieldA,
            postDocsObjectUpdated,
            postScoreObjectAUpdated,
            rankedPosts
        } = await handleSelectedFieldAChange({
            postDocsObject: initialPostDocsObject,
            titleToSearch: titleToSearch,
            fieldPostsObjectA: fieldPostsObjectA,
            selectedFieldA: selectedFieldA,
            postScoreObjectB: postScoreObjectB,
            listenerImplementer: listenerImplementer,
        });

        const expectedPostScoreObjectA = [
            {
                postID: 'postID4',
                postRank: 4,
            },
            {
                postID: 'postID3',
                postRank: 2,
            },
        ];

        expect(postScoreObjectAUpdated).toEqual(expectedPostScoreObjectA);
    });

    it('integration test: rankedPosts is updated correctly when selectedField changes', async () => {
        const getCurrentDocument1 = jest.fn(() => {
            return post1;
        });
        const getCurrentDocument2 = jest.fn(() => {
            return post2;
        });
        const getCurrentDocument3 = jest.fn(() => {
            return post3;
        });
        const getCurrentDocument4 = jest.fn(() => {
            return post4;
        });
    
        let listenerImplementer = {
            getPostListener: jest.fn((postID) => {
                let localGetCurrentDocument;
                if (postID === 'postID1') {
                    localGetCurrentDocument = getCurrentDocument1;
                } else if (postID === 'postID2') {
                    localGetCurrentDocument = getCurrentDocument2;
                } else if (postID === 'postID3') {
                    localGetCurrentDocument = getCurrentDocument3;
                } else if (postID === 'postID4') {
                    localGetCurrentDocument = getCurrentDocument4;
                }
                return {
                    getCurrentDocument: localGetCurrentDocument,
                };
            }),
        };

        const initialPostDocsObject = {
            'postID1': post1,
            'postID2': post2,
        };
        const titleToSearch = 'title';
        const fieldPostsObjectA = {
            'category2': ['postID3', 'postID4'],
        };
        const selectedFieldA = ['category2'];
        const postScoreObjectB = [{ postID: 'postID1', postRank: 5 }, { postID: 'postID2', postRank: 3 }];
        const {
            postIDsOfSelectedFieldA,
            postDocsObjectUpdated,
            postScoreObjectAUpdated,
            rankedPosts
        } = await handleSelectedFieldAChange({
            postDocsObject: initialPostDocsObject,
            titleToSearch: titleToSearch,
            fieldPostsObjectA: fieldPostsObjectA,
            selectedFieldA: selectedFieldA,
            postScoreObjectB: postScoreObjectB,
            listenerImplementer: listenerImplementer,
        });

        const expectedRankedPosts = ['postID1', 'postID4', 'postID2', 'postID3'];

        expect(rankedPosts).toEqual(expectedRankedPosts);
    });
});

describe('handleTitleChange', () => {

    it('integration test: rankedPosts is updated correctly when title changes', async () => {
        const post1 = {
            'title': 'title1',
            'comments': ['commentA', 'commentB', 'commentC'],
            'likes': ['userA', 'userB'],
        }; // postRank: 5
        const post2 = {
            'title': 'title2',
            'comments': ['commentA', 'commentB'],
            'likes': ['userA'],
        }; // postRank: 3
        const post3 = {
            'title': 'title3',
            'comments': ['commentA',],
            'likes': ['userA'],
        }; // postRank: 2
        const post4 = {
            'title': 'title4',
            'comments': ['commentA', 'commentB'],
            'likes': ['userA', 'userB'],
        }; // postRank: 4

        const postDocsObject = {
            'postID1': post1,
            'postID2': post2,
            'postID3': post3,
            'postID4': post4,
        };
        const postIDsOfSelectedFieldA = ['postID1', 'postID2'];
        const postIDsOfSelectedFieldB = ['postID3', 'postID4'];

        const titleToSearch1 = 'title';
        const rankedPosts = handleTitleChange({
            postDocsObject: postDocsObject,
            postIDsOfSelectedFieldA: postIDsOfSelectedFieldA,
            postIDsOfSelectedFieldB: postIDsOfSelectedFieldB,
            titleToSearch: titleToSearch1,
        });

        const expectedRankedPosts = ['postID1', 'postID4', 'postID2', 'postID3'];
        expect(rankedPosts).toEqual(expectedRankedPosts);

        const titleToSearch2 = '1';
        const rankedPosts2 = handleTitleChange({
            postDocsObject: postDocsObject,
            postIDsOfSelectedFieldA: postIDsOfSelectedFieldA,
            postIDsOfSelectedFieldB: postIDsOfSelectedFieldB,
            titleToSearch: titleToSearch2,
        });

        const expectedRankedPosts2 = ['postID1'];
        expect(rankedPosts2).toEqual(expectedRankedPosts2);
    });
});



