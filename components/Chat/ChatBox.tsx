"use client";

import React from "react";
import Button from "../Button";
import Icon from "../Icon";

interface Props {
  message: string;
  hasMessages: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onNewChat: () => void;
}

export default function ChatBox({
  message,
  hasMessages,
  textareaRef,
  onInput,
  onKeyDown,
  onSend,
  onNewChat,
}: Props) {
  const hasText = message.trim().length > 0;

  return (
    <div className="bg-white rounded-lg p-2 pe-0 shadow-sm flex flex-col justify-between">
      <textarea
        ref={textareaRef}
        value={message}
        placeholder="Digite a sua pergunta aqui"
        onChange={onInput}
        onKeyDown={onKeyDown}
        className="w-full text-slate-700 bg-transparent outline-none p-3 resize-none overflow-y-hidden max-h-24 h-12 chat-scrollbar"
      />

      <div className="flex justify-between items-end mt-2">
        <Button variant="ghost" className="text-primary">
          <Icon name="help" size={20} />
          Ajuda
        </Button>

        <div className="flex gap-1">
          {hasMessages && (
            <Button variant="ghost" className="text-slate-400 animate-pop-in" onClick={onNewChat}>
              Novo Chat
            </Button>
          )}

          <Button variant="ghost" className="text-slate-500 me-2" square onClick={onSend}>
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div
                className={`absolute transition-all duration-300 ${hasText ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
              >
                <Icon name="send" size={24} />
              </div>
              <div
                className={`absolute transition-all duration-300 ${!hasText ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
              >
                <Icon name="mic" size={24} />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
