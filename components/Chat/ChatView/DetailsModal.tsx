import { useState } from "react";
import Modal from "@/components/Modal";
import {
  IAhpInfo,
  IGrupoResposta,
  INotaRisco,
  IQueryResponse,
  RiscoNivel,
} from "@/interfaces/services/QueryService";
import { cn } from "@/utils/className";
import TooltipLabel from "@/components/Tooltip/TooltipLabel";
import { Button } from "@/components/Button";

const RISCO_CONFIG: Record<RiscoNivel, { label: string; color: string; bar: string; badge: string }> = {
  sem_dados: { label: "Sem dados", color: "text-slate-400",  bar: "bg-slate-300",   badge: "bg-slate-100 text-slate-500" },
  baixo:     { label: "Baixo",     color: "text-emerald-600", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  moderado:  { label: "Moderado",  color: "text-yellow-600",  bar: "bg-yellow-400",  badge: "bg-yellow-50 text-yellow-700" },
  elevado:   { label: "Elevado",   color: "text-amber-600",   bar: "bg-amber-500",   badge: "bg-amber-50 text-amber-700" },
  alto:      { label: "Alto",      color: "text-orange-600",  bar: "bg-orange-500",  badge: "bg-orange-50 text-orange-700" },
  critico:   { label: "Crítico",   color: "text-red-600",     bar: "bg-red-500",     badge: "bg-red-50 text-red-700" },
};

const DIMENSAO_LABEL: Record<string, string> = {
  queimadas:             "Queimadas",
  desmatamento_deter:    "Desmatamento DETER",
  desmatamento_prodes:   "Desmatamento PRODES",
  terras_indigenas:      "Terras Indígenas",
  unidades_conservacao:  "Unid. Conservação",
  quilombolas:           "Quilombolas",
  contexto_municipal:    "Contexto Municipal",
  // Compatibilidade com versão antiga
  desmatamento:          "Desmatamento",
  territorios_sensiveis: "Territórios Sensíveis",
};

function NotaRiscoSection({ risco }: { risco: INotaRisco }) {
  const cfg = RISCO_CONFIG[risco.nivel] ?? RISCO_CONFIG.sem_dados;
  const pct = Math.min(risco.nota, 100);

  return (
    <section className="flex flex-col gap-4 pt-8 border-t border-slate-200">
      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
        Risco Socioambiental
      </h4>

      <div className="grid grid-cols-[1fr_140px] gap-4 items-stretch">
        <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-4">
          {/* Barra de progresso */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-500 font-medium">Nota geral</span>
              <span className={cn("text-xs font-semibold", cfg.color)}>{cfg.label}</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", cfg.bar)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Por dimensão: usa peso AHP como teto de cada eixo */}
          {Object.keys(risco.por_dimensao).length > 0 && (
            <div className="flex flex-col gap-2">
              {Object.entries(risco.por_dimensao).map(([dim, pts]) => {
                const pesoPct = risco.metodo_ahp?.pesos_percentual?.[dim];
                const max = pesoPct ?? 40;
                const pctDim = max > 0 ? Math.round((pts / max) * 100) : 0;
                return (
                  <div key={dim} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 w-36 shrink-0 flex items-center gap-1">
                      {DIMENSAO_LABEL[dim] ?? dim}
                      {pesoPct != null && (
                        <span className="text-[10px] text-slate-400">({pesoPct}%)</span>
                      )}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", cfg.bar)}
                        style={{ width: `${Math.min(pctDim, 100)}%` }}
                      />
                    </div>
                    <span className="text-slate-600 font-mono w-14 text-right">
                      {pts}/{max.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Fatores */}
          {risco.fatores.length > 0 && (
            <div className="flex flex-col gap-1 pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-medium mb-1">Fatores identificados</span>
              {risco.fatores.map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <span className="mt-0.5 shrink-0">•</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nota em destaque */}
        <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center gap-1">
          <span className={cn("text-5xl font-bold tabular-nums", cfg.color)}>
            {risco.nota}
          </span>
          <span className="text-xs text-slate-400 font-medium">de 100</span>
        </div>
      </div>

      {risco.metodo_ahp && <MetodoAhpSection ahp={risco.metodo_ahp} />}
    </section>
  );
}

function MetodoAhpSection({ ahp }: { ahp: IAhpInfo }) {
  const [aberto, setAberto] = useState(false);
  const cr = ahp.consistencia.cr;
  const consistente = ahp.consistencia.consistente;

  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        className="w-full px-4 py-3 flex items-center justify-between gap-2 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Como foi calculado
          </span>
          <span className="text-xs text-slate-700 font-semibold">{ahp.metodo}</span>
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
              consistente
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            )}
            title={`Razão de Consistência: ${cr} (exige CR < 0.10)`}
          >
            {consistente ? `CR ${cr} ✓` : `CR ${cr} ✗`}
          </span>
        </div>
        <span className="text-xs text-slate-400">{aberto ? "▲" : "▼"}</span>
      </button>

      {aberto && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-slate-100">
          <p className="text-xs text-slate-600 leading-relaxed pt-3">
            O <strong>{ahp.metodo}</strong> deriva os pesos dos critérios a partir
            de uma matriz de comparação par a par na <strong>{ahp.escala}</strong>.
            Os pesos são calculados via autovetor principal e validados pela
            Razão de Consistência (CR &lt; 0.10).
          </p>

          <div className="bg-slate-50 rounded-lg p-3 flex flex-col gap-2">
            <h6 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pesos derivados do AHP
            </h6>
            {Object.entries(ahp.pesos_percentual)
              .sort((a, b) => b[1] - a[1])
              .map(([dim, pct]) => (
                <div key={dim} className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600 w-40 shrink-0">
                    {DIMENSAO_LABEL[dim] ?? dim}
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-slate-700 font-mono w-12 text-right font-semibold">
                    {pct}%
                  </span>
                </div>
              ))}
          </div>

          <div className="bg-slate-50 rounded-lg p-3 flex flex-col gap-1.5">
            <h6 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Consistência da matriz
            </h6>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-400">λmax</span>
                <div className="font-mono text-slate-700">
                  {ahp.consistencia.lambda_max}
                </div>
              </div>
              <div>
                <span className="text-slate-400">CI</span>
                <div className="font-mono text-slate-700">{ahp.consistencia.ci}</div>
              </div>
              <div>
                <span className="text-slate-400">CR</span>
                <div
                  className={cn(
                    "font-mono font-semibold",
                    consistente ? "text-emerald-600" : "text-red-600"
                  )}
                >
                  {ahp.consistencia.cr}
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic leading-relaxed">
            {ahp.justificativa}
          </p>
        </div>
      )}
    </div>
  );
}

interface Props {
  data: IQueryResponse;
}

function DetailItem({
  label,
  value,
  tooltip,
  colorValue,
}: {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  tooltip?: string;
  colorValue?: string;
}) {
  if (!value) return null;

  return (
    <div className="flex justify-between items-center gap-4 text-sm">
      {tooltip ? (
        <TooltipLabel label={label} tip={tooltip} className="text-sm text-slate-500 font-medium" />
      ) : (
        <span className="text-slate-500 font-medium flex items-center gap-1.5">{label}</span>
      )}

      <span className={cn("text-slate-700 text-right", colorValue)}>{value}</span>
    </div>
  );
}


const INTENCAO_LABEL: Record<string, string> = {
  consultar_queimadas: "Queimadas",
  consultar_desmatamento: "Desmatamento",
  consultar_terra_indigena: "Terras Indígenas",
  consultar_unidade_conservacao: "Unidades de Conservação",
  consultar_quilombola: "Quilombolas",
  consultar_prodes: "Desmatamento PRODES",
  consultar_imovel_rural: "Imóvel rural (CAR)",
  resumo_municipal: "Resumo municipal",
};

function formatarIntencao(intencao?: string | null): string {
  if (!intencao) return "—";
  return INTENCAO_LABEL[intencao] ?? intencao;
}

function GrupoDetailCard({ grupo }: { grupo: IGrupoResposta }) {
  const nivel = (grupo.nota_risco?.nivel ?? "sem_dados") as RiscoNivel;
  const cfg = RISCO_CONFIG[nivel] ?? RISCO_CONFIG.sem_dados;
  const nota = grupo.nota_risco?.nota ?? 0;
  const fontes =
    grupo.fontes && grupo.fontes.length > 0
      ? grupo.fontes.map((f) => f.nome || f.identificador).join(" | ")
      : "—";

  return (
    <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-700">
            {grupo.rotulo || "—"}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {formatarIntencao(grupo.filtros?.intencao)}
            {grupo.filtros?.municipio && ` · ${grupo.filtros.municipio}`}
            {grupo.filtros?.cod_imovel && ` · ${grupo.filtros.cod_imovel}`}
          </div>
        </div>
        {grupo.nota_risco && nivel !== "sem_dados" ? (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap",
              cfg.badge,
            )}
          >
            {cfg.label} · {nota}/100
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-200 text-slate-500">
            sem dados
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-slate-400">Registros</div>
          <div className="text-slate-700 font-semibold tabular-nums">
            {grupo.total_resultados}
          </div>
        </div>
        <div>
          <div className="text-slate-400">Fontes</div>
          <div className="text-slate-700 leading-snug">{fontes}</div>
        </div>
      </div>

      {grupo.resumo && (
        <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-2">
          {grupo.resumo}
        </p>
      )}

      {grupo.nota_risco?.fatores && grupo.nota_risco.fatores.length > 0 && (
        <ul className="text-[11px] text-slate-500 list-disc pl-4 space-y-0.5 border-t border-slate-200 pt-2">
          {grupo.nota_risco.fatores.slice(0, 4).map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function DetailsModal({ data }: Props) {
  const [open, setOpen] = useState(false);

  if (data.intencao_detectada?.includes("fora_do_escopo")) return null;

  const grupos = data.grupos ?? [];
  const temGrupos = grupos.length > 1;

  // Intenção: em multi-consulta mostra a lista das detectadas.
  const intencoes =
    data.intencoes_detectadas && data.intencoes_detectadas.length > 0
      ? data.intencoes_detectadas.map((i) => formatarIntencao(i.intencao)).join(" + ")
      : formatarIntencao(data.intencao_detectada);

  // Fontes: quando tem grupos, une as fontes de todos + do CAR (se presente).
  const fontesSet = new Set<string>();
  data.fontes?.forEach((f) => {
    const label = f.nome || f.identificador;
    if (label) fontesSet.add(label);
  });
  grupos.forEach((g) =>
    g.fontes?.forEach((f) => {
      const label = f.nome || f.identificador;
      if (label) fontesSet.add(label);
    }),
  );
  const sourcesLabel =
    fontesSet.size > 0 ? Array.from(fontesSet).join(" | ") : "Não informada";

  const risco = data.nota_risco;
  const riscoCfg = risco ? (RISCO_CONFIG[risco.nivel] ?? RISCO_CONFIG.sem_dados) : null;

  return (
    <>
      {risco && risco.nivel !== "sem_dados" && riscoCfg && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer select-none",
            riscoCfg.badge
          )}
          onClick={() => setOpen(true)}
          title="Ver detalhes do risco socioambiental"
        >
          <span>Risco {riscoCfg.label}</span>
          <span className="font-bold">{risco.nota}/100</span>
        </div>
      )}

      <Button variant="plain" size="sm" className="bg-slate-50 mt-2 text-xs text-slate-500 font-medium" onClick={() => setOpen(true)}>
        Mais informações
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Detalhes do Processamento"
        footer={
          <Button onClick={() => setOpen(false)}>
            Fechar
          </Button>
        }
      >
        <div className="flex flex-col gap-8 py-2">
          <section className="grid grid-cols-[1fr_160px] gap-4 items-stretch">
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                Geral
              </h4>

              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 h-full">
                <DetailItem
                  label={temGrupos ? "Intenções" : "Intenção"}
                  tooltip="Tipo de pergunta que o sistema interpretou na mensagem."
                  value={intencoes}
                  colorValue="font-semibold"
                />
                <DetailItem label="Fonte(s)" value={sourcesLabel} />
                <DetailItem label="Ano" value={data.entidades?.periodo?.ano} />
                <DetailItem
                  label="Consultas realizadas"
                  value={temGrupos ? grupos.length : undefined}
                />
                <DetailItem
                  label="Tempo de processamento"
                  tooltip="Tempo total que o sistema levou para processar a pergunta, incluindo pré-processamento, classificação de intenção e busca nas fontes."
                  value={`${data.tempo_processamento_ms}ms`}
                />
              </div>
            </div>
          </section>

          {temGrupos && (
            <section className="flex flex-col gap-3 pt-8 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Consultas realizadas
              </h4>
              <p className="text-xs text-slate-500 -mt-1">
                Sua pergunta foi decomposta em {grupos.length} consultas independentes.
                Abaixo os detalhes de cada uma.
              </p>
              <div className="grid gap-3">
                {grupos.map((g, idx) => (
                  <GrupoDetailCard key={`${g.rotulo}-${idx}`} grupo={g} />
                ))}
              </div>
            </section>
          )}

          {data.nota_risco && data.nota_risco.nivel !== "sem_dados" && (
            <NotaRiscoSection risco={data.nota_risco} />
          )}
        </div>
      </Modal>
    </>
  );
}
