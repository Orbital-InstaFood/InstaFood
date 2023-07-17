import { useState, useEffect } from 'react';

import listenerImplementer from '../../listeners/ListenerImplementer';

import {
  combinePostIDsOfSelectedFields
} from '../commonUtils';

import {
  explore_setupFieldPostsObject,
  calculatePostScore,
  rankPosts,
  handleTitleSearch,
  loadPostsOfSelectedFields
} from './exploreUtils';

/**
 * This hook handles the logic for the explore page.
 * It allows the user to filter posts by category and search for posts by title.
 * It also implements pagination to achieve pseudo-infinite scrolling.
 * It manages posts retrieval from the database
 * by ustilising the listener classes to prevent unnecessary reads.
 */
export default function useExplore() {

  const [userDoc, setUserDoc] = useState(null);
  const [UserDocListener, setUserDocListener] = useState(null);

  const [publicUsers, setPublicUsers] = useState(null);
  const [PublicUsersListener, setPublicUsersListener] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoriesListener, setCategoriesListener] = useState(null);

  const [ingredients, setIngredients] = useState([]);
  const [ingredientsListener, setIngredientsListener] = useState(null);

  const [savedPosts, setSavedPosts] = useState([]);

  // Each key in the object is a category, and the value is an array of postIDs
  const [categorisedPostsObject, setCategorisedPostsObject] = useState(null);
  const [ingredientPostsObject, setIngredientPostsObject] = useState(null);

  const [titleToSearch, setTitleToSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Each key in the object is a postID, and the value is the postDoc
  const [postDocsObjectOfSelectedCategories, setPostDocsObjectOfSelectedCategories] = useState({});
  // An array of objects, each object has the postID and the postScore
  const [postScoreObjectOfSelectedCategories, setPostScoreObjectOfSelectedCategories] = useState([]);
  // An array of postIDs in the selected categories
  const [postIDsOfSelectedCategories, setPostIDsOfSelectedCategories] = useState([]);

  const [postDocsObjectOfSelectedIngredients, setPostDocsObjectOfSelectedIngredients] = useState({});
  const [postScoreObjectOfSelectedIngredients, setPostScoreObjectOfSelectedIngredients] = useState([]);
  const [postIDsOfSelectedIngredients, setPostIDsOfSelectedIngredients] = useState([]);

  // Posts that will be displayed on the explore page
  const [IDsOfRankedFilteredPostsToDisplay, setIDsOfRankedFilteredPostsToDisplay] = useState([]);

  const [isInitialising, setIsInitialising] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  let cleanupFunctions = [];

  async function setup() {

    //Initialise the listeners
    const UserDocListener = await listenerImplementer.getUserDocListener();
    setUserDocListener(UserDocListener);

    const PublicUsersListener = await listenerImplementer.getPublicUsersListener();
    setPublicUsersListener(PublicUsersListener);

    const categoriesListener = await listenerImplementer.getCategoriesListener();
    setCategoriesListener(categoriesListener);

    const ingredientsListener = await listenerImplementer.getIngredientsListener();
    setIngredientsListener(ingredientsListener);

    // Initialise the userProfile, publicUsers and categories
    const userDoc = UserDocListener.getCurrentDocument();
    setUserDoc(userDoc);

    const unfilteredPublicUsers = PublicUsersListener.getCurrentDocument().publicUsers;
    const publicUsers = unfilteredPublicUsers.filter((publicUser) => {
      const isFollowed = userDoc.following.includes(publicUser);
      return !isFollowed;
    });
    setPublicUsers(publicUsers);

    const categories = categoriesListener.getCurrentDocument().categories;
    setCategories(categories);

    const ingredients = ingredientsListener.getCurrentDocument().Ingredients;
    setIngredients(ingredients);

    // Setup subscriptions
    const unsubscribeFromSavedPosts =
      UserDocListener.subscribeToField('savedPosts',
        (savedPosts) => {
          setSavedPosts(savedPosts);
        });
    cleanupFunctions.push(unsubscribeFromSavedPosts);

    await explore_setupFieldPostsObject(
      'category',
      categories,
      listenerImplementer,
      setCategorisedPostsObject,
      userDoc,
      publicUsers,
    );

    await explore_setupFieldPostsObject(
      'ingredient',
      ingredients,
      listenerImplementer,
      setIngredientPostsObject,
      userDoc,
      publicUsers,
    );

    setIsInitialising(false);
  }

  useEffect(() => {
    setup();
    return () => {
      cleanupFunctions.forEach((cleanupFunction) => {
        cleanupFunction();
      });
    };
  }, []);

  useEffect(() => {
    async function handleFilteringWhenSelectedCategoriesChange() {
      const localPostIDsOfSelectedCategories
        = combinePostIDsOfSelectedFields(categorisedPostsObject, selectedCategories);
      setPostIDsOfSelectedCategories(localPostIDsOfSelectedCategories);

      const localPostDocsObjectOfSelectedCategories
        = await loadPostsOfSelectedFields(postDocsObjectOfSelectedCategories, localPostIDsOfSelectedCategories, listenerImplementer);
      setPostDocsObjectOfSelectedCategories(localPostDocsObjectOfSelectedCategories);

      const postsFilteredByCategoriesAndTitle
        = handleTitleSearch(localPostIDsOfSelectedCategories, localPostDocsObjectOfSelectedCategories, titleToSearch);

      const postScoreObjectOfSelectedCategories
        = calculatePostScore(postsFilteredByCategoriesAndTitle, localPostDocsObjectOfSelectedCategories);
      setPostScoreObjectOfSelectedCategories(postScoreObjectOfSelectedCategories);

      const rankedPosts
      = rankPosts(postScoreObjectOfSelectedCategories, postScoreObjectOfSelectedIngredients);
      setIDsOfRankedFilteredPostsToDisplay(rankedPosts);

      setIsFiltering(false);
    }
    setIsFiltering(true);
    handleFilteringWhenSelectedCategoriesChange();
  }, [selectedCategories]);

  useEffect(() => {
    async function handleFilteringWhenSelectedIngredientsChange() {
      const localPostIDsOfSelectedIngredients
        = combinePostIDsOfSelectedFields(ingredientPostsObject, selectedIngredients);
      setPostIDsOfSelectedIngredients(localPostIDsOfSelectedIngredients);

      const localPostDocsObjectOfSelectedIngredients
        = await loadPostsOfSelectedFields(postDocsObjectOfSelectedIngredients, localPostIDsOfSelectedIngredients, listenerImplementer);
      setPostDocsObjectOfSelectedIngredients(localPostDocsObjectOfSelectedIngredients);

      const postsFilteredByIngredientsAndTitle
        = handleTitleSearch(localPostIDsOfSelectedIngredients, localPostDocsObjectOfSelectedIngredients, titleToSearch);

      const postScoreObjectOfSelectedIngredients
        = calculatePostScore(postsFilteredByIngredientsAndTitle, localPostDocsObjectOfSelectedIngredients);
      setPostScoreObjectOfSelectedIngredients(postScoreObjectOfSelectedIngredients);

      const rankedPosts
      = rankPosts(postScoreObjectOfSelectedCategories, postScoreObjectOfSelectedIngredients);

      setIDsOfRankedFilteredPostsToDisplay(rankedPosts);
      setIsFiltering(false);
    }
    setIsFiltering(true);
    handleFilteringWhenSelectedIngredientsChange();
  }, [selectedIngredients]);

  useEffect(() => {
    setIsFiltering(true);

    const filteredCategorisedPosts
      = handleTitleSearch(postIDsOfSelectedCategories, postDocsObjectOfSelectedCategories, titleToSearch);
    const postScoreObjectOfSelectedCategories
      = calculatePostScore(filteredCategorisedPosts, postDocsObjectOfSelectedCategories);

    const filteredIngredientPosts
      = handleTitleSearch(postIDsOfSelectedIngredients, postDocsObjectOfSelectedIngredients, titleToSearch);
    const postScoreObjectOfSelectedIngredients
      = calculatePostScore(filteredIngredientPosts, postDocsObjectOfSelectedIngredients);

    const rankedPosts
      = rankPosts(postScoreObjectOfSelectedCategories, postScoreObjectOfSelectedIngredients);

    setIDsOfRankedFilteredPostsToDisplay(rankedPosts);

    setIsFiltering(false);
  }, [titleToSearch]);

  return {
    userDoc, savedPosts,
    categories,selectedCategories, setSelectedCategories, categorisedPostsObject,
    ingredients, selectedIngredients, setSelectedIngredients, ingredientPostsObject,
    titleToSearch, setTitleToSearch,
    IDsOfRankedFilteredPostsToDisplay,
    isInitialising, isFiltering,
  }
}
