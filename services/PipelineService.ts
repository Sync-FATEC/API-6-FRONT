import {
  IPipelineHistoryResponse,
  IPipelineExecutionResponse,
  PipelineStatusResponse,
  PipelineCancelResponse,
} from "@/interfaces/services/PipelineService";
import { BaseService } from "./BaseService";

export const PipelineService = {
  execute: async (stage: string, entities: string[]): Promise<IPipelineExecutionResponse> => {
    const params = new URLSearchParams();

    params.append("etapa", stage);

    entities.forEach((entity) => {
      params.append("entidades", entity);
    });

    return BaseService.post<IPipelineExecutionResponse>(`/etl/executar?${params.toString()}`);
  },

  history: async (): Promise<IPipelineHistoryResponse> => {
    return BaseService.get<IPipelineHistoryResponse>("/etl/historico");
  },

  status: async (): Promise<PipelineStatusResponse> => {
    return BaseService.get<PipelineStatusResponse>("/etl/status");
  },

  cancel: async (): Promise<PipelineCancelResponse> => {
    return BaseService.post<PipelineCancelResponse>("/etl/cancelar");
  },
};
