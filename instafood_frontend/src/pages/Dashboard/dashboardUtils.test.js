import {
    rankPostsByDate,
    handleCategoriesOrIngredientsChange
} from './dashboardUtils';

describe('rankPostsByDate', () => {

    it('returns an empty array if combinedArrayOfPostIDsOfSelectedCategories is empty', () => {
        const postIDsOfSelectedFields = [];
        const IDsOfAllPosts = ['post1', 'post2', 'post3'];
        const expected = [];
        const actual = rankPostsByDate(postIDsOfSelectedFields, IDsOfAllPosts);
        expect(actual).toEqual(expected);
    });

    it('returned array is sorted based on the order of IDsOfAllPosts', () => {
        const postIDsOfSelectedFields = ['post1', 'post2'];
        const IDsOfAllPosts = ['post3', 'post2', 'post1'];
        const expected = ['post2', 'post1'];
        const actual = rankPostsByDate(postIDsOfSelectedFields, IDsOfAllPosts);
        expect(actual).toEqual(expected);
    });
});

describe('handleCategoriesOrIngredientsChange', () => {

    it('does not return duplicate postIDs', () => {
        const categorisedPostsObject = {
            'category1': ['post1', 'post2'],
            'category2': ['post2', 'post3']
        };
        const selectedCategories = ['category1', 'category2'];
        const ingredientPostsObject = {
            'ingredient1': ['post1', 'post2'],
            'ingredient2': ['post2', 'post3']
        };
        const selectedIngredients = ['ingredient1', 'ingredient2'];
        const IDsOfAllPosts = ['post1', 'post2', 'post3'];
        const expected = ['post1', 'post2', 'post3'];
        const actual = handleCategoriesOrIngredientsChange({
            categorisedPostsObject, selectedCategories,
            ingredientPostsObject, selectedIngredients,
            IDsOfAllPosts
        });
        expect(actual).toEqual(expected);
    });

    it('returns an array of all postIDs if no categories or ingredients are selected', () => {
        const categorisedPostsObject = {
            'category1': ['post1', 'post2'],
            'category2': ['post3', 'post4']
        };
        const selectedCategories = [];
        const ingredientPostsObject = {
            'ingredient1': ['post1', 'post2'],
            'ingredient2': ['post3', 'post4']
        };
        const selectedIngredients = [];
        const IDsOfAllPosts = ['post1', 'post2', 'post3', 'post4'];
        const expected = ['post1', 'post2', 'post3', 'post4'];
        const actual = handleCategoriesOrIngredientsChange({
            categorisedPostsObject, selectedCategories,
            ingredientPostsObject, selectedIngredients,
            IDsOfAllPosts
        });
        expect(actual).toEqual(expected);
    });

    it('returns an array of postIDs based on their order in IDsOfAllPosts', () => {
        const categorisedPostsObject = {
            'category1': ['post1', 'post2'],
        };
        const selectedCategories = ['category1'];
        const ingredientPostsObject = {
            'ingredient1': ['post3', 'post4'],
        };
        const selectedIngredients = ['ingredient1'];
        const IDsOfAllPosts = ['post2', 'post1', 'post4', 'post3'];
        const expected = ['post2', 'post1', 'post4', 'post3'];
        const actual = handleCategoriesOrIngredientsChange({
            categorisedPostsObject, selectedCategories,
            ingredientPostsObject, selectedIngredients,
            IDsOfAllPosts
        });
        expect(actual).toEqual(expected);
    });
});

