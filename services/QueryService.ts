import { QueryResponse } from "@/interfaces/services/QueryService";
import { BaseService } from "./BaseService";

export const QueryService = {
  query: async (pergunta: string): Promise<QueryResponse> => {
    return BaseService.post<QueryResponse>("/consulta", { pergunta });
  },
};
