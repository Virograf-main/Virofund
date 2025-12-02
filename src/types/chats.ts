import type { Timestamp } from "firebase/firestore";

export interface Chat {
  id: string;
  createdAt: Timestamp;
  lastMessage: string | null;
  membersId: string[];
  membersName: string[];
  membersDetails: { id: string; name: string }[];
  lastUpdated: Timestamp;
}

export interface TextMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: Timestamp;
  isTemp?: boolean;
}
