import { useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryService } from "@/services/QueryService";
import { ChatHistoryService } from "@/services/ChatHistoryService";
import { ChatMessage } from "@/interfaces/components/chat";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";
import { useAuth } from "@/contexts/AuthContext";
import { IQueryResponse } from "@/interfaces/services/QueryService";
import { toast } from "@/lib/toast";

export function useChatForm() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeGeoJSON, setActiveGeoJSON] = useState<IGeoJSONFeatureCollection | null>(null);
  const [activeIntention, setActiveIntention] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { token } = useAuth();
  const queryClient = useQueryClient();

  const loadConversation = async (id: string) => {
    if (!token) return;

    setIsLoadingChat(true);
    setCurrentConversationId(Number(id));
    try {
      const data = await ChatHistoryService.getConversation(Number(id), token);

      const mappedMessages: ChatMessage[] = data.mensagens.map((msg) => ({
        id: msg.id.toString(),
        role: msg.papel === "usuario" ? "user" : "bot",
        content: msg.conteudo_texto,
        status: "done",
        queryData: msg.dados
          ? ({
              geojson: msg.dados.geojson,
              intencao_detectada: msg.intencao_detectada,
            } as unknown as IQueryResponse)
          : undefined,
      }));

      setMessages(mappedMessages);

      const mensagensSistema = data.mensagens.filter((m) => m.papel === "sistema");
      const ultimaMsg =
        mensagensSistema.length > 0 ? mensagensSistema[mensagensSistema.length - 1] : null;

      if (ultimaMsg?.dados?.geojson) {
        setActiveGeoJSON(ultimaMsg.dados.geojson as unknown as IGeoJSONFeatureCollection);
      } else {
        setActiveGeoJSON(null);
      }

      if (ultimaMsg?.intencao_detectada) {
        setActiveIntention(ultimaMsg.intencao_detectada);
      } else {
        setActiveIntention(null);
      }

      if (ultimaMsg) {
        setActiveMessageId(ultimaMsg.id.toString());
      }
    } catch (error) {
      console.error("Erro ao carregar a conversa:", error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setMessage("");
    setActiveGeoJSON(null);
    setActiveIntention(null);
    setCurrentConversationId(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.overflowY = "hidden";
    }
  };

  const handleActivateMap = (msgId: string, queryData: IQueryResponse) => {
    setActiveMessageId(msgId);

    if (queryData?.geojson) {
      const novoGeoJSON = JSON.parse(JSON.stringify(queryData.geojson));
      setActiveGeoJSON(novoGeoJSON);
    } else {
      setActiveGeoJSON(null);
    }

    setActiveIntention(queryData?.intencao_detectada || null);
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
    mutationFn: (pergunta: string) =>
      QueryService.query(pergunta, token as string, currentConversationId),
    onSuccess: (data) => {
      if (!currentConversationId && data.conversa_id) {
        setCurrentConversationId(data.conversa_id);
      }
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
    },
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

        if (data.geojson && data.geojson.features && data.geojson.features.length > 0) {
          setActiveGeoJSON(data.geojson as unknown as IGeoJSONFeatureCollection);
        }

        if (data.intencao_detectada) {
          setActiveIntention(data.intencao_detectada);
        }

        setActiveMessageId(botId);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId
              ? {
                  ...msg,
                  status: "typing",
                  thinkingTime: endTime - startTime,
                  queryData: data,
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
        const httpError = error as Error & { status?: number };
        const content =
          httpError.status === 503
            ? "A base de dados está sendo atualizada no momento. As consultas estarão disponíveis assim que a atualização for concluída. Tente novamente em alguns minutos."
            : error.message;
        setMessages((prev) =>
          prev.map((msg) => (msg.id === botId ? { ...msg, status: "done", content } : msg))
        );
      },
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ChatHistoryService.deleteConversation(Number(id), token as string),
    onSuccess: (_, deletedId) => {
      toast.success("Conversa deletada", "A conversa foi deletada com sucesso!");

      queryClient.invalidateQueries({ queryKey: ["chat-history"] });

      if (currentConversationId === Number(deletedId)) {
        handleNewChat();
      }
    },
    onError: () => {
      toast.error("Erro ao deletar conversa", "Ocorreu um erro inesperado ao deletar a conversa.");
    },
  });

  const handleDeleteChat = (id: string) => {
    deleteMutation.mutate(id);
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

  const handleVoiceInput = (text: string) => {
    setMessage((prev) => prev + text);
  };

  return {
    message,
    messages,
    activeGeoJSON,
    activeIntention,
    textareaRef,
    isLoadingChat,
    currentConversationId,
    activeMessageId,
    handleActivateMap,
    handleInput,
    handleSend,
    handleDeleteChat,
    handleKeyDown,
    handleNewChat,
    handleSuggestion,
    handleVoiceInput,
    loadConversation,
    isPending: chatMutation.isPending,
  };
}
