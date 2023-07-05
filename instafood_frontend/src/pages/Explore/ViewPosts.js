import InfiniteScroll from 'react-infinite-scroll-component';
import displayImage from '../functions/displayImage';
import { categoriesData } from '../../theme/categoriesData.js';
import { ViewPostsLogic } from './useViewPost';


function ViewPosts(){
  const{
  searchCategory,
  setSearchCategory,
  searchTitle,
  setSearchTitle,
  loading,
  loadedPosts,
  hasMorePosts,
  handleCategorySearch,
  handleTitleSearch,
  loadMorePosts,
  } = ViewPostsLogic();

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
        {categoriesData.map((category, index) => (
          <option key={index} value={index}>
            {category}
          </option>
        ))}
      </select>

      <button onClick={handleCategorySearch}>Search</button>

      <br />

      <input
        type="text"
        placeholder="Search title"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
      />
      <button onClick={handleTitleSearch}>Search</button>

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
           {post.images.length > 0 && post.images.map((image) => displayImage(image))}
            <p>Likes: {post.likes.length}</p>
            <p>Comments: {post.comments.length}</p>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ViewPosts;