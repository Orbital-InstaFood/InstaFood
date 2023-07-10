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

  const [userDoc, setUserDoc] = useState(null);
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

  let cleanupFunctions = [];

  async function setup() {

    //Initialise the listeners
    const UserDocListener = await listenerImplementer.getUserDocListener();
    setUserDocListener(UserDocListener);

    const PublicUsersListener = await listenerImplementer.getPublicUsersListener();
    setPublicUsersListener(PublicUsersListener);

    const categoriesListener = await listenerImplementer.getCategoriesListener();
    setCategoriesListener(categoriesListener);

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

    // Setup subscriptions
    const unsubscribeFromSavedPosts =
      UserDocListener.subscribeToField('savedPosts',
        (savedPosts) => {
          setSavedPosts(savedPosts);
        });
    cleanupFunctions.push(unsubscribeFromSavedPosts);

    await explore_setupCategorisedPostsObject(
      categories,
      listenerImplementer,
      setCategorisedPostsObject,
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
    setIsFiltering(true);
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
    userProfile: userDoc,
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
