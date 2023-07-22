import { useEffect, useState } from 'react';

import { db, auth, functions } from '../../firebaseConf';
import { httpsCallable } from 'firebase/functions';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';
import listenerImplementer from '../../listeners/ListenerImplementer';
import { useNavigate } from 'react-router-dom';

export default function useNewEvent() {

  const [eventName, setEventName] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [eventPlace, setEventPlace] = useState(null);
  const [eventDescription, setEventDescription] = useState(null);
  const [attendeesLimit, setAttendeesLimit] = useState(0);

  const [userProfile, setUserProfile] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [isInitialising, setIsInitialising] = useState(true);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const navigate = useNavigate();

  async function setup() {

    const userDocListener = await listenerImplementer.getUserDocListener();
    const categoriesListener = await listenerImplementer.getCategoriesListener();
    const ingredientsListener = await listenerImplementer.getIngredientsListener();

    // Retrieve userDoc from userDocListener
    const userDoc = userDocListener.getCurrentDocument();
    setUserProfile(userDoc);
    // Retrieve categories from categoriesListener
    const categories = categoriesListener.getCurrentDocument().categories;
    setCategories(categories);
    // Retrieve ingredients from ingredientsListener    
    const ingredients = ingredientsListener.getCurrentDocument().Ingredients;
    setIngredients(ingredients);

    setIsInitialising(false);
  }

  useEffect(() => {
    setup();
  }, []);

  async function createEvent() { 

    setIsCreatingEvent(true);

    const uniqueID = generateUniqueID();
    const eventID = `${userProfile.userID}_${uniqueID}`;

    const eventDocRef = doc(db, 'events', eventID);
    const eventDoc = {
      eventName: eventName,
      eventTime: eventTime,
      eventPlace: eventPlace,
      attendeesLimit: attendeesLimit,
      eventDescription: eventDescription,
      creator: userProfile.userID,
      attendees: [],
      categories: selectedCategories,
      ingredients: selectedIngredients,
    };
    await setDoc(eventDocRef, eventDoc);

    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userDocRef, {
      eventsCreated: arrayUnion(eventID),
    });

    const notifyFollowersAboutNewEvent = httpsCallable(functions, 'notifyFollowersAboutNewEvent');
    notifyFollowersAboutNewEvent({
      eventID: eventID,
      followers: userProfile.followers,
    });

    navigate(`/viewEvent`);
  }

  return {
    eventName, setEventName,
    eventTime, setEventTime,
    eventPlace, setEventPlace,
    eventDescription, setEventDescription,
    attendeesLimit, setAttendeesLimit,
    categories, selectedCategories, setSelectedCategories,
    ingredients, selectedIngredients, setSelectedIngredients,
    createEvent,
    isInitialising, isCreatingEvent,
  };
}
