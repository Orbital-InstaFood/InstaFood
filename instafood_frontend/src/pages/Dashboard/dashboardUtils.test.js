import {
    rankPostsByDate,
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

