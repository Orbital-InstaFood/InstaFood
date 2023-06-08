import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConf'; 
import textSearch from './textSearch';

function CaptionSearch(searchKeywords){
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
      (async () => {
        const postCollection = collection(db, 'posts');
        const postSnapshot = await getDocs(postCollection);
        const postList = postSnapshot.docs.map(doc => doc.data());

        const postCaptions = postList.map(post => post.caption);

        const filteredPosts = textSearch(searchKeywords, postCaptions);
        setFilteredPosts(filteredPosts);
       })();
    }, [searchKeywords]);
    
    return filteredPosts;
}

export default CaptionSearch;
