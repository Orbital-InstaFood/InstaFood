import { useEffect, useState } from 'react';
import './Dashboard.css';
import { db } from '../firebaseConf';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import listenerImplementer from '../listeners/ListenerImplementer';

/**
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

function useDashboard() {
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
    const numOfPostsToLoad = 1;

    const [searchCategory, setSearchCategory] = useState('');

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
    function _validateUserDoc(userDocListener) {
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
    function initialisations() {

        // Initialise userDoc and userProfile
        const userDoc = userDocListener.getCurrentDocument();
        setUserProfile(userDoc);

        // Initialise IDsOfAllPosts and IDsOfPostsToDisplay
        const allPosts = userDoc.postsToView;
        const reversedAllPosts = [...allPosts].reverse();
        setIDsOfAllPosts(reversedAllPosts);
        setIDsOfPostsToDisplay(reversedAllPosts);

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
            initialisations();
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
     * 
     * @todo
     * - Refine search functionality & utilise lazy loading
     */
    async function handleSearch() {
        setHasMorePosts(true);
        if (searchCategory) {
            const filteredPosts = [];
            for (let i = 0; i < IDsOfAllPosts.length; i++) {
                const postID = IDsOfAllPosts[i];
                const postRef = doc(db, 'posts', postID);
                const postDoc = await getDoc(postRef);
                if (postDoc.exists()) {
                    const post = postDoc.data();
                    if (
                        (post.category.includes(searchCategory)) 
                    ) {
                        filteredPosts.push(postID);
                    }
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
        setHasMorePosts(true);
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

    return {
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
    }
}

export default useDashboard;
