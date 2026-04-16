"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, X, Mic, Paperclip, Send, Clock3, Search, Plus } from "lucide-react";
import {
  Button,
  Card,
  Input,
  Loader,
} from "@/components/atoms";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToMessages, MessageData, getLastMessage } from "@/lib/firebase/messages";
import { serverTimestamp } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { getUserChats, listenToMessages, listenToUserChats, sendMessage } from "@/lib/chats";
import { useUserStore } from "@/store/userStore";
import { Chat, TextMessage } from "@/types/chats";
import { formatChatDate } from "@/lib/helpers";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = useState<TextMessage[]>([]);
  const [otherPerson, setOtherPerson] = useState<{ name: string; id: string }>({ name: "", id: "" });
  const [message, setMessage] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchChat, setSearchChat] = useState("");
  const { user } = useUserStore();
  const activeChat = searchParams.get("chatId") ?? undefined;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const setActiveChat = (chatId: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (chatId) params.set("chatId", chatId);
    else params.delete("chatId");
    router.replace(`?${params.toString()}`);
  };

  // Restore otherPerson when page refreshes
  useEffect(() => {
    if (!activeChat || chats.length === 0) return;
    const chat = chats.find((c) => c.id === activeChat);
    if (!chat) return;
    const person = chat.membersDetails.find((m) => m.id !== user?.id);
    if (person) setOtherPerson({ name: person.name, id: person.id });
  }, [activeChat, chats, user?.id]);

  // Listen to user chats
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const unsub = listenToUserChats(user.id, (updatedChats) => {
      setChats(updatedChats);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.id]);

  // Listen to active chat messages
  useEffect(() => {
    if (!activeChat) return;
    setMessagesLoading(true);
    const unsub = listenToMessages(activeChat, (msgs) => {
      setChatMessages(msgs);
      setMessagesLoading(false);
    });
    return () => unsub();
  }, [activeChat]);

  // Voice Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleSendMessages = async (senderId: string, text: string, chatId: string, senderName: string) => {
    if (!text?.trim()) return;

    const tempMessage: TextMessage = {
      id: `temp-${Date.now()}`,
      chatId,
      senderId,
      senderName,
      text,
      createdAt: Timestamp.now(),
      isTemp: true,
    };

    setChatMessages((prev) => [...prev, tempMessage]);

    try {
      await sendMessage(senderId, text, chatId, senderName);
    } catch (error) {
      toast.error("Failed to send message");
      setChatMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    }
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat || !user?.id) return;

    setShowAttachmentMenu(false);

    // You can show a "uploading..." message here if desired
    const tempFileMessage: TextMessage = {
      id: `temp-file-${Date.now()}`,
      chatId: activeChat,
      senderId: user.id,
      senderName: user.firstName + " " + user.lastName,
      text: `📎 ${file.name}`,
      fileUrl: URL.createObjectURL(file), // temporary local preview
      fileName: file.name,
      fileType: file.type,
      createdAt: Timestamp.now(),
      isTemp: true,
    };

    setChatMessages((prev) => [...prev, tempFileMessage]);

    try {
      // TODO: Upload file to your backend / Firebase Storage
      // Example: const uploadedUrl = await uploadFileToStorage(file, activeChat);
      // Then send message with real URL
      await sendMessage(user.id, `📎 ${file.name}`, activeChat, user.firstName + " " + user.lastName, 
        "uploaded-url-here", // replace with real URL after upload
        file.name,
         file.type,
      );
    } catch (error) {
      toast.error("Failed to upload file");
      setChatMessages((prev) => prev.filter((msg) => msg.id !== tempFileMessage.id));
    }
  };

  // Voice Note Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Send voice note
        if (activeChat && user?.id) {
          const tempVoiceMessage: TextMessage = {
            id: `temp-voice-${Date.now()}`,
            chatId: activeChat,
            senderId: user.id,
            senderName: user.firstName + " " + user.lastName,
            text: "🎤 Voice Message",
            audioUrl,
            createdAt: Timestamp.now(),
            isTemp: true,
          };

          setChatMessages((prev) => [...prev, tempVoiceMessage]);

          try {
            // TODO: Upload audioBlob to storage and get URL
            // const uploadedAudioUrl = await uploadVoiceNote(audioBlob, activeChat);
            await sendMessage(user.id, "🎤 Voice Message", activeChat, user.firstName + " " + user.lastName, "", "", "",
             "uploaded-audio-url-here", // replace with real URL
            );
          } catch (error) {
            toast.error("Failed to send voice note");
            setChatMessages((prev) => prev.filter((msg) => msg.id !== tempVoiceMessage.id));
          }
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      toast.error("Microphone access denied or not available");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

     const filteredChats = chats.filter((chat) => {
    const person = chat.membersDetails.find((m) => m.id !== user?.id);
    if (!person) return false;
    const name = person.name.toLowerCase();
    const lastMessage = chat.lastMessage?.toLowerCase() ?? "";
    const query = searchChat.toLowerCase();
    return name.includes(query) || lastMessage.includes(query);
  });

  // CHAT SCREEN
  if (activeChat) {
    return (
      <Card className="h-[85vh] flex flex-col">
        <div className="p-4 border-b flex items-center gap-4">
          <button onClick={() => setActiveChat(undefined)}>&larr;</button>
          <p className="font-semibold" onClick={() => router.replace(`/profile/${otherPerson.id}`)}>
            {otherPerson?.name || "Virofund User"}
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
                    className={`p-2 max-w-[400px] inline-block rounded-2xl shadow ${
                      msg.senderId === user?.id
                        ? "self-end bg-primary rounded-br-sm text-white"
                        : "bg-secondary text-black rounded-bl-sm self-start"
                    }`}
                  >
                    {msg.audioUrl ? (
                      <audio controls src={msg.audioUrl} className="max-w-[300px]" />
                    ) : msg.fileUrl ? (
                      <a href={msg.fileUrl} target="_blank" className="text-blue-400 underline">
                        📎 {msg.fileName || "Attachment"}
                      </a>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                  <p className={`text-[0.8em] ${msg.senderId === user?.id ? "self-end" : "self-start"}`}>
                    {msg.createdAt ? formatChatDate(msg.createdAt.toDate()) : "Sending..."}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No messages yet. Say hello!
              </div>
            )}
          </div>
        )}

        {/* Message Input Area with + Attachment Button */}
        <div className="p-4 border-t flex gap-2 items-center border">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          >
            <Plus className="h-5 w-5" />
          </Button>

          {/* Attachment Menu */}
          <AnimatePresence>
            {showAttachmentMenu && (
              <div className="absolute bottom-20 left-6 bg-zinc-900 border border-zinc-700 rounded-xl p-2 shadow-xl z-50">
                <div className="flex flex-col gap-1 w-52">
                  <label className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <Paperclip className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Document / File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  <button
                    onClick={() => {
                      setShowAttachmentMenu(false);
                      startVoiceRecording();
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-lg text-left w-full"
                  >
                    <Mic className="h-5 w-5 text-red-400" />
                    <span className="text-sm">Voice Note</span>
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Voice Recording Overlay */}
          <AnimatePresence>
            {isRecording && (
              <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full flex items-center gap-3 shadow-2xl z-50">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span>Recording {recordingTime}s</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={stopVoiceRecording}
                  className="ml-4 bg-white text-red-600 hover:bg-white/90"
                >
                  Send
                </Button>
              </div>
            )}
          </AnimatePresence>

          {/* Message Input */}
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 w-full bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const msg = message;
                setMessage("");
                handleSendMessages(
                  user?.id || '',
                  msg,
                  activeChat,
                  user?.firstName + " " + user?.lastName,
                );
              }
            }}
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
                user?.firstName + " " + user?.lastName,
              );
            }}
            disabled={!message.trim()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    );
  }

  // Conversation List (unchanged)
  // ... your existing conversation list code
