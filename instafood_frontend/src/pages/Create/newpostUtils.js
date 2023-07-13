import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';

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
