import {
    combinePostIDsOfSelectedFields,
    setupFieldPostsObject,
} from './commonUtils';

describe('combinePostIDsOfSelectedFields', () => {

    it('returns all postIDs if all categories are selected', () => {
        const fieldPostsObject = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': ['post4', 'post5', 'post6']
        };
        const selectedFields = ['category1', 'category2'];
        const expected = ['post1', 'post2', 'post3', 'post4', 'post5', 'post6'];
        const actual = combinePostIDsOfSelectedFields(fieldPostsObject, selectedFields);
        expect(actual).toEqual(expected);
    });

    it('does not return postIDs that are not in the selected fields', () => {
        const fieldPostsObject = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': ['post4', 'post5', 'post6']
        };
        const selectedFields = ['category1'];
        const expected = ['post1', 'post2', 'post3'];
        const actual = combinePostIDsOfSelectedFields(fieldPostsObject, selectedFields);
        expect(actual).toEqual(expected);
    });

    it('does not return duplicate postIDs', () => {
        const fieldPostsObject = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': ['post1', 'post2', 'post4']
        };
        const selectedFields = ['category1', 'category2'];
        const expected = ['post1', 'post2', 'post3', 'post4'];
        const actual = combinePostIDsOfSelectedFields(fieldPostsObject, selectedFields);
        expect(actual).toEqual(expected);
    });
});

describe('setupFieldPostsObject', () => {

    it('returns an empty object if "array" is empty', async () => {
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
        const fieldName = 'category'
        const array = [];
        const verifierCallback = jest.fn();
        const expected = {};
        const callback = jest.fn();
        await setupFieldPostsObject(fieldName, array, listenerImplementer, verifierCallback, callback);
        expect(callback).toHaveBeenCalledWith(expected);
    });

    it('field is an empty array if the field does not have any posts', async () => {

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
        const verifierCallback = jest.fn().mockImplementation((category) => {
            return true;
        });
        const expected = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': []
        };
        const callback = jest.fn();
        await setupFieldPostsObject('category', categories, listenerImplementer, verifierCallback, callback);
        expect(callback).toHaveBeenCalledWith(expected);
    });

    it('the field in the fieldPostsObject is an empty array if the field does not exist', async () => {

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
        const verifierCallback = jest.fn().mockImplementation((category) => {
            return true;
        });
        const expected = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': []
        };
        const callback = jest.fn();
        await setupFieldPostsObject('category', categories, listenerImplementer, verifierCallback, callback);
        expect(callback).toHaveBeenCalledWith(expected);
    });

    it('exclude posts that do not pass the verifier callback', async () => {

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
        const verifierCallback = jest.fn().mockImplementation((postID) => {
            if (postID === 'post1' || postID === 'post2' || postID === 'post5') {
                return true;
            }
            return false;
        });
        const expected = {
            'category1': ['post1', 'post2'],
            'category2': ['post5']
        };
        const callback = jest.fn();

        await setupFieldPostsObject('category', categories, listenerImplementer, verifierCallback, callback);
        expect(callback).toHaveBeenCalledWith(expected);
    });

    it('calls the correct listener based on the field name', async () => {

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

        const getCurrentDocument3 = jest.fn(() => {
            return {
                post_id_array: ['post7', 'post8', 'post9']
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
            }),

            getIngredientPostsListener: jest.fn((ingredient) => {
                return {
                    getCurrentDocument: getCurrentDocument3
                };
            })
        };

        const categories = ['category1', 'category2'];
        const verifierCallback = jest.fn().mockImplementation((postID) => {
            return true;
        });
        const expected = {
            'category1': ['post1', 'post2', 'post3'],
            'category2': ['post4', 'post5', 'post6']
        };
        const callback = jest.fn();

        await setupFieldPostsObject('category', categories, listenerImplementer, verifierCallback, callback);
        expect(callback).toHaveBeenCalledWith(expected);
    });
});