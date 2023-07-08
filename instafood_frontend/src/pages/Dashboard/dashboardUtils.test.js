import {
    combinePostIDsOfSelectedCategories,
    rankPostsByDate,
    setupCategorisedPostsListeners
} from './dashboardUtils';

describe('combinePostIDsOfSelectedCategories', () => {

    it('returns all postIDs if no categories are selected', () => {
        const postCategoriesObject = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': ['post4', 'post5', 'post6']
        };
        const selectedCategories = [];
        const IDsOfAllPosts = ['post1', 'post2', 'post3', 'post4', 'post5', 'post6'];
        const expected = ['post1', 'post2', 'post3', 'post4', 'post5', 'post6'];
        const actual = combinePostIDsOfSelectedCategories(postCategoriesObject, selectedCategories, IDsOfAllPosts);
        expect(actual).toEqual(expected);
    });

    it('returns all postIDs if all categories are selected', () => {
        const postCategoriesObject = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': ['post4', 'post5', 'post6']
        };
        const selectedCategories = ['category1', 'category2'];
        const IDsOfAllPosts = ['post1', 'post2', 'post3', 'post4', 'post5', 'post6'];
        const expected = ['post1', 'post2', 'post3', 'post4', 'post5', 'post6'];
        const actual = combinePostIDsOfSelectedCategories(postCategoriesObject, selectedCategories, IDsOfAllPosts);
        expect(actual).toEqual(expected);
    });

    it('does not return postIDs that are not in the selected categories', () => {
        const postCategoriesObject = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': ['post4', 'post5', 'post6']
        };
        const selectedCategories = ['category1'];
        const IDsOfAllPosts = ['post1', 'post2', 'post3', 'post4', 'post5', 'post6'];
        const expected = ['post1', 'post2', 'post3'];
        const actual = combinePostIDsOfSelectedCategories(postCategoriesObject, selectedCategories, IDsOfAllPosts);
        expect(actual).toEqual(expected);
    });

    it('does not return duplicate postIDs', () => {
        const postCategoriesObject = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': ['post1', 'post2', 'post4']
        };
        const selectedCategories = ['category1', 'category2'];
        const IDsOfAllPosts = ['post1', 'post2', 'post3', 'post4'];
        const expected = ['post1', 'post2', 'post3', 'post4'];
        const actual = combinePostIDsOfSelectedCategories(postCategoriesObject, selectedCategories, IDsOfAllPosts);
        expect(actual).toEqual(expected);
    });
});

describe('rankPostsByDate', () => {

    it('returns an empty array if combinedArrayOfPostIDsOfSelectedCategories is empty', () => {
        const combinedArrayOfPostIDsOfSelectedCategories = [];
        const IDsOfAllPosts = ['post1', 'post2', 'post3'];
        const expected = [];
        const actual = rankPostsByDate(combinedArrayOfPostIDsOfSelectedCategories, IDsOfAllPosts);
        expect(actual).toEqual(expected);
    });

    it('returned array is sorted based on the order of IDsOfAllPosts', () => {
        const combinedArrayOfPostIDsOfSelectedCategories = ['post1', 'post2'];
        const IDsOfAllPosts = ['post3', 'post2', 'post1'];
        const expected = ['post2', 'post1'];
        const actual = rankPostsByDate(combinedArrayOfPostIDsOfSelectedCategories, IDsOfAllPosts);
        expect(actual).toEqual(expected);
    });
});

describe('setupCategorisedPostsListeners', () => {

    it('returns an empty object if "categories" is empty', async () => {

        const getCurrentDocument = jest.fn(() => {
            return {
                post_id_array: ['post1', 'post2', 'post3']
            };
        });

        const listenerImplementer = {
            getCategorisedPostsListener: jest.fn((category) => {
                return {
                    getCurrentDocument: getCurrentDocument
                };
            })
        };

        const categories = [];
        const IDsOfAllPosts = ['post1', 'post2', 'post3'];
        const expected = {};
        const callback = jest.fn();
        await setupCategorisedPostsListeners(categories, listenerImplementer, IDsOfAllPosts, callback);
        expect(callback).toHaveBeenCalledWith(expected);
    });

    it('field is an empty array if the category does not have any posts', async () => {

        const getCurrentDocument1 = jest.fn(() => {
            return {
                post_id_array: ['post1', 'post2', 'post3']
            };
        });

        const getCurrentDocument2 = jest.fn(() => {
            return {
                post_id_array: []
            };
        });

        const listenerImplementer = {
            getCategorisedPostsListener: jest.fn((category) => {

                let localGetCurrentDocument;
                if (category === 'category1') {
                    localGetCurrentDocument = getCurrentDocument1;
                }
                if (category === 'category2') {
                    localGetCurrentDocument = getCurrentDocument2;
                }

                return {
                    getCurrentDocument: localGetCurrentDocument
                };
            })
        };

        const categories = ['category1', 'category2'];
        const IDsOfAllPosts = ['post1', 'post2', 'post3'];
        const expected = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': []
        };
        const callback = jest.fn();
        await setupCategorisedPostsListeners(categories, listenerImplementer, IDsOfAllPosts, callback);
        expect(callback).toHaveBeenCalledWith(expected);
    });

    it('the field is an empty array if the category does not exist', async () => {

        const getCurrentDocument1 = jest.fn(() => {
            return {
                post_id_array: ['post1', 'post2', 'post3']
            };
        });

        const listenerImplementer = {
            getCategorisedPostsListener: jest.fn((category) => {
                if (category === 'category1') {
                    return {
                        getCurrentDocument: getCurrentDocument1
                    };
                }
                if (category === 'category2') {
                    return null;
                }
            })
        };

        const categories = ['category1', 'category2'];
        const IDsOfAllPosts = ['post1', 'post2', 'post3'];
        const expected = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': []
        };
        const callback = jest.fn();
        await setupCategorisedPostsListeners(categories, listenerImplementer, IDsOfAllPosts, callback);
        expect(callback).toHaveBeenCalledWith(expected);
    });

    it('the fields do not contain posts that are not in IDsOfAllPosts', async () => {
            
            const getCurrentDocument1 = jest.fn(() => {
                return {
                    post_id_array: ['post1', 'post2', 'post3']
                };
            });
    
            const getCurrentDocument2 = jest.fn(() => {
                return {
                    post_id_array: ['post4', 'post5', 'post6']
                };
            });
    
            const listenerImplementer = {
                getCategorisedPostsListener: jest.fn((category) => {
    
                    let localGetCurrentDocument;
                    if (category === 'category1') {
                        localGetCurrentDocument = getCurrentDocument1;
                    }
                    if (category === 'category2') {
                        localGetCurrentDocument = getCurrentDocument2;
                    }
    
                    return {
                        getCurrentDocument: localGetCurrentDocument
                    };
                })
            };
    
            const categories = ['category1', 'category2'];
            const IDsOfAllPosts = ['post1', 'post2', 'post5'];
            const expected = {
                'category1': ['post1', 'post2'],
                'category2': ['post5']
            };
            const callback = jest.fn();
            await setupCategorisedPostsListeners(categories, listenerImplementer, IDsOfAllPosts, callback);
            expect(callback).toHaveBeenCalledWith(expected);
        });
});