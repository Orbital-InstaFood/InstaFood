import { messaging } from '../../firebaseConf';
import { getToken } from 'firebase/messaging';

export const getFCMToken = () =>{
  getToken(messaging, { vapidKey: 'BHSU9WAvf1hg_1WFGPb6TwXDj5LcYQz2JgA38As8lFO47MG0DUlYtgFTp4KynbNYCmKbtepR-ArJin0kNdlEejs' }).then((currentToken) => {
    if (currentToken) {
    return currentToken;
  } else {
    console.log('No registration token available. Request permission to generate one.');
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
});
}

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
