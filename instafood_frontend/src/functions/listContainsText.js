function listContainsText ( text, list ) {
    for (let i = 0; i < list.length; i++) {
        if (text === list[i]) {
            return true;
        }
    }
    return false;
}

export default listContainsText;