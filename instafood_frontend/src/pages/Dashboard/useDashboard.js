import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import listenerImplementer from '../../listeners/ListenerImplementer';

import {
    rankPostsByDate,
    dashboard_setupCategorisedPostsObject
} from './dashboardUtils';

import {
    combinePostIDsOfSelectedCategories, 
} from '../commonUtils';

function useDashboard() {

    const POSTS_PER_PAGE = 10;

    const [userProfile, setUserProfile] = useState(null);
    const [userDocListener, setUserDocListener] = useState(null);
    const [IDsOfSavedPosts, setIDsOfSavedPosts] = useState([]);

    // isValidUser is true if the user has a valid profile, and false otherwise
    // It is used to determine whether to display the dashboard or the create profile page
    const [isValidUser, setIsValidUser] = useState(true);

    // allPosts is the array of all posts that the user has access to at the dashboard
    // It should not be modified once initialized
    const [IDsOfAllPosts, setIDsOfAllPosts] = useState([]);

    // postsToDisplay is the array of posts that the user sees on the dashboard
    // It is a subset of allPosts, and is modified when the user filters the posts
    const [IDsOfPostsToDisplay, setIDsOfPostsToDisplay] = useState([]);
    const [IDsOfLoadedPosts, setIDsOfLoadedPosts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [maxNumberOfPages, setMaxNumberOfPages] = useState(null);

    const [categories, setCategories] = useState([]);
    const [categoriesListener, setCategoriesListener] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categorisedPostsObject, setCategorisedPostsObject] = useState(null);

    const [isInitialising, setIsInitialising] = useState(true);

    const navigate = useNavigate();

    /**
     * This function sets up the listener for the user document
     * Also checks if the user has a user document via validateUserDoc()
     */
    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        _validateUserDoc(userDocListener);
        setUserDocListener(userDocListener);

        const categoriesListener = await listenerImplementer.getCategoriesListener();
        setCategoriesListener(categoriesListener);
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
     * This function initialises the userProfile, IDsOfAllPosts and categories
     */
    function initialiseDocumentStates() {

        // Initialise userDoc and userProfile
        const userDoc = userDocListener.getCurrentDocument();
        setUserProfile(userDoc);

        // Initialise IDsOfAllPosts and IDsOfPostsToDisplay
        const allPosts = userDoc.postsToView;
        const reversedAllPosts = [...allPosts].reverse();
        setIDsOfAllPosts(reversedAllPosts);
        setIDsOfPostsToDisplay(reversedAllPosts);

        const categoriesDoc = categoriesListener.getCurrentDocument();
        setCategories(categoriesDoc.categories);
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

        if (userDocListener && categoriesListener) {
            initialiseDocumentStates();
            const cancelAllSubscriptions = setupSubscriptions();
            return () => {
                cancelAllSubscriptions();
            }
        }
    }, [userDocListener, categoriesListener]);

    useEffect(() => {
        if (userProfile && IDsOfAllPosts && categories) {
            dashboard_setupCategorisedPostsObject(
                categories, 
                listenerImplementer, 
                IDsOfAllPosts, 
                setCategorisedPostsObject);
        }
    }, [userProfile, IDsOfAllPosts, categories]);

    useEffect(() => {
        if (categorisedPostsObject) {
            setIDsOfLoadedPosts(IDsOfAllPosts.slice(0, POSTS_PER_PAGE));
            setMaxNumberOfPages(Math.ceil(IDsOfAllPosts.length / POSTS_PER_PAGE));
            setIsInitialising(false);
        }
    }, [categorisedPostsObject]);

    useEffect(() => {

        const combinedArrayOfPostIDsOfSelectedCategories =
            combinePostIDsOfSelectedCategories(
                categorisedPostsObject,
                selectedCategories
            );

        let localIDsOfPostsToDisplay = [];

        if (selectedCategories.length === 0) {
            localIDsOfPostsToDisplay = [...IDsOfAllPosts];
        } else {
         localIDsOfPostsToDisplay =
            rankPostsByDate(combinedArrayOfPostIDsOfSelectedCategories, IDsOfAllPosts);
        }

        setIDsOfPostsToDisplay(localIDsOfPostsToDisplay);

        setMaxNumberOfPages( Math.ceil(localIDsOfPostsToDisplay.length / POSTS_PER_PAGE) );

        const localIDsOfLoadedPosts = localIDsOfPostsToDisplay.slice(0, POSTS_PER_PAGE);
        setIDsOfLoadedPosts(localIDsOfLoadedPosts);

        setCurrentPage(1);

    }, [selectedCategories]);

    useEffect(() => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        setIDsOfLoadedPosts( IDsOfPostsToDisplay.slice(indexOfFirstPost, indexOfLastPost) );
    }, [currentPage]);

    function handleNextPage() {
        setCurrentPage((prevPage) => prevPage + 1);
    }

    function handlePreviousPage() {
        setCurrentPage((prevPage) => prevPage - 1);
    }

    return {
        userProfile, IDsOfSavedPosts,
        categories, selectedCategories, setSelectedCategories, postCategoriesObject: categorisedPostsObject,
        IDsOfPostsToDisplay,
        isInitialising,
        IDsOfLoadedPosts, handleNextPage, handlePreviousPage, currentPage, maxNumberOfPages
    }
}

export default useDashboard;