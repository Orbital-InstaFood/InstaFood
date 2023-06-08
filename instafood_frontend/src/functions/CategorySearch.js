import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConf'; 
import textSearch from './textSearch';

function CategorySearch(searchKeywords){
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
      (async () => {
        const categoryCollection = collection(db, 'categories');
        const categorySnapshot = await getDocs(categoryCollection);
        const categoryList = categorySnapshot.docs.map(doc => doc.data());

        const filteredCategories = textSearch(searchKeywords, categoryList);
        setFilteredCategories(filteredCategories);
       })();
    }, [searchKeywords]);
    
    return filteredCategories;
}

export default CategorySearch;
