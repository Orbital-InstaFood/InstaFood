/**
 * Seaches for strings in an array that contain ( fully or partially ) a given string
 * 
 * @param {string} text - The text to search for
 * @param {string[]} array - The array to search in
 * @returns {string[]} - The array of strings that contain the given text, in the same order as in the original array
 */
function textSearch ( text, array ) {
    const returnArray = [];
    const arrayLength = array.length;
    for ( let index = 0; index < arrayLength; index++ ) {
        if ( doesWordContainText( array[index], text ) ) {
            returnArray.push( array[index] );
        }
    }
    return returnArray;
}

/**
 * Checks if a string contains another string
 * 
 * @param {string} word - The string to search in
 * @param {string} text - The string to search for
 * @returns {boolean} - True if the word contains the text, false otherwise
 */
function doesWordContainText (word, text) {
    const wordLength = word.length;
    const textLength = text.length;
    for ( let wordIndex = 0; wordIndex + textLength <= wordLength; wordIndex++ ) {
        for ( let textIndex = 0; textIndex < textLength; textIndex++ ) {
            if ( word[wordIndex + textIndex] !== text[textIndex] ) {
                break;
            }
            if ( textIndex === textLength - 1 ) {
                return true;
            }
        }
    }
    return false;
}

export default textSearch;