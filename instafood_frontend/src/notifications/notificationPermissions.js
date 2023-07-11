import { auth, db, functions } from '../firebaseConf';
import { getFCMToken } from './fcmTokenService';

function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(async function (permission) {
      if (permission === 'granted') {
        console.log('Notification permission granted');

        const user = auth.currentUser;
        const uid = user.uid;

        const token = await getFCMToken();

        try {
          const userDocRef = doc(db, 'users', uid);
          await updateDoc(userDocRef, {
            fcmToken: token,
          });

          console.log('FCM token stored in user document:', token);
        } catch (error) {
          console.log('Failed to store FCM token in user document:', error);
        }
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
