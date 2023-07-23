const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore, doc, getDoc } = require('firebase-admin/firestore');
const { getAuth, sendEmailVerification } = require('firebase-admin/auth');

admin.initializeApp();

const db = getFirestore();
const auth = getAuth();

exports.initializeEvent = functions.firestore
  .document('events/{eventId}')
  .onCreate(async (snapshot, context) => {
    const event = snapshot.data();
    const eventId = context.params.eventId;
    const userId = event.userId;

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const followers = userData.followers;

        for (const followerId of followers) {
          const followerRef = doc(db, 'users', followerId);
          const followerDoc = await getDoc(followerRef);

          if (followerDoc.exists()) {
            const followerData = followerDoc.data();
            const followerEmail = followerData.email;

            sendEmailVerification(auth, {
              email: followerEmail,
              url: 'https://yourwebsite.com',
              handleCodeInApp: true,
            })
              .then(() => {
                console.log(`Email verification link sent to ${followerEmail}`);
              })
              .catch((error) => {
                console.log(`Failed to send email verification link to ${followerEmail}`, error);
              });
          }
        }
      }
    } catch (error) {
      console.log('Failed to initialize event:', error);
    }
  });
