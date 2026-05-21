export interface IHistoricoItem {
  id: number;
  titulo: string;
  criado_em: string;
  atualizado_em: string;
}

export type IHistoricoResponse = IHistoricoItem[] | { conversas: IHistoricoItem[] };
