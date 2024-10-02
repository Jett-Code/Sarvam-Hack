// firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./sarvam-aa2ec-firebase-adminsdk-3x2x7-d444c9445a.json"); // Update the path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "sarvam-aa2ec.appspot.com",
});

const bucket = admin.storage().bucket();
module.exports = bucket;
