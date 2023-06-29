import DisplayPostUI from '../functions/Post/DisplayPostUI'
import './Dashboard.css';
import { categoriesData } from '../theme/categoriesData.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import useDashboard from './useDashboard';

function Dashboard() {

    const {
        userProfile,
        IDsOfLoadedPosts,
        hasMorePosts,
        isLoadingForUserDoc,
        isLoadingForSubscriptions,
        IDsOfSavedPosts,
        searchCategory,
        setSearchCategory,
        handleSearch,
        _loadMorePosts,
    } = useDashboard();

    if (isLoadingForUserDoc || isLoadingForSubscriptions) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <p className="welcome-message">Welcome, {userProfile.userID}!</p>

            {<div className="search-bar">
                <p>Search for posts by category</p>
                <select
                    id='category'
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
                <div>
                    <button onClick={handleSearch}>Search</button>
                </div>
            </div>}

            {(IDsOfLoadedPosts.length !== 0) && <InfiniteScroll
                dataLength={IDsOfLoadedPosts.length}
                next={_loadMorePosts}
                hasMore={hasMorePosts}
                loader={<p>Loading...</p>}
                endMessage={<p>No more posts to load.</p>}
            >
                {IDsOfLoadedPosts.map(postID => {
                    return <DisplayPostUI
                        postID={postID}
                        userOwnID={userProfile.userID}
                        isAPersonalPost={false}
                        isASavedPost={IDsOfSavedPosts.includes(postID)}
                    />
                }
                )}
            </InfiniteScroll>
            }
        </div>
    )
}

export default Dashboard
