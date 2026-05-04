import { IDashboardResponse } from "@/interfaces/services/DashboardService";
import { BaseService } from "./BaseService";

export const DashboardService = {
  getStats: async (): Promise<IDashboardResponse> => {
    return BaseService.get<IDashboardResponse>("/dados/resumo");
  },

  getQueimadas: async (limite: number = 100, dataInicio?: string, dataFim?: string) => {
    let url = `/dados/queimadas`;
    const params: string[] = [];
    
    if (dataInicio || dataFim) {
      if (dataInicio) params.push(`data_inicio=${dataInicio}`);
      if (dataFim) params.push(`data_fim=${dataFim}`);
    } else {
      params.push(`limite=${limite}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    return BaseService.get(url);
  },

  getDesmatamento: async (dataInicio?: string, dataFim?: string) => {
    let url = "/dados/desmatamento";
    const params: string[] = [];
    
    if (dataInicio) params.push(`data_inicio=${dataInicio}`);
    if (dataFim) params.push(`data_fim=${dataFim}`);
    
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    return BaseService.get(url);
  },

  getUnidadesConservacao: async () => {
    return BaseService.get("/dados/unidades-conservacao");
  },

  getTerrasIndigenas: async () => {
    return BaseService.get("/dados/terras-indigenas");
  },

  getQuilombolas: async () => {
    return BaseService.get("/dados/quilombolas");
  },

  getSicar: async (dataInicio?: string, dataFim?: string) => {
    let url = "/dados/sicar";
    const params: string[] = [];
    
    if (dataInicio) params.push(`data_inicio=${dataInicio}`);
    if (dataFim) params.push(`data_fim=${dataFim}`);
    
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    return BaseService.get(url);
  },

  getProdes: async (dataInicio?: string, dataFim?: string) => {
    let url = "/dados/prodes";
    if (dataInicio || dataFim) {
      url += "?";
      if (dataInicio) url += `data_inicio=${dataInicio}`;
      if (dataFim) url += (dataInicio ? "&" : "") + `data_fim=${dataFim}`;
    }
    return BaseService.get(url);
  },
};
