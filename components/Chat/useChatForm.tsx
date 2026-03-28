import { useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { QueryService } from "@/services/QueryService";
import { ChatMessage } from "@/interfaces/components/chat";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";

export function useChatForm() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeGeoJSON, setActiveGeoJSON] = useState<IGeoJSONFeatureCollection | null>(null);
  const [activeIntention, setActiveIntention] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleNewChat = () => {
    setMessages([]);
    setMessage("");
    setActiveGeoJSON(null);
    setActiveIntention(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.overflowY = "hidden";
    }
  };

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

  const chatMutation = useMutation({
    mutationFn: (pergunta: string) => QueryService.query(pergunta),
  });

  const handleSend = () => {
    const text = message.trim();
    if (!text || chatMutation.isPending) return;

    const startTime = performance.now();
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    const botId = crypto.randomUUID();

    const thinkingMessage: ChatMessage = {
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

    chatMutation.mutate(text, {
      onSuccess: (data) => {
        const endTime = performance.now();
        const fullText = data.resumo || "";

        if (data.geojson?.features?.length > 0) {
          setActiveGeoJSON(data.geojson);
        }

        if (data.intencao_detectada) {
          setActiveIntention(data.intencao_detectada);
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId
              ? {
                  ...msg,
                  status: "typing",
                  thinkingTime: endTime - startTime,
                  source: data.fontes?.[0]?.nome || "Múltiplas",
                  intention: `${data.intencao_detectada} (${(data.confianca * 100).toFixed(0)}%)`,
                }
              : msg
          )
        );

        if (fullText.length === 0) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === botId ? { ...msg, status: "done", content: "" } : msg))
          );
          return;
        }

        let currentText = "";
        let i = 0;

        const delayPerChar = Math.max(1, Math.floor(2000 / fullText.length));

        const interval = setInterval(() => {
          currentText += fullText[i];
          setMessages((prev) =>
            prev.map((msg) => (msg.id === botId ? { ...msg, content: currentText } : msg))
          );
          i++;

          if (i >= fullText.length) {
            clearInterval(interval);
            setMessages((prev) =>
              prev.map((msg) => (msg.id === botId ? { ...msg, status: "done" } : msg))
            );
          }
        }, delayPerChar);
      },
      onError: (error) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId ? { ...msg, status: "done", content: `${error.message}` } : msg
          )
        );
      },
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text: string) => {
    setMessage(text);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return {
    message,
    messages,
    activeGeoJSON,
    activeIntention,
    textareaRef,
    handleInput,
    handleSend,
    handleKeyDown,
    handleNewChat,
    handleSuggestion,
    isPending: chatMutation.isPending,
  };
}
