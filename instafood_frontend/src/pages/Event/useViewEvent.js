import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConf';

function useViewEvent() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEventData() {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsData = querySnapshot.docs.map((doc) => doc.data());
        setEventData(eventsData);
        setLoading(false);
      } catch (error) {
        console.log('Failed to fetch event data:', error);
      }
    }

    fetchEventData();
  }, []);

  return {
    eventData,
    loading,
  };
}

export default useViewEvent;
