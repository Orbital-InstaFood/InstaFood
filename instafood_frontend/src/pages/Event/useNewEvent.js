import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, auth, functions } from '../../firebaseConf';
import { httpsCallable } from 'firebase/functions';
import { doc, setDoc, serverTimestamp, getDoc, arrayUnion } from 'firebase/firestore';

import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';

function useNewEvent() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [eventName, setEventName] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventPlace, setEventPlace] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const createEvent = async () => {
    try {
      setIsLoading(true);

      const timestamp = serverTimestamp();
      const uniqueID = generateUniqueID();

      const eventID = `${uniqueID}`;

      const eventDocRef = doc(db, 'events', eventID);

      const eventDoc = {
        eventName,
        eventTime,
        eventPlace,
        creator: user.uid,
        createdAt: timestamp,
      };

      await setDoc(eventDocRef, eventDoc);

 //     const notifyFollowers = httpsCallable(functions, 'notifyFollowersEmail');
 //     await notifyFollowers ({ userID: user.uid, eventID: eventID });

      navigate(`/event/${eventID}`);
    } catch (error) {
      console.log('Failed to create event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    eventName,
    setEventName,
    eventTime,
    setEventTime,
    eventPlace,
    setEventPlace,
    createEvent,
    isLoading,
  };
}

export default useNewEvent;
