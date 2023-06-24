import { useEffect, useState } from 'react';
import DisplayPostUI from '../functions/Post/DisplayPostUI'
import './Dashboard.css';
import {categoriesData} from '../theme/categoriesData.js';

import { auth, db } from '../firebaseConf';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import listenerImplementer from '../listeners/ListenerImplementer';

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
    const [isLoadingForUserDoc, setIsLoadingForUserDoc] = useState(true);

    // isValidUser is true if the user has a valid profile, and false otherwise
    // It is used to determine whether to display the dashboard or the create profile page
    const [isValidUser, setIsValidUser] = useState(true);

    // allPosts is the array of all posts that the user has access to at the dashboard
    // It should not be modified once initialized
    const [IDsOfAllPosts, setIDsOfAllPosts] = useState([]);

    // postsToDisplay is the array of posts that the user sees on the dashboard
    // It is a subset of allPosts, and is modified when the user searches for posts
    // based on caption or category
    const [IDsOfPostsToDisplay, setIDsOfPostsToDisplay] = useState([]);

    // State variables for infinite scroll
    const [IDsOfLoadedPosts, setIDsOfLoadedPosts] = useState([]);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const numOfPostsToLoad = 2;

    // State variables for search functionality
    const [searchCaption, setSearchCaption] = useState([]);
    const [searchCategory, setSearchCategory] = useState([]);
    
    // State variables for subscriptions
    const [userDocListener, setUserDocListener] = useState(null);
    const [IDsOfSavedPosts, setIDsOfSavedPosts] = useState([]);
    const [isLoadingForSubscriptions, setIsLoadingForSubscriptions] = useState(true);

    const navigate = useNavigate();

    /**
     * This function sets up the listener for the user document
     * Also checks if the user has a user document via validateUserDoc()
     */
    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        _validateUserDoc(userDocListener);
        setUserDocListener(userDocListener);
    }

    /**
     * This function checks if the user has a user document
     * If not, it redirects the user to the createProfile page
     * It is a helper function for setupListeners()
     * @param {Listener} userDocListener
     */
    function _validateUserDoc (userDocListener) {
        if (!userDocListener) {
            navigate("/createProfile");
            setIsValidUser(false);
        }
    }

    /**
     * These useEffects are for setting up the listener for the user document
     * It is the first layer of the setup process
     */
    useEffect(() => {
        setupListeners();
    }, []);

    useEffect(() => {
        if (!isValidUser) {
            return;
        }
    }, [isValidUser]);


    /**
     * This function initialises the user document
     * It then retrieves all the posts that the user has access to
     */
    function initialiseUserDoc() {
        const userDoc = userDocListener.getCurrentDocument();
        setUserProfile(userDoc);

        const allPosts = userDoc.postsToView.reverse();
        setIDsOfAllPosts(allPosts);
        setIDsOfPostsToDisplay(allPosts);

        setIsLoadingForUserDoc(false);
    }

    /**
     * This function sets up subscriptions for the user document
     * @returns {Function} - cancel subscriptions when component unmounts
     */
    function setupSubscriptions() {
        const unsubscribeFromSavedPosts =
            userDocListener.subscribeToField('savedPosts',
                (savedPosts) => {
                    setIDsOfSavedPosts(savedPosts);
                });

        return () => {
            unsubscribeFromSavedPosts();
        }
    }

    /**
     * This useEffect is for initialising the user document and setting up subscriptions
     * It is the second layer of the setup process
     * It is only run after the listener is fully set up
     */
    useEffect(() => {

        if (userDocListener) {
            initialiseUserDoc();
            const unsubscribeFromSavedPosts = setupSubscriptions();
            setIsLoadingForSubscriptions(false);

            return () => {
                unsubscribeFromSavedPosts();
            }
        }
    }, [userDocListener]);

    /**
     * This function handles the search functionality
     * It filters the posts based on the search category and caption
     * It then sets the posts to display to the filtered posts
     */
     async function handleSearch() {
        if (searchCategory || searchCaption) {
          const filteredPosts = [];
          for (let i = 0; i < IDsOfAllPosts.length; i++) {
            const postID = IDsOfAllPosts[i];
            const postRef = doc(db, 'posts', postID);
            const postDoc = await getDoc(postRef);
            if (postDoc.exists()) {
              const post = postDoc.data();
              if (
                (searchCategory && !post.category.includes(searchCategory)) ||
                (searchCaption && !post.caption.toLowerCase().includes(searchCaption.toLowerCase()))
              ) {
                continue;
              }
              filteredPosts.push(postID);
            }
          }
          setIDsOfPostsToDisplay(filteredPosts);
        } else {
        setIDsOfPostsToDisplay(IDsOfAllPosts);
        }
      }
      

    /**
     * This useEffect is for setting the loaded posts to display
     * It is run whenever the posts to display changes
     * It is also run when the component first mounts
     */
    useEffect(() => {
        if (IDsOfPostsToDisplay.length < numOfPostsToLoad) {
            setIDsOfLoadedPosts(IDsOfPostsToDisplay);
        } else {
            setIDsOfLoadedPosts(IDsOfPostsToDisplay.slice(0, numOfPostsToLoad));
        }
    }, [IDsOfPostsToDisplay]);


    /**
     * This function loads more posts to display
     * It is called when the user scrolls to the bottom of the page
     * It is a helper function for the InfiniteScroll component
     */
    function _loadMorePosts() {
        const numOfPostsLoaded = IDsOfLoadedPosts.length;
        if (numOfPostsLoaded + numOfPostsToLoad > IDsOfPostsToDisplay.length) {
            setIDsOfLoadedPosts(IDsOfPostsToDisplay);
            setHasMorePosts(false);
        } else {
            setIDsOfLoadedPosts(IDsOfLoadedPosts.concat(IDsOfPostsToDisplay.slice(numOfPostsLoaded, numOfPostsLoaded + numOfPostsToLoad)));
        }
    }

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

            { <div className="search-bar">
                <select
                    id = 'category'
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
                <input
                    type="text"
                    placeholder="Search by caption"
                    value={searchCaption}
                    onChange={(e) => setSearchCaption(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div> }

            { (IDsOfLoadedPosts.length !== 0 ) && <InfiniteScroll
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
