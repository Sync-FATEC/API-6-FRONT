import { IQueryResponse } from "@/interfaces/services/QueryService";
import { BaseService } from "./BaseService";

export const QueryService = {
  query: async (pergunta: string): Promise<IQueryResponse> => {
    return BaseService.post<IQueryResponse>("/consulta", { pergunta });
  },

  downloadPropertyReport: async (car: string): Promise<Blob> => {
    return BaseService.getBlob(`/fazenda/relatorio-asg?car=${car}`);
  },
};
