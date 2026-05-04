import { RiscoNivel } from "@/interfaces/services/QueryService";

export const RISK_CONFIG: Record<
  RiscoNivel,
  { label: string; color: string; bar: string; badge: string }
> = {
  sem_dados: {
    label: "Sem dados",
    color: "text-slate-400",
    bar: "bg-slate-300",
    badge: "bg-slate-100 text-slate-500",
  },
  baixo: {
    label: "Baixo",
    color: "text-asg-great",
    bar: "bg-asg-great",
    badge: "bg-asg-great/5 text-asg-great",
  },
  moderado: {
    label: "Moderado",
    color: "text-asg-okay",
    bar: "bg-asg-okay",
    badge: "bg-asg-okay/5 text-asg-okay",
  },
  elevado: {
    label: "Elevado",
    color: "text-asg-okay",
    bar: "bg-asg-okay",
    badge: "bg-asg-okay/5 text-asg-okay",
  },
  alto: {
    label: "Alto",
    color: "text-asg-bad",
    bar: "bg-asg-bad",
    badge: "bg-asg-bad/5 text-asg-bad",
  },
  critico: {
    label: "Crítico",
    color: "text-asg-terrible",
    bar: "bg-asg-terrible",
    badge: "bg-asg-terrible/5 text-asg-terrible",
  },
};

export const DIMENSION_LABEL: Record<string, string> = {
  queimadas: "Queimadas",
  desmatamento_deter: "Desmatamento DETER",
  desmatamento_prodes: "Desmatamento PRODES",
  terras_indigenas: "Terras Indígenas",
  unidades_conservacao: "Unid. Conservação",
  terras_quilombolas: "Terras Quilombolas",
  contexto_municipal: "Contexto Municipal",
  desmatamento: "Desmatamento",
  territorios_sensiveis: "Territórios Sensíveis",
};

export const INTENT_LABEL: Record<string, string> = {
  consultar_queimadas: "Queimadas",
  consultar_desmatamento: "Desmatamento",
  consultar_terra_indigena: "Terras Indígenas",
  consultar_unidade_conservacao: "Unidades de Conservação",
  consultar_quilombola: "Quilombolas",
  consultar_prodes: "Desmatamento PRODES",
  consultar_imovel_rural: "Imóvel rural (CAR)",
  resumo_municipal: "Resumo municipal",
};

export function formatIntent(intent?: string | null): string {
  if (!intent) return "—";
  return INTENT_LABEL[intent] ?? intent;
}
