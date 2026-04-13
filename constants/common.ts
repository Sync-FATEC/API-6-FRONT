export const GEO_ENTITIES = [
  {
    key: "inpe/queimadas",
    label: "Queimadas",
    source: "INPE",
  },
  {
    key: "inpe/deter",
    label: "Desmatamento",
    source: "INPE/DETER",
  },
  {
    key: "inpe/prodes",
    label: "Alerta de Desmatamento",
    source: "INPE/PRODES",
  },
  {
    key: "funai",
    label: "Terra Indígena",
    source: "FUNAI",
  },
  {
    key: "mma/icmbio",
    label: "Unidade de Conservação",
    source: "ICMBIO",
  },
  {
    key: "fundação_cultural_palmares",
    label: "Quilombos",
    source: "Fundação Palmares",
  },
  {
    key: "sicar_-_sp_area_imovel",
    label: "Imóveis Rurais",
    source: "SICAR",
  },
] as const;

export const PIPELINE_STAGES = [
  { label: "Extração", value: "extract" },
  { label: "Carga", value: "load" },
  { label: "Vetorização", value: "embed" },
  { label: "Validação", value: "validate" },
  { label: "Tudo", value: "full" },
] as const;
