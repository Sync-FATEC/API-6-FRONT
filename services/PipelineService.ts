import {
  IPipelineHistoryResponse,
  IPipelineExecutionResponse,
  IPipelineStatusResponse,
  PipelineStatusResponse,
  PipelineCancelResponse,
} from "@/interfaces/services/PipelineService";
import { BaseService } from "./BaseService";
import { TOKEN_KEY } from "@/constants/auth";

export const PipelineService = {
  execute: async (stage: string, entities: string[]): Promise<IPipelineExecutionResponse> => {
    const token = localStorage.getItem(TOKEN_KEY) ?? "";
    const params = new URLSearchParams();

    params.append("etapa", stage);

    entities.forEach((entity) => {
      params.append("entidades", entity);
    });

    return BaseService.postWithAuth<IPipelineExecutionResponse>(
      `/etl/executar?${params.toString()}`,
      token
    );
  },

  history: async (): Promise<IPipelineHistoryResponse> => {
    return BaseService.get<IPipelineHistoryResponse>("/etl/historico");
  },

  status: async (): Promise<PipelineStatusResponse> => {
    return BaseService.get<PipelineStatusResponse>("/etl/status");
  },

  getExecutionStatus: async (executionId: string): Promise<IPipelineStatusResponse> => {
    return BaseService.get<IPipelineStatusResponse>(`/etl/status/${executionId}?_=${Date.now()}`);
  },

  cancel: async (): Promise<PipelineCancelResponse> => {
    const token = localStorage.getItem(TOKEN_KEY) ?? "";
    return BaseService.postWithAuth<PipelineCancelResponse>("/etl/cancelar", token);
  },
};
