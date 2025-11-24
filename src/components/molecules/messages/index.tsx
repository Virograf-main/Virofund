"use client";
import { Card, ChatMessage, Input, Message } from "@/components/atoms";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  subscribeToMessages,
  sendMessage,
  MessageData,
  getLastMessage
} from "@/lib/firebase/messages";
import { serverTimestamp } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

type MessagesProps = {
  currentUserId: string;
  users: { id: string; name: string; image?: string }[];
};


const formatMessageTime = (message: MessageData) => {
  const value = message.timestamp; // must match Firestore field

  if (!value) return "";

  // Timestamp is good → convert
  if (value instanceof Timestamp) {
    return value.toDate().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Still a serverTimestamp placeholder → show nothing
  return "";
};

export const Messages = ({ currentUserId, users }: MessagesProps) => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastMessages, setLastMessages] = useState<Record<string, MessageData | null>>({});

  const getConversationId = (u1: string, u2: string) =>
    [u1, u2].sort().join("_");

  useEffect(() => {
    if (!activeConversationId) return;

    const unsub = subscribeToMessages(activeConversationId, (msgs) => {
      setChatMessages(msgs);
    });

    return () => unsub();
  }, [activeConversationId]);

  // Load last messages for conversation previews
  useEffect(() => {
    users.forEach((user) => {
      if (user.id === currentUserId) return;

      const convoId = getConversationId(currentUserId, user.id);
      const unsub = subscribeToMessages(convoId, (msgs) => {
        const last = msgs.length ? msgs[msgs.length - 1] : null;
        setLastMessages((prev) => ({ ...prev, [convoId]: last }));
      });

      return () => unsub();
    });
  }, [users, currentUserId]);


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversationId) return;

    await sendMessage(activeConversationId, {
      name: currentUserId,
      textmessage: newMessage,
      day: "Today",
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };


  const getOtherUser = () => {
  if (!activeConversationId) return null;

  const [u1, u2] = activeConversationId.split("_");
  const otherId = u1 === currentUserId ? u2 : u1;

  return users.find((u) => u.id === otherId) || null;
};

  // CHAT SCREEN ------------------------------------------------
  if (activeConversationId) {
    const otherUser = getOtherUser();
    return (
      <Card className="h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center gap-4">
          <button onClick={() => setActiveConversationId(null)}>&larr;</button>
          {/* <p className="font-semibold">{activeConversationId}</p> */}
          {/* { users.map((user, idx) => (

          <p key={idx} className="font-semibold">{user.name}</p>
          ))} */}
            <p className="font-semibold">
          {otherUser ? otherUser.name : "Unknown User"}
        </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <AnimatePresence initial={false}>
            {chatMessages.map((msg, idx) => (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ChatMessage 
                // props={msg} 
                 props={{
                ...msg,
                time: formatMessageTime(msg)
              }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button
            onClick={handleSendMessage}
            className="bg-primary text-white px-4 py-1 rounded"
          >
            Send
          </button>
        </div>
      </Card>
    );
  }

  // CONVERSATION LIST ----------------------------------------
  return (
    <Card className="h-[90vh]">
      <div className="p-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
          <Input
            className="pl-10 bg-primary/20 placeholder:text-primary"
            placeholder="Search or start a new chat"
          />
        </div>
      </div>

      <div className="h-full overflow-y-auto scrollbar rounded-b-2xl pb-26">
        <AnimatePresence initial={false}>
          {users.map((user) => {
            if (user.id === currentUserId) return null;

            const convoId = getConversationId(currentUserId, user.id);
            const last = lastMessages[convoId];

            return (
              <motion.div
                key={convoId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border-t cursor-pointer p-2"
                onClick={() => setActiveConversationId(convoId)}
              >
                <Message
                  props={{
                    name: user.name,
                    textmessage: last?.textmessage || "Tap to chat",
                    day: last?.day || "",
                    // time: last?.timeStamp?.toDate
                    //   ? new Date(last.timeStamp.toDate()).toLocaleTimeString([], {
                    //       hour: "2-digit",
                    //       minute: "2-digit",
                    //     })
                    //   : "",
                    time: last ? formatMessageTime(last) : '',
                    image: user.image || "",
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
};













// "use client";
// import { Card, ChatMessage, Input, Message } from "@/components/atoms";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { subscribeToMessages, sendMessage, MessageData, getLastMessage } from "@/lib/firebase/messages";
// import { serverTimestamp } from "firebase/firestore";

// type MessagesProps = {
//   currentUserId: string;   // Pass logged-in user ID
//   users: { id: string; name: string, image?: string }[]; // Other users to show as conversations
// };

// type AllMessages = {
//   name: string
// }

// export const Messages = ({ currentUserId, users }: MessagesProps) => {
//   const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
//   const [chatMessages, setChatMessages] = useState<MessageData[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [lastMessages, setLastMessages] = useState<Record<string, MessageData | null>>({});


//   // Generate conversation ID
//   const getConversationId = (userId1: string, userId2: string) => {
//     return [userId1, userId2].sort().join("_");
//   };

//   // Subscribe to messages of active conversation
//   useEffect(() => {
//     if (!activeConversationId) return;

//     const unsubscribe = subscribeToMessages(activeConversationId, (msgs) => {
//       setChatMessages(msgs);
//     });

//     return () => unsubscribe();
//   }, [activeConversationId]);

//   useEffect(() => {
//   users.forEach((user) => {
//     if (user.id === currentUserId) return;

//     const convoId = getConversationId(currentUserId, user.id);
//     const unsubscribe = subscribeToMessages(convoId, (msgs) => {
//       if (msgs.length > 0) {
//         const last = msgs[msgs.length - 1];
//         setLastMessages((prev) => ({ ...prev, [convoId]: last }));
//       } else {
//         setLastMessages((prev) => ({ ...prev, [convoId]: null }));
//       }
//     });

//     return () => unsubscribe();
//   });
// }, [users, currentUserId]);



// useEffect(() => {
//   const loadLastMessages = async () => {
//     const results: Record<string, MessageData | null> = {};

//     for (const user of users) {
//       if (user.id === currentUserId) continue;

//       const conversationId = getConversationId(currentUserId, user.id);
//       results[conversationId] = await getLastMessage(conversationId);
//     }

//     setLastMessages(results);
//   };

//   loadLastMessages();
// }, [users, currentUserId]);


//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !activeConversationId) return;

//     await sendMessage(activeConversationId, {
//       name: currentUserId,
//       textmessage: newMessage,
//       day: "Today",
//       // time: new Date().toISOString(),
//       timeStamp: serverTimestamp(),
//       // new Date().toLocaleTimeString(),
//     });

//     setNewMessage("");
//   };

//   // --- Chat view ---
//   if (activeConversationId) {
//     return (
//       <Card className="h-[90vh] flex flex-col">
//         <div className="p-4 border-b flex items-center gap-4">
//           <button onClick={() => setActiveConversationId(null)}>&larr;</button>
//           <p className="font-semibold">{activeConversationId}</p>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-2">
//           <AnimatePresence initial={false}>
//             {chatMessages.map((msg, idx) => (
//               <motion.div
//                 key={msg.id || idx}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//               >
//                 <ChatMessage props={msg}/>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>

//         <div className="p-4 border-t flex items-center gap-2">
//           <Input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message"
//           />
//           <div>
//           <button
//             onClick={handleSendMessage}
//             className="bg-primary text-white px-4 py-1 rounded"
//           >
//             Send
//           </button>
//           </div>
//         </div>
//       </Card>
//     );
//   }


//   // const convoId = getConversationId(currentUserId, user.id);
// // const last = lastMessages[convoId];


//   // --- Conversation list view ---
//   return (
//     <Card className="h-[90vh]">
//       <div className="p-6 space-y-3">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
//           <Input
//             className="pl-10 bg-primary/20 placeholder:text-primary"
//             placeholder="Search or start a new chat"
//           />
//         </div>
//       </div>

//       <div className="h-full overflow-y-auto scrollbar rounded-b-2xl pb-26">
//         <AnimatePresence initial={false}>
//           {users.map((user) => {
//   if (user.id === currentUserId) return null;

//   const conversationId = getConversationId(currentUserId, user.id);
//   const last = lastMessages[conversationId];

//   return (
//     <motion.div
//       key={conversationId}
//       layout
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ duration: 0.25 }}
//       className="border-t cursor-pointer p-2"
//       onClick={() => setActiveConversationId(conversationId)}
//     >
//       <Message 
//         props={{
//           name: user.name,
//           textmessage: last?.textmessage || "Tap to chat",
//           day: last?.day || "",
//           time: last?.time || "",
//           image: user.image || "",
//         }}
//       />
//     </motion.div>
//   );
// })}

//         </AnimatePresence>
//       </div>
//     </Card>
//   );
// };












// "use client";
// import { Card, Input, Message } from "@/components/atoms";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { subscribeToMessages, sendMessage } from "@/lib/firebase/messages";

// type MessageData = {
//   id?: string;
//   name: string;
//   textmessage: string;
//   day: string;
//   time: string;
//   pinned?: boolean;
// };

// type MessagesProps = {
//   projects?: MessageData[];
//   projectCount?: number;
//   onSearch?: (query: string) => void;
// };

// export const Messages = ({ projects, projectCount, onSearch }: MessagesProps) => {
//   // TEST USERS (replace with real auth IDs later)
//   const currentUserId = "user1";
//   const otherUserId = "user2";

//   const [searchQuery, setSearchQuery] = useState("");
//   const [conversations, setConversations] = useState<MessageData[]>([]);
//   const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
//   const [chatMessages, setChatMessages] = useState<MessageData[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   // generate conversation ID for two users
//   const conversationId = [currentUserId, otherUserId].sort().join("_");
//   const testConversationId = "test-convo"; // any string you choose


//   // Load conversation list (for testing just show one conversation)
//   useEffect(() => {
//     const unsubscribe = subscribeToMessages(conversationId, (msgs: MessageData[]) => {
//       setConversations(msgs); // for demo, treat messages as conversation preview
//     });
//     return () => unsubscribe();
//   }, [conversationId]);

//   // Load chat messages for active conversation
//   useEffect(() => {
//     if (!activeConversationId) return;
//     const unsubscribe = subscribeToMessages(testConversationId, (msgs: MessageData[]) => {
//       setChatMessages(msgs);
//     });
//     return () => unsubscribe();
//   }, [activeConversationId]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim() || !testConversationId) return;
//     sendMessage(testConversationId, {
//       name: currentUserId,
//       textmessage: newMessage,
//       day: "Today",
//       time: new Date().toLocaleTimeString(),
//       pinned: false,
//     });
//     setNewMessage("");
//   };

//   // Chat screen
//   if (activeConversationId) {
//     return (
//       <Card className="h-[90vh] flex flex-col">
//         <div className="p-4 border-b flex items-center gap-4">
//           <button onClick={() => setActiveConversationId(null)}>&larr;</button>
//           <p className="font-semibold">{activeConversationId}</p>
//         </div>
//         <div className="flex-1 overflow-y-auto p-4 space-y-2">
//           <AnimatePresence initial={false}>
//             {chatMessages.map((msg, idx) => (
//               <motion.div
//                 key={msg.id || idx}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//               >
//                 <Message props={msg}>{""}</Message>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//         <div className="p-4 border-t flex gap-2">
//           <Input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message"
//           />
//           <button onClick={handleSendMessage} className="bg-primary text-white px-4 rounded">
//             Send
//           </button>
//         </div>
//       </Card>
//     );
//   }

//   // Conversations list view (click to open chat)
  
//         console.log('conv', conversations)
//   return (
//     <Card className="h-[90vh]">
//       <div className="p-6 space-y-3">
//         <div className="relative">
//           <Search
//             onClick={() => onSearch?.(searchQuery)}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer transition-transform duration-150 hover:scale-110"
//             size={18}
//           />
//           <Input
//             className="pl-10 bg-primary/20 placeholder:text-primary"
//             placeholder="Search or start a new chat"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>
//       <div className="h-full overflow-y-auto scrollbar rounded-b-2xl pb-26">
//         <AnimatePresence initial={false}>
//           {conversations.map((conv, idx) => (
//             <motion.div
//               key={conv.id || idx}
//               layout
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.25 }}
//               className="border-t cursor-pointer"
//               onClick={() => setActiveConversationId(conversationId)}
//             >
//               <Message props={conv}/>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </Card>
//   );
// };













// "use client";
// import { Card, Input, Message, RunningProjects } from "@/components/atoms";
// import { cn } from "@/lib/utils";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { subscribeToMessages, sendMessage } from "@/lib/firebase/messages";

// type MessageData = {
//   id?: string;
//   name: string;
//   textmessage: string;
//   day: string;
//   time: string;
//   pinned?: boolean;
// };

// type MessagesProps = {
//   messages?: MessageData[]; 
//   projects: MessageData[];
//   projectCount: number;
//   onSearch?: (query: string) => void;
// };

// export const Messages = ({ projects, projectCount, onSearch }: MessagesProps) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [conversations, setConversations] = useState<MessageData[]>([]);
//   const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
//   const [chatMessages, setChatMessages] = useState<MessageData[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Load conversations list (hardcode for now)
//   useEffect(() => {
//     // const conversationId = "global"; 
//     const conversationId = [currentUserId, otherUserId].sort().join("_");

//     const unsubscribe = subscribeToMessages(conversationId, (msgs: MessageData[]) => {
//       setConversations(msgs);
//     });
//     return () => unsubscribe();
//   }, []);

//   console.log('all the talkkk', activeConversationId)
//   // Load chat messages for active conversation
//   useEffect(() => {
//     if (!activeConversationId) return;
//     const unsubscribe = subscribeToMessages(activeConversationId, (msgs: MessageData[]) => {
//       setChatMessages(msgs);
//     });
//     return () => unsubscribe();
//   }, [activeConversationId]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim() || !activeConversationId) return;
//     sendMessage(activeConversationId, {
//       name: "Me",
//       textmessage: newMessage,
//       day: "Today",
//       time: new Date().toLocaleTimeString(),
//       pinned: false,
//     });
//     setNewMessage("");
//   };

//   if (activeConversationId) {
//     // Chat screen view
//     return (
//       <Card className="h-[90vh] flex flex-col">
//         <div className="p-4 border-b flex items-center gap-4">
//           <button onClick={() => setActiveConversationId(null)}>&larr;</button>
//           <p className="font-semibold">Chat</p>
//         </div>
//         <div className="flex-1 overflow-y-auto p-4 space-y-2">
//           <AnimatePresence initial={false}>
//             {chatMessages.map((msg, idx) => (
//               <motion.div
//                 key={msg.id || idx}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//               >
//                 <Message props={msg} >{""}</Message>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//         <div className="p-4 border-t flex gap-2">
//           <Input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message"
//           />
//           <button onClick={handleSendMessage} className="bg-primary text-white px-4 rounded">
//             Send
//           </button>
//         </div>
//       </Card>
//     );
//   }

//   // Conversations list view
//   return (
//     <Card className="h-[90vh]">
//       <div className="p-6 space-y-3">
//         <div className="relative">
//           <Search
//             onClick={() => onSearch?.(searchQuery)}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer transition-transform duration-150 hover:scale-110"
//             size={18}
//           />
//           <Input
//             className="pl-10 bg-primary/20 placeholder:text-primary"
//             placeholder="Search or start a new chat"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>
//       <div className="h-full overflow-y-auto scrollbar rounded-b-2xl pb-26">
//         <AnimatePresence initial={false}>
//           {conversations.map((conv, idx) => (
//             <motion.div
//               key={conv.id || idx}
//               layout
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.25 }}
//               className="border-t cursor-pointer"
//               onClick={() => setActiveConversationId(conv.id || `conv-${idx}`)}
//             >
//               <Message props={conv} >{""}</Message>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </Card>
//   );
// };













// "use client";
// import { Card, Input, Message, RunningProjects } from "@/components/atoms";
// import { cn } from "@/lib/utils";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, Star } from "lucide-react";
// import React, { useState } from "react";
// import { useEffect } from "react";
// import { subscribeToMessages } from "@/lib/firebase/messages";


// type MessageData = {
//   name: string;
//   textmessage: string;
//   day: string;
//   time: string;
//   pinned?: boolean;
// };

// type MessagesProps = {
//   messages: MessageData[];
//   projects: MessageData[];
//   projectCount: number;
//   onSearch?: (query: string) => void;
// };

// export const Messages = ({
//   messages,
//   projects,
//   projectCount,
//   onSearch,
// }: MessagesProps) => {
//   const [activeTab, setActiveTab] = useState<"messages" | "projects">(
//     "messages"
//   );
//   const [searchQuery, setSearchQuery] = useState("");
//   // const [data, setData] = useState(messages);
//   const [data, setData] = useState<MessageData[]>([]);
//   const [activeConversationId, setActiveConversationId] = useState<string | null>(null);



//   useEffect(() => {
//   // hardcode conversation for now; later you’ll pass the ID from props
//   const conversationId = "global";

//   const unsubscribe = subscribeToMessages(conversationId, (msgs: any[]) => {
//     // Convert Firestore timestamps to your format if needed later
//     setData(msgs);
//   });

//   return () => unsubscribe();
// }, []);


//   const togglePin = (index: number) => {
//     const updated = [...data];
//     updated[index].pinned = !updated[index].pinned;
//     updated.sort((a, b) => Number(b.pinned) - Number(a.pinned));
//     setData(updated);
//   };

//   const handleSearch = () => {
//     if (onSearch) onSearch(searchQuery);
//   };
//   return (
//     <div className="font-sans  overflow-hidden rounded-2xl bg-white">
//       <Card className="h-[90vh]">
//         <div className="p-6 space-y-3 font-sans">
//           <div className="relative">
//             <Search
//               onClick={handleSearch}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer transition-transform duration-150 hover:scale-110"
//               size={18}
//             />
//             <Input
//               className="pl-10 bg-primary/20 placeholder:text-primary"
//               placeholder="Search or start a new chat"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>
//         <div
//           //   className="h-full overflow-y-auto custom-scroll scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-transparent"
//           className="h-full overflow-y-auto scrollbar rounded-b-2xl pb-26"
//         >
//           <AnimatePresence initial={false}>
//             {activeTab === "messages" ? (
//               data.map((n, idx) => (
//                 <motion.div
//                   key={idx}
//                   layout
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.25 }}
//                   className="border-t"
//                 >
//                   <Message
//                     props={{
//                       name: n.name,
//                       textmessage: n.textmessage,
//                       day: n.day,
//                       time: n.time,
//                     }}
//                   >
//                     {/* <Star
//                       onClick={() => togglePin(idx)}
//                       className={cn(
//                         "cursor-pointer transition-transform duration-150 hover:scale-110",
//                         n.pinned ? "text-primary fill-primary" : "text-ring"
//                       )}
//                       size={16}
//                     /> */}
//                     {""}
//                   </Message>
//                 </motion.div>
//               ))
//             ) : (
//               <motion.div
//                 key="projects"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <RunningProjects projects={projects} />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </Card>
//     </div>
//   );
// };