return (

  <Card className="h-full">
       {chats.length === 0 ? (
        <div className="h-full w-full flex flex-col items-center justify-center gap-3 p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="font-semibold text-[#1C1A16]">No conversations yet</h3>
          <p className="text-sm text-gray-400 max-w-[220px]">
            Once you connect with a co-founder, your chats will appear here.
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
                  (member) => member.id !== user?.id,
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
)
};










// "use client";
// import {
//   Button,
//   Card,
//   ChatMessage,
//   Input,
//   Loader,
//   Message,
// } from "@/components/atoms";
// import { motion, AnimatePresence } from "framer-motion";
// import { Clock3, Search } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import {
//   subscribeToMessages,
//   MessageData,
//   getLastMessage,
// } from "@/lib/firebase/messages";
// import { serverTimestamp } from "firebase/firestore";
// import { Timestamp } from "firebase/firestore";
// import {
//   getUserChats,
//   listenToMessages,
//   listenToUserChats,
//   sendMessage,
// } from "@/lib/chats";
// import { useUserStore } from "@/store/userStore";
// import { Chat, TextMessage } from "@/types/chats";
// import { formatChatDate } from "@/lib/helpers";
// import toast from "react-hot-toast";
// import { useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";

// export const Messages = () => {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [chatMessages, setChatMessages] = useState<TextMessage[]>([]);
//   const [otherPerson, setOtherPerson] = useState<{ name: string; id: string }>({
//     name: "",
//     id: "",
//   });
//   const [message, setMessage] = useState("");
//   const [messagesLoading, setMessagesLoading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [searchChat, setSearchChat] = useState("");
//   const { user } = useUserStore();

//   const activeChat = searchParams.get("chatId") ?? undefined;

//   const setActiveChat = (chatId: string | undefined) => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (chatId) {
//       params.set("chatId", chatId);
//     } else {
//       params.delete("chatId");
//     }
//     router.replace(`?${params.toString()}`);
//   };

//   // Restore otherPerson from chats list when page is refreshed
//   useEffect(() => {
//     if (!activeChat || chats.length === 0) return;
//     const chat = chats.find((c) => c.id === activeChat);
//     if (!chat) return;
//     const person = chat.membersDetails.find((m) => m.id !== user?.id);
//     if (person) {
//       setOtherPerson({ name: person.name, id: person.id });
//     }
//   }, [activeChat, chats, user?.id]);

//   useEffect(() => {
//     if (!user?.id) {
//       setLoading(false);
//       return;
//     }

//     const unsub = listenToUserChats(user.id, (updatedChats) => {
//       setChats(updatedChats);
//       setLoading(false);
//     });

//     return () => unsub();
//   }, [user?.id]);

//   useEffect(() => {
//     if (!activeChat) return;
//     setMessagesLoading(true);
//     const unsub = listenToMessages(activeChat, (msgs) => {
//       setChatMessages(msgs);
//       setMessagesLoading(false);
//     });

//     return () => unsub();
//   }, [activeChat]);

//   if (loading) {
//     return (
//       <div className="w-full h-full flex items-center justify-center">
//         <Loader />
//       </div>
//     );
//   }

//   const handleSendMessages = async (
//     senderId: string,
//     text: string,
//     chatId: string,
//     senderName: string,
//   ) => {
//     if (!text || text.trim().length === 0) return;

//     const tempMessage: TextMessage = {
//       id: `temp-${Date.now()}`,
//       chatId,
//       senderId,
//       senderName,
//       text,
//       createdAt: Timestamp.now(),
//       isTemp: true,
//     };

//     setChatMessages((prev) => [...prev, tempMessage]);

//     try {
//       await sendMessage(senderId, text, chatId, senderName);
//     } catch (error) {
//       toast.error("Failed to send message");
//       console.log(error);
//       setChatMessages((prev) =>
//         prev.filter((msg) => msg.id !== tempMessage.id),
//       );
//     }
//   };

//   // CHAT SCREEN ------------------------------------------------
//   if (activeChat) {
//     return (
//       <Card className="h-[85vh] flex flex-col">
//         <div className="p-4 border-b flex items-center gap-4">
//           <button onClick={() => setActiveChat(undefined)}>&larr;</button>
//           <p
//             className="font-semibold"
//             onClick={() => router.replace(`/profile/${otherPerson.id}`)}
//           >
//             {otherPerson ? otherPerson.name : "Virofund User"}
//           </p>
//         </div>
//         {messagesLoading ? (
//           <div className="h-full w-full flex items-center justify-center">
//             <Loader />
//           </div>
//         ) : (
//           <div className="flex-1 overflow-y-auto scrollbar p-4 space-y-2">
//             {chatMessages.length > 0 ? (
//               chatMessages.map((msg, idx) => (
//                 <div key={msg.id || idx} className="flex flex-col">
//                   <div
//                     className={`p-2 max-w-[400px] inline-block rounded-2xl shadow ${
//                       msg.senderId === user?.id
//                         ? "self-end bg-primary rounded-br-sm text-white"
//                         : "bg-secondary text-black rounded-bl-sm self-start"
//                     }`}
//                   >
//                     <p>{msg.text}</p>
//                   </div>
//                   <p
//                     className={`text-[0.8em] ${
//                       msg.senderId === user?.id ? "self-end" : "self-start"
//                     }`}
//                   >
//                     {msg.createdAt
//                       ? formatChatDate(msg.createdAt.toDate())
//                       : "Sending..."}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <div> </div>
//             )}
//           </div>
//         )}

//         <div className="p-4 border-t flex gap-2 border">
//           <Input
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type a message"
//             className="flex-1 w-full"
//           />
//           <Button
//             onClick={() => {
//               if (!user?.id) {
//                 toast.error("You must be logged in to send messages");
//                 return;
//               }
//               const msg = message;
//               setMessage("");
//               handleSendMessages(
//                 user?.id,
//                 msg,
//                 activeChat,
//                 user?.firstName + " " + user?.lastName,
//               );
//             }}
//           >
//             Send
//           </Button>
//         </div>
//       </Card>
//     );
//   }

//   const filteredChats = chats.filter((chat) => {
//     const person = chat.membersDetails.find((m) => m.id !== user?.id);
//     if (!person) return false;
//     const name = person.name.toLowerCase();
//     const lastMessage = chat.lastMessage?.toLowerCase() ?? "";
//     const query = searchChat.toLowerCase();
//     return name.includes(query) || lastMessage.includes(query);
//   });

//   // CONVERSATION LIST ----------------------------------------
//   return (
//     <Card className="h-full">
//       {chats.length === 0 ? (
//         <div className="h-full w-full flex flex-col items-center justify-center gap-3 p-10 text-center">
//           <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
//             <span className="text-2xl">💬</span>
//           </div>
//           <h3 className="font-semibold text-[#1C1A16]">No conversations yet</h3>
//           <p className="text-sm text-gray-400 max-w-[220px]">
//             Once you connect with a co-founder, your chats will appear here.
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="p-6 space-y-3">
//             <div className="relative">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
//                 size={18}
//               />
//               <Input
//                 className="pl-10 bg-primary/20 placeholder:text-primary"
//                 placeholder="Search for existing chats"
//                 value={searchChat}
//                 onChange={(e) => setSearchChat(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="h-full overflow-y-auto scrollbar rounded-b-2xl pb-26">
//             {filteredChats.length > 0 ? (
//               filteredChats.map((chat) => {
//                 const personName = chat.membersDetails.filter(
//                   (member) => member.id !== user?.id,
//                 );
//                 return (
//                   <div
//                     key={chat.id}
//                     onClick={() => {
//                       setActiveChat(chat.id);
//                       setOtherPerson({
//                         name: personName[0].name,
//                         id: personName[0].id,
//                       });
//                     }}
//                     className="border flex items-start gap-2 p-2 cursor-default"
//                   >
//                     <div className="w-[50px] h-[50px] rounded-full bg-gray-400"></div>
//                     <div className="flex flex-col gap-4">
//                       <div>
//                         <h1 className="font-semibold">{personName[0].name}</h1>
//                         <p className="text-[0.9em]">
//                           {chat.lastMessage
//                             ? chat.lastMessage
//                             : `You and ${personName[0].name} are now connected!`}
//                         </p>
//                       </div>
//                       <div className="flex gap-2 items-center">
//                         <Clock3 size={12} />
//                         <p className="text-[0.8em]">
//                           {chat.lastUpdated ? (
//                             formatChatDate(chat?.lastUpdated?.toDate())
//                           ) : (
//                             <p>null</p>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="h-full w-full flex flex-col items-center justify-center">
//                 <Image
//                   src="/svg/no-data.svg"
//                   width={200}
//                   height={200}
//                   alt="no data"
//                 />
//                 <p className="text-center">No chats found</p>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </Card>
//   );
// };
