import { useState, useEffect } from 'react';

import listenerImplementer from '../../listeners/ListenerImplementer';

import {
  combinePostIDsOfSelectedCategories
} from '../commonUtils';

import {
  explore_setupCategorisedPostsObject
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

  const [postDocsThatMatchSelectedCategories, setPostDocsThatMatchSelectedCategories] = useState({});
  const [combinedArrayOfPostIDsOfSelectedCategories, setCombinedArrayOfPostIDsOfSelectedCategories] = useState([]);
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

  async function loadPostsOfSelectedCategories(combinedArrayOfPostIDsOfSelectedCategories) {
    let localPostDocsThatMatchSelectedCategories = {...postDocsThatMatchSelectedCategories};
    for (const filteredPostID of combinedArrayOfPostIDsOfSelectedCategories) {
      const postListener = await listenerImplementer.getPostListener(filteredPostID);
      const postDoc = postListener.getCurrentDocument();
      localPostDocsThatMatchSelectedCategories[filteredPostID] = postDoc;
    }
    setPostDocsThatMatchSelectedCategories(localPostDocsThatMatchSelectedCategories);
    return localPostDocsThatMatchSelectedCategories;
  }

  function handleTitleSearch(combinedArrayOfPostIDsOfSelectedCategories, postDocsThatMatchSelectedCategories) {
    const filteredPosts = [];
    for (const postID of combinedArrayOfPostIDsOfSelectedCategories) {
      const postDoc = postDocsThatMatchSelectedCategories[postID];
      if (postDoc.title.toLowerCase().includes(titleToSearch.toLowerCase())) {
        filteredPosts.push(postID);
      }
    }
    return filteredPosts;
  }

  function rankPosts(filteredPosts, postDocsThatMatchSelectedCategories) {

    let rankedPosts = [];
    for (const postID of filteredPosts) {
      const postDoc = postDocsThatMatchSelectedCategories[postID];
      const postRank = postDoc.likes.length + postDoc.comments.length;
      rankedPosts.push({ postID, postRank });
    }
    rankedPosts.sort((a, b) => {
      return b.postRank - a.postRank;
    });

    let localIDsOfRankedFilteredPostsToDisplay = [];
    for (const post of rankedPosts) {
      localIDsOfRankedFilteredPostsToDisplay.push(post.postID);
    }
    setIDsOfRankedFilteredPostsToDisplay(localIDsOfRankedFilteredPostsToDisplay);
  }

  async function handleFilteringWhenSelectedCategoriesChange() {
    setIsFiltering(true);

    const localCombinedArrayOfPostIDsOfSelectedCategories 
    = combinePostIDsOfSelectedCategories(categorisedPostsObject, selectedCategories);
    setCombinedArrayOfPostIDsOfSelectedCategories(localCombinedArrayOfPostIDsOfSelectedCategories);

    const localPostDocsThatMatchSelectedCategories = await loadPostsOfSelectedCategories(localCombinedArrayOfPostIDsOfSelectedCategories);
    const filteredPosts = handleTitleSearch(localCombinedArrayOfPostIDsOfSelectedCategories, localPostDocsThatMatchSelectedCategories);
    rankPosts(filteredPosts, localPostDocsThatMatchSelectedCategories);
    setIsFiltering(false);
  }

  async function handleFilteringWhenTitleToSearchChange() {
    setIsFiltering(true);
    const filteredPosts = handleTitleSearch(combinedArrayOfPostIDsOfSelectedCategories, postDocsThatMatchSelectedCategories);
    rankPosts(filteredPosts, postDocsThatMatchSelectedCategories);
    setIsFiltering(false);
  }

  useEffect(() => {
      handleFilteringWhenSelectedCategoriesChange();
  }, [selectedCategories]);

  useEffect(() => {
    handleFilteringWhenTitleToSearchChange();
  }, [titleToSearch]);

  return {
    userProfile,
    categories,
    selectedCategories, setSelectedCategories, postCategoriesObject: categorisedPostsObject,
    titleToSearch, setTitleToSearch,
    savedPosts,
    IDsOfRankedFilteredPostsToDisplay,
    isInitialising,
    isFiltering,
  }
}

export default useExplore;
