import { useEffect, useState } from 'react';
import listenerImplementer from '../../listeners/ListenerImplementer';

function ViewEvent() {
  const [eventID, setEventID] = useState('');
  const [EventDocListener, setEventDocListener] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setupListeners() {
      const eventDocListener = await listenerImplementer.getEventDocListener();
      setEventDocListener(eventDocListener);
    }
    setupListeners();
  }, []);

  function initialiseDocumentStates() {
    const eventDoc = EventDocListener.getCurrentDocument();
    setEventData(eventDoc);
    setLoading(false);
  }

  useEffect(() => {
    if (EventDocListener) {
      initialiseDocumentStates();

      const unsubscribe = EventDocListener.subscribe((eventData) => {
        setEventData(eventData);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [EventDocListener]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : eventData ? (
        <div>
          <h2>{eventData.eventName}</h2>
          <p>Event Time: {eventData.eventTime}</p>
          <p>Event Place: {eventData.eventPlace}</p>
        </div>
      ) : (
        <div>Event not found.</div>
      )}
    </div>
  );
}

export default ViewEvent;
