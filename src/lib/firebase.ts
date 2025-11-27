// import { Timestamp } from "firebase/firestore";
// // Import the functions you need from the SDKs you need
// import { FirebaseUser } from "@/types/firebase";
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import {
//   getFirestore,
//   addDoc,
//   collection,
//   serverTimestamp,
//   query,
//   where,
//   getDocs,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import toast from "react-hot-toast";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// // const analytics = getAnalytics(app);
// export const saveUserToFirebase = async (user: {
//   firstName: string;
//   lastName: string;
//   email: string;
// }) => {
//   try {
//     await addDoc(collection(db, "users"), {
//       ...user,
//       isOnboarded: false,
//       createdAt: serverTimestamp(),
//     });
//   } catch (err) {
//     console.error("Firebase save failed:", err);
//     toast.error("Failed to save user to Firebase");
//   }
// };

// export const getUserFromFirebase = async (
//   email: string
// ): Promise<FirebaseUser | null> => {
//   const usersRef = collection(db, "users");
//   const q = query(usersRef, where("email", "==", email));
//   const querySnapshot = await getDocs(q);

//   if (!querySnapshot.empty) {
//     const userDoc = querySnapshot.docs[0];
//     const data = userDoc.data() as Omit<FirebaseUser, "id" | "createdAt"> & {
//       createdAt: Timestamp;
//     };

//     localStorage.setItem("userId", userDoc.id);
//     localStorage.setItem("email", email);

//     return {
//       id: userDoc.id,
//       createdAt: data.createdAt.toDate(), // convert Timestamp -> Date
//       email: data.email,
//       firstName: data.firstName,
//       lastName: data.lastName,
//       isOnboarded: data.isOnboarded,
//     };
//   } else {
//     return null;
//   }
// };

// export const markUserOnboarded = async (userId: string) => {
//   try {
//     const userRef = doc(db, "users", userId);
//     await updateDoc(userRef, { isOnboarded: true });
//   } catch (err) {
//     console.error("Failed to update isOnboarded:", err);
//     toast.error("Failed to update onboarding status");
//   }
// };
