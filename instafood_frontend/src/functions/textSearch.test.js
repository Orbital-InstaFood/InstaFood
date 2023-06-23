import textSearch from "./textSearch";

describe( "textSearch", () => {

    test( "returns an empty array if the array is empty", () => {
        const textToSearch = "test";
        const arrayToSearchIn = [];
        expect( textSearch( textToSearch, arrayToSearchIn ) ).toEqual( [] );
    });

    test( "returns an empty array if the text is empty", () => {
        const textToSearch = "";
        const arrayToSearchIn = [ "test" ];
        expect( textSearch( textToSearch, arrayToSearchIn ) ).toEqual( [] );
    });

    test ("returns an empty array if both the text and the array are empty", () => {
        const textToSearch = "";
        const arrayToSearchIn = [];
        expect( textSearch( textToSearch, arrayToSearchIn ) ).toEqual( [] );
    });

    test( "returns an empty array if the text is not found", () => {
        const textToSearch = "test";
        const arrayToSearchIn = [ "not", "found" ];
        expect( textSearch( textToSearch, arrayToSearchIn ) ).toEqual( [] );
    });

    test ( "returns an array with the text if the text is found multiple times", () => {
        const textToSearch = "test";
        const arrayToSearchIn = [ "not", "test", "found", "tested" ];
        expect( textSearch( textToSearch, arrayToSearchIn ) ).toEqual( [ "test", "tested" ] );
    });

});

    