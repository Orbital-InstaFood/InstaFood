import { useState, useEffect } from 'react';

import listenerImplementer from '../../listeners/ListenerImplementer';

import {
  combinePostIDsOfSelectedCategories
} from '../commonUtils';

import {
  explore_setupCategorisedPostsObject,
  rankPosts,
  handleTitleSearch,
  loadPostsOfSelectedCategories
} from './exploreUtils';

function useExplore() {

  const [userProfile, setUserProfile] = useState(null);
  const [UserDocListener, setUserDocListener] = useState(null);

  const [publicUsers, setPublicUsers] = useState(null);
  const [PublicUsersListener, setPublicUsersListener] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoriesListener, setCategoriesListener] = useState(null);

  const [savedPosts, setSavedPosts] = useState([]);
  const [categorisedPostsObject, setCategorisedPostsObject] = useState(null);

  const [titleToSearch, setTitleToSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [postDocsObjectOfSelectedCategories, setPostDocsObjectOfSelectedCategories] = useState({});
  const [postIDsOfSelectedCategories, setPostIDsOfSelectedCategories] = useState([]);
  const [IDsOfRankedFilteredPostsToDisplay, setIDsOfRankedFilteredPostsToDisplay] = useState([]);

  const [isInitialising, setIsInitialising] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  /**
   * The first three useEffects are used to initialise the userProfile, publicUsers and categories.
   */
  useEffect(() => {
    async function setupListeners() {
      const userDocListener = await listenerImplementer.getUserDocListener();
      setUserDocListener(userDocListener);

      const publicUsersListener = await listenerImplementer.getPublicUsersListener();
      setPublicUsersListener(publicUsersListener);

      const categoriesListener = await listenerImplementer.getCategoriesListener();
      setCategoriesListener(categoriesListener);
    }
    setupListeners();
  }, []);

  function initialiseDocumentStates() {
    const userDoc = UserDocListener.getCurrentDocument();
    setUserProfile(userDoc);

    const publicUsersDoc = PublicUsersListener.getCurrentDocument();
    const unfilteredPublicUsers = publicUsersDoc.publicUsers;
    const filteredPublicUsers = unfilteredPublicUsers.filter((publicUser) => {
      const isFollowed = userDoc.following.includes(publicUser);
      return !isFollowed;
    });
    setPublicUsers(filteredPublicUsers);

    const categoriesDoc = categoriesListener.getCurrentDocument();
    setCategories(categoriesDoc.categories);
  }

  function setupSubscriptions() {

    const unsubscribeFromSavedPosts =
      UserDocListener.subscribeToField('savedPosts',
        (savedPosts) => {
          setSavedPosts(savedPosts);
        });

    return () => {
      unsubscribeFromSavedPosts();
    }
  }

  useEffect(() => {
    if (UserDocListener && PublicUsersListener && categoriesListener) {

      initialiseDocumentStates();
      const cancelAllSubscriptions = setupSubscriptions();
      return () => {
        cancelAllSubscriptions();
      }
    }
  }, [UserDocListener, PublicUsersListener, categoriesListener]);

  useEffect(() => {
    if (publicUsers && userProfile && categories) {
      explore_setupCategorisedPostsObject(
        categories,
        listenerImplementer,
        setCategorisedPostsObject,
        userProfile,
        publicUsers,
      );
    }
  }, [publicUsers, userProfile, categories]);


  useEffect(() => {
    if (categorisedPostsObject) {
      console.log('postCategoriesObject', categorisedPostsObject);
      setIsInitialising(false);
    }
  }, [categorisedPostsObject]);



  useEffect(() => {
    async function handleFilteringWhenSelectedCategoriesChange() {
      setIsFiltering(true);

      const localPostIDsOfSelectedCategories
        = combinePostIDsOfSelectedCategories(categorisedPostsObject, selectedCategories);
      setPostIDsOfSelectedCategories(localPostIDsOfSelectedCategories);

      const localPostDocsObjectOfSelectedCategories
        = await loadPostsOfSelectedCategories(postDocsObjectOfSelectedCategories, localPostIDsOfSelectedCategories, listenerImplementer);
      setPostDocsObjectOfSelectedCategories(localPostDocsObjectOfSelectedCategories);

      const filteredPosts
        = handleTitleSearch(localPostIDsOfSelectedCategories, localPostDocsObjectOfSelectedCategories, titleToSearch);

      const rankedPosts
        = rankPosts(filteredPosts, localPostDocsObjectOfSelectedCategories);
      setIDsOfRankedFilteredPostsToDisplay(rankedPosts);

      setIsFiltering(false);
    }
    handleFilteringWhenSelectedCategoriesChange();
  }, [selectedCategories]);

  useEffect(() => {
    setIsFiltering(true);

    const filteredPosts
      = handleTitleSearch(postIDsOfSelectedCategories, postDocsObjectOfSelectedCategories, titleToSearch);

    const rankedPosts
      = rankPosts(filteredPosts, postDocsObjectOfSelectedCategories);
    setIDsOfRankedFilteredPostsToDisplay(rankedPosts);

    setIsFiltering(false);
  }, [titleToSearch]);

  return {
    userProfile,
    categories,
    selectedCategories, setSelectedCategories, categorisedPostsObject,
    titleToSearch, setTitleToSearch,
    savedPosts,
    IDsOfRankedFilteredPostsToDisplay,
    isInitialising,
    isFiltering,
  }
}

export default useExplore;
