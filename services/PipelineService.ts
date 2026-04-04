import {
  IPipelineHistoryResponse,
  IPipelineExecutionResponse,
} from "@/interfaces/services/PipelineService";
import { BaseService } from "./BaseService";

export const PipelineService = {
  execute: async (etapa: string = "full"): Promise<IPipelineExecutionResponse> => {
    return BaseService.post<IPipelineExecutionResponse>(`/etl/executar?etapa=${etapa}`, {});
  },

  history: async (): Promise<IPipelineHistoryResponse> => {
    return BaseService.get<IPipelineHistoryResponse>("/etl/historico");
  },
};
