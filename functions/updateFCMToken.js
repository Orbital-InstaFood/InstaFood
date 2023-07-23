const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.updateFCMToken = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  try {
    const temp_fcmToken = data.token;

    if (temp_fcmToken) {
      const userRef = admin.firestore().collection("users").doc(uid);
      const userSnapshot = await userRef.get();

      if (userSnapshot.exists) {
        const existingTokens = userSnapshot.exists ? userSnapshot.data().fcmToken : [];

        const isTokenExist = existingTokens.some(token => token === temp_fcmToken);
        if (!isTokenExist) {
          existingTokens.push(temp_fcmToken);

          await userRef.update({
            fcmToken: existingTokens,
          });
          console.log("fcmToken updated successfully.");
        } else {
          console.log("fcmToken already exists.");
        }
      } else {
        console.log("fcmToken already exists or is the same.");
      }
      return { success: true, message: "fcmToken updated successfully." };
    } else {
      console.log("Invalid fcmToken.");
      throw new functions.https.HttpsError('invalid-argument', 'Invalid fcmToken.');
    }
  } catch (error) {
    console.log("Error updating fcmToken: ", error);
    throw new functions.https.HttpsError('internal', 'Error updating fcmToken.');
  }
});
