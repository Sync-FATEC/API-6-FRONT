import { IQueryResponse } from "@/interfaces/services/QueryService";
import { BaseService } from "./BaseService";

export const QueryService = {
  query: async (
    pergunta: string,
    token: string,
    conversaId?: number | null
  ): Promise<IQueryResponse> => {
    return BaseService.postWithAuth<IQueryResponse>("/consulta", token, {
      pergunta,
      conversa_id: conversaId,
    });
  },

  downloadPropertyReport: async (car: string): Promise<Blob> => {
    return BaseService.getBlob(`/fazenda/relatorio-asg?car=${car}`);
  },
};
