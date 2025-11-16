import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { messagingDB } from "./init";

export type MessageData = {
  id?: string;
  name: string;
  textmessage: string;
  day: string;
  time: string;
  pinned?: boolean;
};

// Subscribe to messages in a conversation
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: MessageData[]) => void
) => {
  const messagesRef = collection(messagingDB, "conversations", conversationId, "messages");
  const q = query(messagesRef, orderBy("time", "asc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const msgs: MessageData[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as MessageData));
    callback(msgs);
  });

  return unsubscribe;
};

// Send a message
export const sendMessage = async (conversationId: string, message: MessageData) => {
  const messagesRef = collection(messagingDB, "conversations", conversationId, "messages");
  await addDoc(messagesRef, message);
};












// import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
// import { messagingDB } from "./init";

// export type MessageData = {
//   id?: string;
//   name: string;
//   textmessage: string;
//   day: string;
//   time: string;
//   pinned?: boolean;
// };

// // Subscribe to messages in a conversation
// export const subscribeToMessages = (
//   conversationId: string,
//   callback: (messages: MessageData[]) => void
// ) => {
//   const messagesRef = collection(messagingDB, "conversations", conversationId, "messages");
//   const q = query(messagesRef, orderBy("time", "asc"));

//   const unsubscribe = onSnapshot(q, (snapshot) => {
//     const msgs: MessageData[] = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     } as MessageData));
//     callback(msgs);
//   });

//   return unsubscribe;
// };

// // Send a new message
// export const sendMessage = async (conversationId: string, message: MessageData) => {
//   const messagesRef = collection(messagingDB, "conversations", conversationId, "messages");
//   await addDoc(messagesRef, message);
// };





// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { messagingDB } from "@/lib/firebaseMessaging"; 

// export const subscribeToMessages = (conversationId: string, callback: Function) => {
//   const q = query(
//     collection(messagingDB, "conversations", conversationId, "messages"),
//     orderBy("timestamp", "desc")
//   );

//   return onSnapshot(q, (snapshot) => {
//     const msgs = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     callback(msgs);
//   });
// };

// export const sendMessage = async (conversationId: string, msg: any) => {
//   await addDoc(
//     collection(messagingDB, "conversations", conversationId, "messages"),
//     {
//       ...msg,
//       timestamp: serverTimestamp(),
//     }
//   );
// };
