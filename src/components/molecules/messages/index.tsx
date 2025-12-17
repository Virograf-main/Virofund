"use client";
import {
  Button,
  Card,
  ChatMessage,
  Input,
  Loader,
  Message,
} from "@/components/atoms";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  subscribeToMessages,
  MessageData,
  getLastMessage,
} from "@/lib/firebase/messages";
import { serverTimestamp } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import {
  getUserChats,
  listenToMessages,
  listenToUserChats,
  sendMessage,
} from "@/lib/chats";
import { useUserStore } from "@/store/userStore";
import { Chat, TextMessage } from "@/types/chats";
import { formatChatDate } from "@/lib/helpers";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | undefined>();
  const [chatMessages, setChatMessages] = useState<TextMessage[]>([]);
  const [otherPerson, setOtherPerson] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });
  const [message, setMessage] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchChat, setSearchChat] = useState("");
  const { user } = useUserStore();

  useEffect(() => {
    if (!user?.id) return;

    const unsub = listenToUserChats(user.id, (updatedChats) => {
      setChats(updatedChats);
      setLoading(false);
    });

    return () => unsub();
  }, [user?.id]);

  useEffect(() => {
    if (!activeChat) return;
    setMessagesLoading(true);
    const unsub = listenToMessages(activeChat, (msgs) => {
      setChatMessages(msgs);
      setMessagesLoading(false);
    });

    return () => unsub();
  }, [activeChat]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleSendMessages = async (
    senderId: string,
    text: string,
    chatId: string,
    senderName: string
  ) => {
    if (!text || text.trim().length === 0) return;

    // Create a temporary message object
    const tempMessage: TextMessage = {
      id: `temp-${Date.now()}`, // temporary ID
      chatId,
      senderId,
      senderName,
      text,
      createdAt: Timestamp.now(),
      isTemp: true,
    };

    // Add it to the state immediately
    setChatMessages((prev) => [...prev, tempMessage]);

    try {
      await sendMessage(senderId, text, chatId, senderName);
    } catch (error) {
      toast.error("Failed to send message");
      console.log(error);
      setChatMessages((prev) =>
        prev.filter((msg) => msg.id !== tempMessage.id)
      );
    }
  };

  if (chats) {
    console.log(chats);
  }
  // CHAT SCREEN ------------------------------------------------
  if (activeChat) {
    return (
      <Card className="h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center gap-4">
          <button onClick={() => setActiveChat("")}>&larr;</button>
          <p
            className="font-semibold"
            onClick={() => router.replace(`/profile/${otherPerson.id}`)}
          >
            {otherPerson ? otherPerson.name : "Virofund User"}
          </p>
        </div>
        {messagesLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar p-4 space-y-2">
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, idx) => (
                <div key={msg.id || idx} className="flex flex-col">
                  <div
                    className={`p-2 max-w-[400px] inline-block rounded-2xl  shadow ${
                      msg.senderId === user?.id
                        ? "self-end bg-primary rounded-br-sm text-white "
                        : "bg-secondary text-black rounded-bl-sm self-start"
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <p
                    className={`text-[0.8em] ${
                      msg.senderId === user?.id ? "self-end " : "self-start"
                    }`}
                  >
                    {msg.createdAt
                      ? formatChatDate(msg.createdAt.toDate())
                      : "Sending..."}
                  </p>
                </div>
              ))
            ) : (
              <div> </div>
            )}
          </div>
        )}

        <div className="p-4 border-t flex  gap-2 border">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 w-full"
          />
          <Button
            onClick={() => {
              if (!user?.id) {
                toast.error("You must be logged in to send messages");
                return;
              }
              const msg = message;
              setMessage("");
              handleSendMessages(
                user?.id,
                msg,
                activeChat,
                user?.firstName + " " + user?.lastName
              );
            }}
          >
            Send
          </Button>
        </div>
      </Card>
    );
  }

  const filteredChats = chats.filter((chat) => {
    const person = chat.membersDetails.find((m) => m.id !== user?.id);

    if (!person) return false;

    const name = person.name.toLowerCase();
    const lastMessage = chat.lastMessage?.toLowerCase() ?? "";

    const query = searchChat.toLowerCase();

    return name.includes(query) || lastMessage.includes(query);
  });

  // CONVERSATION LIST ----------------------------------------
  return (
    <Card className="h-[90vh]">
      {chats.length === 0 ? (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <Image
            src="/svg/no-data.svg"
            width={200}
            height={200}
            alt="no data"
          />
          <p className="text-center">
            Your matched co-founders will appear here
          </p>
        </div>
      ) : (
        <>
          <div className="p-6 space-y-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                size={18}
              />
              <Input
                className="pl-10 bg-primary/20 placeholder:text-primary"
                placeholder="Search for existing chats"
                value={searchChat}
                onChange={(e) => setSearchChat(e.target.value)}
              />
            </div>
          </div>

          <div className="h-full overflow-y-auto scrollbar rounded-b-2xl pb-26">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => {
                const personName = chat.membersDetails.filter(
                  (member) => member.id !== user?.id
                );
                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setActiveChat(chat.id);
                      setOtherPerson({
                        name: personName[0].name,
                        id: personName[0].id,
                      });
                    }}
                    className="border flex items-start gap-2 p-2 cursor-default"
                  >
                    <div className="w-[50px] h-[50px] rounded-full bg-gray-400"></div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <h1 className="font-semibold">{personName[0].name}</h1>
                        <p className="text-[0.9em]">
                          {chat.lastMessage
                            ? chat.lastMessage
                            : `You and ${personName[0].name} are now connected!`}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Clock3 size={12} />
                        <p className="text-[0.8em]">
                          {chat.lastUpdated ? (
                            formatChatDate(chat?.lastUpdated?.toDate())
                          ) : (
                            <p>null</p>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center">
                <Image
                  src="/svg/no-data.svg"
                  width={200}
                  height={200}
                  alt="no data"
                />
                <p className="text-center">No chats found</p>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
};
