import { useState } from 'react';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConf';
import {categoriesData} from '../theme/categoriesData.js';
import categorySearch from '../functions/CategorySearch';
import CaptionSearch from '../functions/CaptionSearch';
import getPostsByPostIds from '../functions/postUtils';

function ViewPosts() {
  const [searchCategory, setSearchCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    // Retrieve the post IDs from the categorisedPosts collection
    const categorisedPostsRef = doc(db, 'categorisedPosts', searchCategory);
    const categorisedPostsDoc = await getDoc(categorisedPostsRef);
    const postIds = categorisedPostsDoc.data()?.post_id_array || [];

    const posts = await getPostsByPostIds(postIds);
    setSearchResults(posts);

    console.log(posts); // Array of posts with their information
    
  };

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
        
        <button onClick={handleSearch}>Search</button>
        
        {searchResults.map((post) => (
        <div key={post.post_id}>
          <h2>{post.title}</h2>
          <p>{post.caption}</p>
          {post.images.map((image) => (
          <img key={image} src={image} alt="Post Image" />
          ))}
          <p>Likes: {post.likes.length}</p>
          <p>Comments: {post.comments.length}</p>
          </div>
        ))}
        </div>);
}

export default ViewPosts;
