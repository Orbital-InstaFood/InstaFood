import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const db = getFirestore(app);
const auth = getAuth(app);

async function initializeEvent(userId, eventName, eventTime, eventPlace) {
  try {
    const eventRef = await addDoc(collection(db, 'events'), {
      userId,
      eventName,
      eventTime,
      eventPlace
    }); // Event document created in Firestore

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      const followers = userData.followers; // Array of follower IDs

      for (const followerId of followers) {
        const followerRef = doc(db, 'users', followerId);
        const followerDoc = await getDoc(followerRef);

        if (followerDoc.exists()) {
          const followerData = followerDoc.data();
          const followerEmail = followerData.email;
          
          // Send email verification link to follower
          sendEmailVerification(auth.currentUser, {
            url: 'https://yourwebsite.com',
            handleCodeInApp: true
          }).then(() => {
            console.log(`Email verification link sent to ${followerEmail}`);
          }).catch((error) => {
            console.log(`Failed to send email verification link to ${followerEmail}`, error);
          });
        }
      }
    }
  } catch (error) {
    console.log('Failed to initialize event:', error);
  }
}

// Usage
const userId = 'user123'; // ID of the user initializing the event
const eventName = 'Sample Event';
const eventTime = '2023-06-01T10:00:00';
const eventPlace = 'Sample Location';

initializeEvent(userId, eventName, eventTime, eventPlace);