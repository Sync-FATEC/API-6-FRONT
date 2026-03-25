"use client";

import ChatView from "./ChatView";
import ChatBox from "./ChatBox";
import { useChatForm } from "./useChatForm";

export default function Chat() {
  const { message, messages, textareaRef, handleInput, handleSend, handleKeyDown, handleNewChat } = useChatForm();

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
