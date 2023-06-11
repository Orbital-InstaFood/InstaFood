import React, { useState } from 'react';
import categorySearch from '../functions/CategorySearch';
import CaptionSearch from '../functions/CaptionSearch';

function ViewPosts() {
  const [searchKeywordsCategories, setSearchKeywordsCategories] = useState('');
  const [searchKeywordsCaptions, setSearchKeywordsCaptions] = useState('');

  const filteredCategories = categorySearch(searchKeywordsCategories);
  const filteredPosts = CaptionSearch(searchKeywordsCaptions);

  return (
    <div>
      <h1>View Posts</h1>
      
      
      <input 
        type="text"
        placeholder="Search categories"
        value={searchKeywordsCategories}
        onChange={(e) => setSearchKeywordsCategories(e.target.value)}
      />

      <input 
        type="text"
        placeholder="Search captions"
        value={searchKeywordsCaptions}
        onChange={(e) => setSearchKeywordsCaptions(e.target.value)}
      />

      <div>
        <h2>Categories</h2>
        {filteredCategories.map((category, index) => (
          <p key={index}>{category}</p>
        ))}
      </div>

      <div>
        <h2>Posts</h2>
        {filteredPosts.map((post, index) => (
          <p key={index}>{post.caption}</p>
        ))}
      </div>
    </div>
  );
}

export default ViewPosts;
