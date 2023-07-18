import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';

/**
 * This function determines if two images are the same
 * based on their size, name, and type.
 * 
 * @param {*} image1 
 * @param {*} image2 
 * @returns - true if the two images are the same, false otherwise
 */
function _isSameImage(image1, image2) {

    if (image1.size !== image2.size) {
        return false;
    }

    if (image1.name !== image2.name) {
        return false;
    }

    if (image1.type !== image2.type) {
        return false;
    }

    return true;
}

/**
 * This function handles the image change event.
 * It determines if the image uploaded is valid 
 * and if it is a new image.
 * Valid images are added to the array of image objects
 * with a unique id and an image url.
 * 
 * @param {*} e - event object
 * @param {*} existingImageObjects - array of image objects
 * @returns - a new array of image objects
 */
function _handleImageChange(e, existingImageObjects) {
    let newImageObjects = [...existingImageObjects];

    for (const image of e.target.files) {

        const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedImageTypes.includes(image.type)) {
            continue;
        }

        let isExistingImage = false;
        for (const imageObject of existingImageObjects) {
            if (_isSameImage(imageObject.content, image)) {
                isExistingImage = true;
                break;
            }
        }

        if (isExistingImage) {
            continue;
        }

        const newImageObject = {
            content: image,
            uniqueID: generateUniqueID(),
            imageURL: URL.createObjectURL(image),
        };
        newImageObjects.push(newImageObject);
    }

    return newImageObjects;
}

export { _handleImageChange };
