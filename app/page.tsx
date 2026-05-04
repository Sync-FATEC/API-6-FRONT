"use client";

import Chat from "@/components/Chat";
import Map from "@/components/Map";
import { useChatForm } from "@/components/Chat/useChatForm";

export default function Home() {
  const { activeGeoJSON, activeIntention, ...chat } = useChatForm();

  return (
    <div className="flex gap-3 h-[calc(100vh-80px)] p-3 overflow-hidden">
      <div className="w-[25%] flex flex-col min-h-0">
        <Chat {...chat} />
      </div>
      <div className="w-[75%] flex flex-col min-h-0">
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
