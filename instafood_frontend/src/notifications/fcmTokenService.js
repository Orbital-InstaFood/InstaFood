import { messaging } from '../firebaseConf';
import { getToken } from 'firebase/messaging';

const messagingInstance = messaging();

export async function getFCMToken() {
  try {
    const currentToken = await getToken(messagingInstance, { vapidKey: 'BHSU9WAvf1hg_1WFGPb6TwXDj5LcYQz2JgA38As8lFO47MG0DUlYtgFTp4KynbNYCmKbtepR-ArJin0kNdlEejs' });
    return currentToken;
  } catch (error) {
    console.log('An error occurred while retrieving token:', error);
    throw error;
  }
}