import { useEffect, useState } from 'react';
import useDisplayPostLogic from '../functions/Post/useDisplayPostLogic.js';
import './Dashboard.css';
import { auth, db } from '../firebaseConf';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

/**
 * 
 * @returns Dashboard page
 * 
 * @description
 * This page displays posts that the user has access to, 
 * specifically posts created by the user's followings after he has followed that following.
 * 
 * @todo
 * - Refine search functionality
 * - Add rankPosts functionality
 * 
 */

function Dashboard() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState([]);

    const [loadedPosts, setLoadedPosts] = useState([]);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const numOfPostsToLoad = 2;

    const [searchCaption, setSearchCaption] = useState([]);
    const [searchCategory, setSearchCategory] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function getUserInfo() {
            const user = auth.currentUser;

            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                navigate("/createProfile");
                return;
            } else {
                const userDocData = userDoc.data();
                setUserProfile(userDocData);

                const allPosts = userDocData.postsToView.reverse();
                setAllPosts(allPosts);

                async function handleSearch() {
                    if (searchCategory || searchCaption) {
                        // Filter posts based on search category and caption
                        const filteredPosts = allPosts.filter((post) => {
                            if (searchCategory && !post.category.includes(searchCategory)) {
                                return false;
                            }
                            if (searchCaption && !post.caption.toLowerCase().includes(searchCaption.toLowerCase())) {
                                return false;
                            }
                            return true;
                        });
                        setSearchResults([]);
                        if (filteredPosts.length < numOfPostsToLoad) {
                            setSearchResults(filteredPosts);
                        } else {
                            setSearchResults(filteredPosts.slice(0, numOfPostsToLoad));
                        }
                    } else { // If no search input, display posts in reverse order
                        setSearchResults([]);
                        if (allPosts.length < numOfPostsToLoad) {
                            setLoadedPosts(allPosts);
                        } else {
                            setLoadedPosts(allPosts.slice(0, numOfPostsToLoad));
                        }
                    }
                }

                setLoading(false);
            }
        }
        getUserInfo();
    }, [searchCategory, searchCaption]);

    function loadMorePosts() {
        const numOfPostsLoaded = loadedPosts.length;
        if (numOfPostsLoaded + numOfPostsToLoad > allPosts.length) {
            setLoadedPosts(allPosts);
            setHasMorePosts(false);
        } else {
            setLoadedPosts(loadedPosts.concat(allPosts.slice(numOfPostsLoaded, numOfPostsLoaded + numOfPostsToLoad)));
        }
    }

    if (loading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (loadedPosts.length === 0) {
        return (
            <div className="container">
                <p className="welcome-message">Welcome, {userProfile.userID}!</p>
            </div>
        );
    }

    return (
        <div className="container">
            <p className="welcome-message">Welcome, {userProfile.userID}!</p>
            <div className="search-bar">
                <input
                    type='text'
                    placeholder='Search by category'
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by caption"
                    value={searchCaption}
                    onChange={(e) => setSearchCaption(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <InfiniteScroll
                dataLength={loadedPosts.length}
                next={loadMorePosts}
                hasMore={hasMorePosts}
                loader={<p>Loading...</p>}
                endMessage={<p>No more posts to load.</p>}
            >
                {searchResults.length > 0 ? (
                    searchResults.map((post) => (
                        <useDisplayPostLogic
                            key={post.postID}
                            postID={post.postID}
                            userOwnID={userProfile.userID}
                        />
                    ))
                ) : (
                    loadedPosts.map((postID) => (
                        <useDisplayPostLogic
                            key={postID}
                            postID={postID}
                            userOwnID={userProfile.userID}
                        />
                    ))
                )}
            </InfiniteScroll>
        </div>
);}

export default Dashboard
