const express = require('express');
const expressApp = express();


const admin = require("firebase-admin");
const serviceAccount = require("./firebase_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const storage = admin.storage();

console.log('server.js: db: ', 
  db.collection('users').get().then((snapshot) => {
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        }
    )
    }
  ));

expressApp.listen(3000, () => {
    console.log('listening on port 3000');
    } 
);