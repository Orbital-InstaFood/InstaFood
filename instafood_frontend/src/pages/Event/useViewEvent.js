import { useEffect, useState } from 'react';

import listenerImplementer from '../../listeners/ListenerImplementer';

export default function useViewEvent() {
  const [IDsOfEventsToView, setIDsOfEventsToView] = useState([]);
  const [IDsOfEventsCreated, setIDsOfEventsCreated] = useState([]);
  const [isInitialising, setIsInitialising] = useState(true);

  async function setup() {
    const userDocListener = await listenerImplementer.getUserDocListener();
    const userDoc = userDocListener.getCurrentDocument();

    const eventsToView = userDoc.eventsToView;
    if (eventsToView && eventsToView.length !== 0) {
      setIDsOfEventsToView([...eventsToView].reverse());
    } else {
      setIDsOfEventsToView([]);
    }

    const eventsCreated = userDoc.eventsCreated;
    if (eventsCreated && eventsCreated.length !== 0) {
      setIDsOfEventsCreated([...eventsCreated].reverse());
    } else {
      setIDsOfEventsCreated([]);
    }

    setIsInitialising(false);
  }

  useEffect(() => {
    setup();
  }, []);

  return {
    IDsOfEventsToView,
    IDsOfEventsCreated,
    isInitialising,
  };
}

