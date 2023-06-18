import { useState } from 'react';
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConf';
import {categoriesData} from '../theme/categoriesData.js';
//import categorySearch from '../functions/CategorySearch';
//import CaptionSearch from '../functions/CaptionSearch';
import { getPostsByPostIds }from '../functions/postUtils';
import { rankPosts } from '../functions/RankPost';

function ViewPosts() {
  const [searchCategory, setSearchCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchCaption, setSearchCaption] = useState('');

  const handleCategorySearch = async () => {
    // Retrieve the post IDs from the categorisedPosts collection
    const categorisedPostsRef = doc(db, 'categorisedPosts', searchCategory);
    const categorisedPostsDoc = await getDoc(categorisedPostsRef);
    const postIds = categorisedPostsDoc.data()?.post_id_array || [];

    const posts = await getPostsByPostIds(postIds);
    const rankedPosts = rankPosts(posts);
    setSearchResults(rankedPosts);

    console.log(rankedPosts); // Array of posts with their information
    
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

        <input
          type="text"
          placeholder="Search a caption"
          value={searchCaption}
          onChange={(e) => setSearchCaption(e.target.value)}
        />
        <button onClick={handleCaptionSearch}>Search</button>

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
