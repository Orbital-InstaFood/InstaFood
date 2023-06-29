import { useState, useEffect } from 'react';
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConf';
import { categoriesData } from '../theme/categoriesData.js';
import { getPostsByPostIds } from '../functions/postUtils';

export function ViewPostsLogic() {
  const [searchCategory, setSearchCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchCaption, setSearchCaption] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const numOfPostsToLoad = 2;

  const handleCategorySearch = async () => {
    const categorisedPostsRef = doc(db, 'categorisedPosts', searchCategory);
    const categorisedPostsDoc = await getDoc(categorisedPostsRef);
    const postIds = categorisedPostsDoc.data()?.post_id_array || [];

    const posts = await getPostsByPostIds(postIds);
    setSearchResults(posts);
  };

  const handleCaptionSearch = async () => {
    const q = query(collection(db, 'posts'), where('caption', '==', searchCaption));

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
      setLoadedPosts(searchResults);
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
    searchCaption,
    setSearchCaption,
    loading,
    loadedPosts,
    hasMorePosts,
    handleCategorySearch,
    handleCaptionSearch,
    loadMorePosts,
  };
}
