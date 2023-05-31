function textSearch ( text, array ) {

    function doesAcontainB (wordA, wordB) {
        const wordALength = wordA.length;
        const wordBLength = wordB.length;
        for ( let i = 0; i + wordBLength <= wordALength; i++ ) {
            for ( let j = 0; j < wordBLength; j++ ) {
                if ( wordA[i+j] !== wordB[j] ) {
                    break;
                }
                if ( j === wordBLength - 1 ) {
                    return true;
                }
            }
        }
        return false;
    }

    const returnArray = [];
    for ( let i = 0; i < array.length; i++ ) {
        if ( doesAcontainB (array[i], text) ) {
            returnArray.push(array[i]);
        }
    }

    return returnArray;
}

export default textSearch;