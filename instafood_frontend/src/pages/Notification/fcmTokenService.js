import { messaging } from '../../firebaseConf';
import { getToken } from 'firebase/messaging';

function getFCMToken() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');

      const currentToken = getToken(messaging, {
        vapidKey: 'BBrMwU3pxms1IGiAMa3V0aLvbtuqG9Ubm4P7QQk87zeii5d4dZD-gJTM_oIfOhR3fegFNwkhNafOJtlWEGa2n84'
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