import { useState, useEffect } from 'react';
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConf';
import {categoriesData} from '../theme/categoriesData.js';
//import categorySearch from '../functions/CategorySearch';
//import CaptionSearch from '../functions/CaptionSearch';
import { getPostsByPostIds }from '../functions/postUtils';
//import { rankPosts } from '../functions/RankPost';
import displayImage from '../functions/displayImage'

import InfiniteScroll from 'react-infinite-scroll-component';

/**
 * 
 * @returns ViewPosts page
 * 
 * @description 
 * This page allows the user to search for All posts based on category and caption.
 * 
 * @todo
 * - Refine search functionality and UI design
 * - Add rankPosts functionality
 * 
 */

function ViewPosts() {
  const [searchCategory, setSearchCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]); //Array of ALL posts that fulfil the search criteria
  const [searchCaption, setSearchCaption] = useState('');

  const [loading, setLoading] = useState(true); 
  const [loadedPosts, setLoadedPosts] = useState([]); //Array of posts that are loaded on the page within the limited number of posts to load
  const [hasMorePosts, setHasMorePosts] = useState(true); 
  const numOfPostsToLoad = 2;

  const handleCategorySearch = async () => {
    // Retrieve the post IDs from the categorisedPosts collection
    const categorisedPostsRef = doc(db, 'categorisedPosts', searchCategory);
    const categorisedPostsDoc = await getDoc(categorisedPostsRef);
    const postIds = categorisedPostsDoc.data()?.post_id_array || [];

    const posts = await getPostsByPostIds(postIds);
    setSearchResults(posts);
    // const rankedPosts = rankPosts(posts);
    console.log(posts); // Array of posts with their information
    
  };

  const handleCaptionSearch = async () => {
    const q = query(collection(db, "posts"), where("caption", "==", searchCaption));

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
      console.error("Error searching documents:", error);
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
  
  if (loading) {
    return (
        <div>
            <p>Loading...</p>
        </div>
    );
  }

  return (
      
      <div>
        <h1>View Posts</h1>
        
        <select
          id="category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        > 
          <option value="">Search a category</option>
          {categoriesData.map((category,index) => (
            <option key={index} value={index}>
              {category}
            </option>
          ))}
        </select>
        
        <button onClick={handleCategorySearch}>Search</button>
        
        <br />

        <input
          type="text"
          placeholder="Search a caption"
          value={searchCaption}
          onChange={(e) => setSearchCaption(e.target.value)}
        />
        <button onClick={handleCaptionSearch}>Search</button>
        
        <InfiniteScroll
        dataLength={loadedPosts.length}
        next={loadMorePosts}
        hasMore={hasMorePosts}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more posts</p>}
        >
        {loadedPosts.map((post) => (
        <div key={post.post_id}>
          <h2>{post.title}</h2>
          <p>{post.caption}</p>
          {post.images.length > 0 && post.images.map((image) => (
            displayImage(image)
          ))}
          <p>Likes: {post.likes.length}</p>
          <p>Comments: {post.comments.length}</p>
          </div>
        ))}
        </InfiniteScroll>
        
        </div>);
      }
      
      export default ViewPosts;
