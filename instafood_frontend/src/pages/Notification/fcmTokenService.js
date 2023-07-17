import { messaging } from '../../firebaseConf';
import { getToken } from 'firebase/messaging';

function getFCMToken() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');

      const currentToken = getToken(messaging, {
        vapidKey: 'BBSR2tNayOFOoqLw6PHnRfs0eLkK_ooq2mz0Qjm_sx-gF6Q2eSCgcubj0cOLtLDWgS0J6oaJe0MDerBk_ErQe9U'
      }).then((currentToken) => {
        if (currentToken) {
          console.log("currentToken: ", currentToken);
          return currentToken;
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      });
    } else {
      console.log('Do not have permission');
    }
  });
}

export default getFCMToken;