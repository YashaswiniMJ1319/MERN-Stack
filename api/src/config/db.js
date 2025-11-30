import admin from "firebase-admin";
import { readFileSync } from "fs";

let db;

// Initialize Firebase only once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(readFileSync("serviceAccountKey.json", "utf8"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

db = admin.firestore();
console.log("🔥 Firebase Firestore Connected Successfully");

export { db };
