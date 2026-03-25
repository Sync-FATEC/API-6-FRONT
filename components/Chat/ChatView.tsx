import React, { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import Button from "../Button";

interface ChatViewProps {
  messages: Message[];
}

export default function ChatView({ messages }: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-lg p-6 shadow-sm flex flex-col gap-2 chat-scrollbar">
      {messages.length === 0 ? (
        <div>
          <h2 className="text-primary text-xl font-semibold mb-4">Bem vindo ao VISIONA GeoQuery</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Aqui, você pode analisar os indicadores ambientais de qualquer imóvel rural do estado de
            São Paulo em segundos.
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] wrap-break-word rounded-lg text-sm sm:text-base ${
              msg.role === "user"
                ? "bg-slate-50 text-slate-700 self-end rounded-br-none p-3"
                : "text-slate-700 self-start rounded-bl-none"
            }`}
          >
            {msg.role === "bot" && (
              <>
                {msg.status === "thinking" && (
                  <div className="flex items-center gap-1 p-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                )}

                {msg.status !== "thinking" && (
                  <>
                    {msg.thinkingTime && (
                      <div className="text-xs text-slate-400 mb-1">
                        Pensou por {(msg.thinkingTime / 1000).toFixed(2)}s
                      </div>
                    )}

                    <p>{msg.content}</p>

                    {msg.status === "done" && (
                      <div className="mt-2">
                        <Button variant="tertiary" size="sm" className="text-slate-400">
                          Mais informações
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {msg.role === "user" && <p>{msg.content}</p>}
          </div>
        ))
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
