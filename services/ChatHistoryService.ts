import { IHistoricoResponse, IConversaDetalhadaResponse } from "@/interfaces/services/ChatHistoryService";
import { BaseService } from "./BaseService";

export const ChatHistoryService = {
  getHistory: async (token: string): Promise<IHistoricoResponse> => {
    return BaseService.getWithAuth<IHistoricoResponse>("/historico", token);
  },

  getConversation: async (id: number, token: string): Promise<IConversaDetalhadaResponse> => {
    return BaseService.getWithAuth<IConversaDetalhadaResponse>(`/historico/${id}`, token);
  },

  deleteConversation: async (id: number, token: string): Promise<{ ok: boolean }> => {
    return BaseService.deleteWithAuth<{ ok: boolean }>(`/historico/${id}`, token);
  },
};
