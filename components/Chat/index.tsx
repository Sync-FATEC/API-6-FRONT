"use client";

import ChatView from "./ChatView";
import ChatBox from "./ChatBox";
import { Message } from "@/types/chat";

type ChatProps = {
  message: string;
  messages: Message[];
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleNewChat: () => void;
};

export default function Chat({
  message,
  messages,
  textareaRef,
  handleInput,
  handleSend,
  handleKeyDown,
  handleNewChat,
}: ChatProps) {
  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      <ChatView messages={messages} />
      <ChatBox
        message={message}
        hasMessages={messages.length > 0}
        textareaRef={textareaRef}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
        onNewChat={handleNewChat}
      />
    </div>
  );
}