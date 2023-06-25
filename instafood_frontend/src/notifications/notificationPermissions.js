function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        } else if (permission === 'denied') {
          console.log('Notification permission denied');
        } else if (permission === 'default') {
          console.log('Notification permission dismissed');
        }
      });
    } else {
      console.log('Notifications not supported in this browser');
    }
  }
  
  function showNotification(title, options) {
    if ('Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(title, options);
      });
    } else {
      console.log('Notification permission not granted');
    }
  }
  