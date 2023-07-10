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

    const POSTS_PER_PAGE = 1;
    let cleanupFunctions = [];

    const [userProfile, setUserProfile] = useState(null);
    const [userDocListener, setUserDocListener] = useState(null);
    const [IDsOfSavedPosts, setIDsOfSavedPosts] = useState([]);

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

    async function setup() {

        // Setup listeners
        const categoriesListener = await listenerImplementer.getCategoriesListener();
        setCategoriesListener(categoriesListener);

        const userDocListener = await listenerImplementer.getUserDocListener();
        // If userDocListener is null, the user has not created a profile
        if (!userDocListener) {
            navigate("/createProfile");
            return;
        }
        setUserDocListener(userDocListener);

        // Initialise userDoc and userProfile
        const userDoc = userDocListener.getCurrentDocument();
        setUserProfile(userDoc);

        // Initialise IDsOfAllPosts
        // All posts are displayed when the user first enters the dashboard
        const allPosts = userDoc.postsToView;
        const IDsOfAllPosts = [...allPosts].reverse();
        setIDsOfAllPosts(IDsOfAllPosts);
        setIDsOfPostsToDisplay(IDsOfAllPosts);
        setIDsOfLoadedPosts(IDsOfAllPosts.slice(0, POSTS_PER_PAGE));
        setMaxNumberOfPages(Math.ceil(IDsOfAllPosts.length / POSTS_PER_PAGE));

        // Retrieve categories from categoriesListener
        const categories = categoriesListener.getCurrentDocument().categories;
        setCategories(categories);

        // Setup subscriptions
        const unsubscribeFromSavedPosts =
            userDocListener.subscribeToField('savedPosts',
                (savedPosts) => {
                    setIDsOfSavedPosts(savedPosts);
                });
        cleanupFunctions.push(unsubscribeFromSavedPosts);

        // Retrieve postIDs in each category
        await dashboard_setupCategorisedPostsObject(
            categories,
            listenerImplementer,
            IDsOfAllPosts,
            setCategorisedPostsObject
        );

        setIsInitialising(false);
    }

    useEffect(() => {
        setup();
        return () => {
            cleanupFunctions.forEach((cleanupFunction) => cleanupFunction());
        }
    }, []);

    useEffect(() => {

        const postIDsOfSelectedCategories =
            combinePostIDsOfSelectedCategories(
                categorisedPostsObject,
                selectedCategories
            );

        let localIDsOfPostsToDisplay = [];
        if (selectedCategories.length === 0) {
            localIDsOfPostsToDisplay = [...IDsOfAllPosts];
        } else {
            localIDsOfPostsToDisplay =
                rankPostsByDate(postIDsOfSelectedCategories, IDsOfAllPosts);
        }
        const localIDsOfLoadedPosts = localIDsOfPostsToDisplay.slice(0, POSTS_PER_PAGE);

        setIDsOfPostsToDisplay(localIDsOfPostsToDisplay);
        setMaxNumberOfPages(Math.ceil(localIDsOfPostsToDisplay.length / POSTS_PER_PAGE));
        setIDsOfLoadedPosts(localIDsOfLoadedPosts);
        setCurrentPage(1);

    }, [selectedCategories]);

    useEffect(() => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        setIDsOfLoadedPosts(IDsOfPostsToDisplay.slice(indexOfFirstPost, indexOfLastPost));
    }, [currentPage]);

    return {
        userProfile, IDsOfSavedPosts,
        categories, selectedCategories, setSelectedCategories, categorisedPostsObject,
        IDsOfPostsToDisplay,
        isInitialising,
        IDsOfLoadedPosts, setCurrentPage, currentPage, maxNumberOfPages
    }
}

export default useDashboard;
