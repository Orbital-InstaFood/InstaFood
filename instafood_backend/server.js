const express = require('express');
const expressApp = express();

const admin = require("firebase-admin");
const serviceAccount = require("./firebase_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const storage = admin.storage();
