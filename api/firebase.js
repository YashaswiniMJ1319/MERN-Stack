import admin from 'firebase-admin';
import { createRequire } from 'module';

// Create a require function to import the JSON file in ES Module mode
const require = createRequire(import.meta.url);

let db;

try {
  // 1. Load the service account key you downloaded from Firebase Console
  const serviceAccount = require('../../serviceAccountKey.json');

  // 2. Initialize the app
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  // 3. Get the Firestore database instance
  db = admin.firestore();
  console.log("🔥 Firebase Firestore Connected Successfully");

} catch (error) {
  console.error("❌ Firebase Connection Error:", error.message);
  console.error("   (Did you forget to add serviceAccountKey.json to the api/ folder?)");
}

export default db;