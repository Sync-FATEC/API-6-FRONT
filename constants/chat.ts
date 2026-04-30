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
    color: "text-emerald-600",
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
  },
  moderado: {
    label: "Moderado",
    color: "text-orang-600",
    bar: "bg-yellow-400",
    badge: "bg-yellow-50 text-yellow-700",
  },
  elevado: {
    label: "Elevado",
    color: "text-amber-600",
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
  },
  alto: {
    label: "Alto",
    color: "text-orange-600",
    bar: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700",
  },
  critico: {
    label: "Crítico",
    color: "text-red-600",
    bar: "bg-red-500",
    badge: "bg-red-50 text-red-700",
  },
};

export const DIMENSION_LABEL: Record<string, string> = {
  queimadas: "Queimadas",
  desmatamento_deter: "Desmatamento DETER",
  desmatamento_prodes: "Desmatamento PRODES",
  terras_indigenas: "Terras Indígenas",
  unidades_conservacao: "Unid. Conservação",
  quilombolas: "Quilombolas",
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