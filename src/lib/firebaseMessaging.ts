import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_MY_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_MY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_MY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_MY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_MY_FIREBASE_APP_ID,
};

const app = getApps().some(a => a.name === "myMessagingApp")
  ? getApp("myMessagingApp")
  : initializeApp(firebaseConfig, "myMessagingApp");

export const messagingDB = getFirestore(app);
