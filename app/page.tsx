"use client";

import { useState } from "react";
import Chat from "@/components/Chat";
import Map from "@/components/Map";
import { useChatForm } from "@/components/Chat/useChatForm";
import { cn } from "@/utils/className";
import HistoryList from "@/components/HistoryList";

export default function Home() {
  const {
    activeGeoJSON,
    activeIntention,
    loadConversation,
    currentConversationId,
    handleDeleteChat,
    ...chat
  } = useChatForm();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const toggleHistory = () => setIsHistoryOpen((prev) => !prev);

  const handleSelectHistoryItem = (id: string) => {
    loadConversation(id);
    setIsHistoryOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] p-3 overflow-hidden">
      <div
        className={cn(
          "flex flex-col min-h-0 bg-white rounded-lg transition-all duration-250 ease-in-out overflow-hidden",
          isHistoryOpen
            ? "w-[17.5%] p-6 ps-4 pe-0 mr-3 opacity-100 shadow-sm"
            : "w-0 mr-0 py-6 opacity-0 shadow-none border-none"
        )}
      >
        <HistoryList
          onClose={toggleHistory}
          onSelectChat={handleSelectHistoryItem}
          activeChatId={currentConversationId?.toString()}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      <div
        className={cn("w-[25%] flex flex-col min-h-0 transition-all duration-250 ease-in-out mr-3")}
      >
        <Chat {...chat} onToggleHistory={toggleHistory} onActivateMap={chat.handleActivateMap} />
      </div>

      <div
        className={cn(
          "flex flex-col min-h-0 transition-all duration-250 ease-in-out",
          isHistoryOpen ? "w-[57.5%]" : "w-[77.5%]"
        )}
      >
        <Map
          onSuggestionClick={chat.handleSuggestion}
          geoJsonData={activeGeoJSON}
          intention={activeIntention}
          onPointClick={chat.handleSuggestion}
        />
      </div>
    </div>
  );
}
