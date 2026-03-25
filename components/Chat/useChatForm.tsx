import { useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import { Message } from "@/types/chat";

export function useChatForm() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setMessage(target.value);

    const currentHeight = target.clientHeight;

    target.style.transition = "none";
    target.style.height = "auto";
    const newScrollHeight = target.scrollHeight;

    if (newScrollHeight > 96) {
      target.style.overflowY = "auto";
    } else {
      target.style.overflowY = "hidden";
    }

    target.style.height = `${currentHeight}px`;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    target.offsetHeight;

    target.style.transition = "height 0.2s ease-in-out";
    target.style.height = `${newScrollHeight > 96 ? 96 : newScrollHeight}px`;
  };

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;

    const startTime = performance.now();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const botId = crypto.randomUUID();

    const thinkingMessage: Message = {
      id: botId,
      role: "bot",
      content: "",
      status: "thinking",
    };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);

    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.overflowY = "hidden";
    }

    const delay = 1200

    setTimeout(() => {
      const fullText = "Esta é uma resposta simulada do VISIONA GeoQuery!";
      let currentText = "";
      let i = 0;

      const endTime = performance.now();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botId
            ? {
                ...msg,
                status: "typing",
                thinkingTime: endTime - startTime,
              }
            : msg
        )
      );

      const interval = setInterval(() => {
        currentText += fullText[i];

        setMessages((prev) =>
          prev.map((msg) => (msg.id === botId ? { ...msg, content: currentText } : msg))
        );

        i++;

        if (i >= fullText.length) {
          clearInterval(interval);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botId
                ? {
                    ...msg,
                    status: "done",
                  }
                : msg
            )
          );
        }
      }, 20);
    }, delay);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    message,
    messages,
    textareaRef,
    handleInput,
    handleSend,
    handleKeyDown,
  };
}
