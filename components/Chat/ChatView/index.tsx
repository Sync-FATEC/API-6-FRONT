import { useEffect, useRef } from "react";
import ChatHeader from "./Header";
import DetailsModal from "./DetailsModal";
import { ChatMessage } from "@/interfaces/components/chat";

interface Props {
  messages: ChatMessage[];
}

export default function ChatView({ messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isChatStarted = messages.length > 0;

  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-lg p-6 shadow-sm flex flex-col gap-4 min-h-0 chat-scrollbar">
      <ChatHeader isChatStarted={isChatStarted} />

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-[80%] wrap-break-word rounded-lg text-sm sm:text-base ${
            msg.role === "user"
              ? "bg-slate-50 text-slate-700 self-end rounded-br-none p-3"
              : "text-slate-700 self-start rounded-bl-none"
          }`}
        >
          {msg.role === "bot" ? (
            <>
              {msg.status === "thinking" ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              ) : (
                <>
                  {msg.thinkingTime && (
                    <div className="text-sm font-medium text-slate-400 mb-1 animate-pop-in-up">
                      Pensou por {(msg.thinkingTime / 1000).toFixed(2)}s
                    </div>
                  )}
                  <p>{msg.content}</p>

                  {msg.status === "done" && (
                    <DetailsModal source={msg.source} year={msg.year} intention={msg.intention} />
                  )}
                </>
              )}
            </>
          ) : (
            <p>{msg.content}</p>
          )}
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}
