"use client";

import ChatView from "./ChatView";
import ChatBox from "./ChatBox";
import { ChatMessage } from "@/interfaces/components/chat";
import { IQueryResponse } from "@/interfaces/services/QueryService";

type Props = {
  message: string;
  messages: ChatMessage[];
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleNewChat: () => void;
  handleVoiceInput: (text: string) => void;
  onToggleHistory: () => void;
  activeMessageId?: string | null;
  onActivateMap?: (msgId: string, queryData: IQueryResponse) => void;
};

export default function Chat({
  message,
  messages,
  textareaRef,
  handleInput,
  handleSend,
  handleKeyDown,
  handleNewChat,
  handleVoiceInput,
  onToggleHistory,
  activeMessageId,
  onActivateMap,
}: Props) {
  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      <ChatView
        messages={messages}
        activeMessageId={activeMessageId}
        onActivateMap={onActivateMap}
      />
      <ChatBox
        message={message}
        hasMessages={messages.length > 0}
        textareaRef={textareaRef}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
        onNewChat={handleNewChat}
        onVoiceInput={handleVoiceInput}
        onToggleHistory={onToggleHistory}
      />
    </div>
  );
}
