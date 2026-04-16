import { IDashboardResponse } from "@/interfaces/services/DashboardService";
import { BaseService } from "./BaseService";

export const DashboardService = {
  getStats: async (): Promise<IDashboardResponse> => {
    return BaseService.get<IDashboardResponse>("/dados/resumo");
  },

  getQueimadas: async (limite: number = 100) => {
    return BaseService.get(`/dados/queimadas?limite=${limite}`);
  },

  getDesmatamento: async () => {
    return BaseService.get("/dados/desmatamento");
  },

  getUnidadesConservacao: async () => {
    return BaseService.get("/dados/unidades-conservacao");
  },
};
