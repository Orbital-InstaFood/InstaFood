import { useState, useEffect } from 'react';

import listenerImplementer from '../../listeners/ListenerImplementer';

import {
  explore_setupFieldPostsObject,
  handleSelectedFieldAChange,
  handleTitleChange,
} from './exploreUtils';

/**
 * This hook handles the logic for the explore page.
 * It allows the user to filter posts by category and search for posts by title.
 * It also implements pagination to achieve pseudo-infinite scrolling.
 * It manages posts retrieval from the database
 * by ustilising the listener classes to prevent unnecessary reads.
 * 
 * Note that postScoreObjects are only updated when selected categories/ingredients change,
 * not when the title changes.
 * This ensures that postScoreObjects always contain postIDs 
 * of ALL posts that are in the selected categories/ingredients.
 * However, IDsOfRankedFilteredPostsToDisplay is updated when the title changes.
 * Here, the updated postScoreObjects are used internally to filter the posts,
 * and not updated in the state.
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
  const [postDocsObject, setPostDocsObject] = useState({});

  // An array of objects, each object has the postID and the postScore
  const [postScoreObjectOfSelectedCategories, setPostScoreObjectOfSelectedCategories] = useState([]);
  // An array of postIDs in the selected categories
  const [postIDsOfSelectedCategories, setPostIDsOfSelectedCategories] = useState([]);

  const [postScoreObjectOfSelectedIngredients, setPostScoreObjectOfSelectedIngredients] = useState([]);
  const [postIDsOfSelectedIngredients, setPostIDsOfSelectedIngredients] = useState([]);

  // Posts that will be displayed on the explore page
  const [IDsOfRankedFilteredPostsToDisplay, setIDsOfRankedFilteredPostsToDisplay] = useState([]);

  const [isInitialising, setIsInitialising] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  let cleanupFunctions = [];


  useEffect(() => {
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
    setup();
    return () => {
      cleanupFunctions.forEach((cleanupFunction) => {
        cleanupFunction();
      });
    };
  }, []);

  useEffect(() => {
    setIsFiltering(true); 
    async function handleSelectedCategoriesChange() {
      const {
        postIDsOfSelectedFieldA,
        postDocsObjectUpdated,
        postScoreObjectAUpdated,
        rankedPosts
      } = await handleSelectedFieldAChange({
        listenerImplementer: listenerImplementer,
        fieldPostsObjectA: categorisedPostsObject, 
        selectedFieldA: selectedCategories, 
        postDocsObject: postDocsObject,
        postScoreObjectB: postScoreObjectOfSelectedIngredients,
        titleToSearch: titleToSearch,
      });

      setPostIDsOfSelectedCategories(postIDsOfSelectedFieldA);
      setPostDocsObject(postDocsObjectUpdated);
      setPostScoreObjectOfSelectedCategories(postScoreObjectAUpdated);
      setIDsOfRankedFilteredPostsToDisplay(rankedPosts);

      setIsFiltering(false);
    }
    handleSelectedCategoriesChange();
  }, [selectedCategories]);

  useEffect(() => {
    setIsFiltering(true); 
    async function handleSelectedIngredientsChange() {
      const {
        postIDsOfSelectedFieldA,
        postDocsObjectUpdated,
        postScoreObjectAUpdated,
        rankedPosts
      } = await handleSelectedFieldAChange({
        listenerImplementer: listenerImplementer,
        fieldPostsObjectA: ingredientPostsObject, 
        selectedFieldA: selectedIngredients, 
        postDocsObject: postDocsObject,
        postScoreObjectB: postScoreObjectOfSelectedCategories,
        titleToSearch: titleToSearch,
      });

      setPostIDsOfSelectedIngredients(postIDsOfSelectedFieldA);
      setPostDocsObject(postDocsObjectUpdated);
      setPostScoreObjectOfSelectedIngredients(postScoreObjectAUpdated);
      setIDsOfRankedFilteredPostsToDisplay(rankedPosts);

      setIsFiltering(false);
    }
    handleSelectedIngredientsChange();
  }, [selectedIngredients]);

  useEffect(() => {
    const rankedPosts = handleTitleChange({
      postDocsObject: postDocsObject,
      titleToSearch: titleToSearch,
      postIDsOfSelectedFieldA: postIDsOfSelectedCategories,
      postIDsOfSelectedFieldB: postIDsOfSelectedIngredients,
    });
    setIDsOfRankedFilteredPostsToDisplay(rankedPosts);
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
