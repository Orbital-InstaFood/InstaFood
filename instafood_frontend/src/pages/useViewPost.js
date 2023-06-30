import { useState, useEffect } from 'react';
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConf';
import { getPostsByPostIds } from '../functions/postUtils';

import rankPosts from '../functions/rankPosts';

export function ViewPostsLogic() {
  const [searchCategory, setSearchCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [rankedResults, setRankedResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const numOfPostsToLoad = 2;

  const handleCategorySearch = async () => {
    const categorisedPostsRef = doc(db, 'categorisedPosts', searchCategory);
    const categorisedPostsDoc = await getDoc(categorisedPostsRef);
    const postIds = categorisedPostsDoc.data()?.post_id_array || [];
  
    const posts = await getPostsByPostIds(postIds);
    //setSearchResults(posts);

    const updatedPosts = rankPosts(posts);
    setSearchResults(updatedPosts); //
  
//    const rankedResults = rankPosts(updatedPosts);
//    setRankedResults(rankedResults);
  };

  const handleTitleSearch = async () => {
    const q = query(collection(db, 'posts'), where('title', '==', searchTitle));

    getDocs(q)
      .then((querySnapshot) => {
        let results = [];

        querySnapshot.forEach((doc) => {
          const documentData = doc.data();
          results.push(documentData);
        });
        setSearchResults(results);
      })
      .catch((error) => {
        console.error('Error searching documents:', error);
      });
  };
  
  useEffect(() => {
    setLoadedPosts([]);
    if (searchResults.length < numOfPostsToLoad) {
   // if (rankedResults.length < numOfPostsToLoad) {
      setLoadedPosts();
    } else {
      setLoadedPosts(searchResults.slice(0, numOfPostsToLoad));
    }
    setLoading(false);
  }, [searchResults]);

  function loadMorePosts() {
    if (loadedPosts.length >= searchResults.length) {
      setHasMorePosts(false);
      return;
    }
    const newPosts = searchResults.slice(loadedPosts.length, loadedPosts.length + numOfPostsToLoad);
    setLoadedPosts([...loadedPosts, ...newPosts]);
  }

  return {
    searchCategory,
    setSearchCategory,
    searchResults,
    searchTitle,
    setSearchTitle,
    rankedResults,
    loading,
    loadedPosts,
    hasMorePosts,
    handleCategorySearch,
    handleTitleSearch,
    loadMorePosts,
  };
}
