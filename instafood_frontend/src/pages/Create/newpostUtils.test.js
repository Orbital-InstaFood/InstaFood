import {
    _handleImageChange,
} from './newpostUtils';

URL.createObjectURL = jest.fn(() => 'imageURL');

describe('_handleImageChange', () => {

    const image1 = {
        size: 100,
        name: 'image1',
        type: 'image/png',
    };

    const image2 = {
        size: 200,
        name: 'image2',
        type: 'image/jpeg',
    };

    const image3 = {
        size: 300,
        name: 'image3',
        type: 'image/jpg',
    };

    it('rejects images that are not png, jpeg, or jpg', () => {
        const existingImageObjects = [];

        const e = 
        { target: 
            {
                files: [{
                    size: 100,
                    name: 'image1',
                    type: 'image/gif',
                }],
            },
        };

        const finalImageObjects = _handleImageChange(e, existingImageObjects);
        expect(finalImageObjects).toEqual(existingImageObjects);
    });

    it('returns the same array if image added already exists', () => {
        const existingImageObjects = [
            { content: image1, uniqueID: '1', imageURL: 'imageURL1'},
            { content: image2, uniqueID: '2', imageURL: 'imageURL2'},
        ];

        const e = 
        { target: 
            {
                files: [image1],
            },
        };

        const finalImageObjects = _handleImageChange(e, existingImageObjects);
        expect(finalImageObjects).toEqual(existingImageObjects);
    });

    it('adds new images to the array', () => {

        const existingImageObjects = [
            { content: image1, uniqueID: '1', imageURL: 'imageURL1'},
            { content: image2, uniqueID: '2', imageURL: 'imageURL2'},
        ];

        const e = 
        { target: 
            {
                files: [image3],
            },
        };

        const finalImageObjects = _handleImageChange(e, existingImageObjects);
        expect(finalImageObjects).toEqual([
            { content: image1, uniqueID: '1', imageURL: 'imageURL1'},
            { content: image2, uniqueID: '2', imageURL: 'imageURL2'},
            { content: image3, uniqueID: expect.any(String)},
        ]);
    });

});