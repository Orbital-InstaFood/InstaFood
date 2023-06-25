function subscribeToPushNotifications() {
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.subscribe({ userVisibleOnly: true })
        .then(subscription => { // Send the subscription details to your server
          sendSubscriptionToServer(subscription);
        })
        .catch(error => {
          console.error('Failed to subscribe to push notifications:', error);
        });
    });
  }

  function sendSubscriptionToServer(subscription) { // Send an HTTP request to your server to store the subscription 
    // You can use an HTTP library like Axios or fetch for this
    fetch('/store-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    }).then(response => { // Handle the response from your server
    }).catch(error => {
      console.error('Failed to send subscription to server:', error);
    });
  }
  
  self.addEventListener('push', event => {
    const options = {
      body: event.data.text(),
      icon: 'path/to/notification-icon.png', // other notification options
    };
    event.waitUntil(self.registration.showNotification('Push Notification', options));
  });
  