import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { Chat, TextMessage } from "@/types/chats";

export async function createChat(
  matchId: string,
  senderId: string,
  receiverId: string,
  senderName: string,
  receiverName: string
) {
  await setDoc(
    doc(db, "chats", matchId),
    {
      membersId: [senderId, receiverId],
      membersName: [senderName, receiverName],
      membersDetails: [
        { id: senderId, name: senderName },
        { id: receiverId, name: receiverName },
      ],
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function sendMessage(
  senderId: string,
  text: string,
  chatId: string,
  senderName: string
) {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    senderId,
    text,
    createdAt: serverTimestamp(),
    chatId,
    senderName,
  });

  // Update lastMessage
  await setDoc(
    doc(db, "chats", chatId),
    {
      lastMessage: text,
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserChats(userId: string) {
  const q = query(
    collection(db, "chats"),
    where("membersId", "array-contains", userId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chat[];
}

export function listenToMessages(
  matchId: string,
  callback: (msgs: TextMessage[]) => void
) {
  const q = query(
    collection(db, "chats", matchId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TextMessage[];

    callback(messages);
  });
}

export function listenToUserChats(
  userId: string,
  callback: (chats: Chat[]) => void
) {
  const q = query(
    collection(db, "chats"),
    where("membersId", "array-contains", userId),
    orderBy("lastUpdated", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Chat[];

    callback(chats);
  });
}
