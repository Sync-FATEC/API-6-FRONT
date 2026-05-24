export interface IApiConversation {
  id: number;
  titulo: string;
  criado_em: string;
  atualizado_em: string;
}

export interface IHistoricoResponse {
  conversas: IApiConversation[];
}

export interface IDadosSistema {
  geojson: Record<string, unknown> | null;
  estatisticas: Record<string, unknown> | null;
  nota_risco: number | null;
  grupos: string[] | null;
  fontes: string[] | null;
}

export interface IMensagemHistorico {
  id: number;
  papel: string;
  conteudo_texto: string;
  intencao_detectada: string | null;
  entidades_json: Record<string, unknown> | null;
  tem_dados_geo: boolean;
  criado_em: string;
  dados: IDadosSistema | null;
}

export interface IConversaDetalhadaResponse extends IApiConversation {
  mensagens: IMensagemHistorico[];
}