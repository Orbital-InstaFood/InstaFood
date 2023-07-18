import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import listenerImplementer from '../../listeners/ListenerImplementer';

import {
    dashboard_setupFieldPostsObject,
    handleCategoriesOrIngredientsChange,
} from './dashboardUtils';

/**
 * This hook handles the logic for the dashboard page.
 * It allows the user to filter posts by category.
 * It also implements pagination to achieve pseudo-infinite scrolling.
 */
export default function useDashboard() {

    const POSTS_PER_PAGE = 20;
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

    // loadedPosts is the array of posts that the user sees on the dashboard at the current page
    const [IDsOfLoadedPosts, setIDsOfLoadedPosts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [maxNumberOfPages, setMaxNumberOfPages] = useState(null);

    const [categories, setCategories] = useState([]);
    const [categoriesListener, setCategoriesListener] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categorisedPostsObject, setCategorisedPostsObject] = useState(null);

    const [ingredients, setIngredients] = useState([]);
    const [ingredientsListener, setIngredientsListener] = useState(null);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredientPostsObject, setIngredientPostsObject] = useState(null);

    const [isInitialising, setIsInitialising] = useState(true);

    const navigate = useNavigate();

    async function setup() {

        const userDocListener = await listenerImplementer.getUserDocListener();
        // If userDocListener is null, the user has not created a profile
        if (!userDocListener) {
            navigate("/createProfile");
            return;
        }
        setUserDocListener(userDocListener);

        const categoriesListener = await listenerImplementer.getCategoriesListener();
        setCategoriesListener(categoriesListener);

        const ingredientsListener = await listenerImplementer.getIngredientsListener();
        setIngredientsListener(ingredientsListener);

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

        // Retrieve ingredients from ingredientsListener    
        const ingredients = ingredientsListener.getCurrentDocument().Ingredients;
        setIngredients(ingredients);

        // Setup subscriptions
        const unsubscribeFromSavedPosts =
            userDocListener.subscribeToField('savedPosts',
                (savedPosts) => {
                    setIDsOfSavedPosts(savedPosts);
                });
        cleanupFunctions.push(unsubscribeFromSavedPosts);

        await dashboard_setupFieldPostsObject(
            'category',
            categories,
            listenerImplementer,
            IDsOfAllPosts,
            setCategorisedPostsObject
        );

        await dashboard_setupFieldPostsObject(
            'ingredient',
            ingredients,
            listenerImplementer,
            IDsOfAllPosts,
            setIngredientPostsObject
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

        const IDsOfPostsToDisplay = handleCategoriesOrIngredientsChange({
            categorisedPostsObject: categorisedPostsObject, selectedCategories: selectedCategories,
            ingredientPostsObject: ingredientPostsObject, selectedIngredients: selectedIngredients,
            IDsOfAllPosts: IDsOfAllPosts
        });
        setIDsOfPostsToDisplay(IDsOfPostsToDisplay);

        const localIDsOfLoadedPosts 
        = IDsOfPostsToDisplay.slice(0, POSTS_PER_PAGE);
        setIDsOfLoadedPosts(localIDsOfLoadedPosts);
        setMaxNumberOfPages(Math.ceil(IDsOfPostsToDisplay.length / POSTS_PER_PAGE));
        setCurrentPage(1);

    }, [selectedCategories, selectedIngredients]);

    useEffect(() => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        setIDsOfLoadedPosts(IDsOfPostsToDisplay.slice(indexOfFirstPost, indexOfLastPost));
    }, [currentPage]);

    return {
        userProfile, IDsOfSavedPosts,
        categories, selectedCategories, setSelectedCategories, categorisedPostsObject,
        ingredients, selectedIngredients, setSelectedIngredients, ingredientPostsObject,
        IDsOfPostsToDisplay,
        isInitialising,
        IDsOfLoadedPosts, setCurrentPage, currentPage, maxNumberOfPages
    }
}
