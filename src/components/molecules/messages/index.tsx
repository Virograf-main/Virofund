"use client";
import { Card, Input, Message, RunningProjects } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star } from "lucide-react";
import React, { useState } from "react";

type MessageData = {
  name: string;
  textmessage: string;
  day: string;
  time: string;
  pinned?: boolean;
};

type MessagesProps = {
  messages: MessageData[];
  projects: MessageData[];
  projectCount: number;
  onSearch?: (query: string) => void;
};

export const Messages = ({
  messages,
  projects,
  projectCount,
  onSearch,
}: MessagesProps) => {
  const [activeTab, setActiveTab] = useState<"messages" | "projects">(
    "messages"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(messages);

  const togglePin = (index: number) => {
    const updated = [...data];
    updated[index].pinned = !updated[index].pinned;
    updated.sort((a, b) => Number(b.pinned) - Number(a.pinned));
    setData(updated);
  };

  const handleSearch = () => {
    if (onSearch) onSearch(searchQuery);
  };
  return (
    <div className="font-sans  overflow-hidden rounded-2xl bg-white h-full ">
      <Card className="h-[90vh]">
        <div className="p-6 space-y-3 font-sans">
          <div className="relative">
            <Search
              onClick={handleSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer transition-transform duration-150 hover:scale-110"
              size={18}
            />
            <Input
              className="pl-10 bg-primary/20 placeholder:text-primary"
              placeholder="Search or start a new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div
          //   className="h-full overflow-y-auto custom-scroll scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-transparent"
          className="h-full overflow-y-auto scrollbar"
        >
          <AnimatePresence initial={false}>
            {activeTab === "messages" ? (
              data.map((n, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="border-t"
                >
                  <Message
                    props={{
                      name: n.name,
                      textmessage: n.textmessage,
                      day: n.day,
                      time: n.time,
                    }}
                  >
                    {/* <Star
                      onClick={() => togglePin(idx)}
                      className={cn(
                        "cursor-pointer transition-transform duration-150 hover:scale-110",
                        n.pinned ? "text-primary fill-primary" : "text-ring"
                      )}
                      size={16}
                    /> */}
                    {""}
                  </Message>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RunningProjects projects={projects} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};
