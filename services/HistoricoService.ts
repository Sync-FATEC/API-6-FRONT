import { IHistoricoItem, IHistoricoResponse } from "@/interfaces/services/HistoricoService";
import { BaseService } from "./BaseService";

function normalizar(data: IHistoricoResponse): IHistoricoItem[] {
  if (Array.isArray(data)) return data;
  return data.conversas ?? [];
}

export const HistoricoService = {
  listar: async (token: string): Promise<IHistoricoItem[]> => {
    const data = await BaseService.getWithAuth<IHistoricoResponse>("/historico", token);
    return normalizar(data);
  },
};
