import { useQuery } from "@tanstack/react-query";
import { ChatHistoryService } from "@/services/ChatHistoryService";
import { groupConversations } from "@/utils/groupHistory";
import { useAuth } from "@/contexts/AuthContext";

export function useChatHistory() {
  const { token } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["chat-history", token],
    queryFn: () => ChatHistoryService.getHistory(token as string),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  const groupedHistory = data?.conversas ? groupConversations(data.conversas) : [];

  return {
    history: groupedHistory,
    isLoading,
    isError,
    refetchHistory: refetch,
  };
}
