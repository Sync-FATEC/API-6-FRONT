import { useState } from "react";
import Modal from "@/components/Modal";
import { INotaRisco, IQueryResponse, RiscoNivel } from "@/interfaces/services/QueryService";
import { cn } from "@/utils/className";
import TooltipLabel from "@/components/Tooltip/TooltipLabel";
import { Button } from "@/components/Button";

const RISCO_CONFIG: Record<RiscoNivel, { label: string; color: string; bar: string; badge: string }> = {
  sem_dados: { label: "Sem dados", color: "text-slate-400",  bar: "bg-slate-300",   badge: "bg-slate-100 text-slate-500" },
  baixo:     { label: "Baixo",     color: "text-emerald-600", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  moderado:  { label: "Moderado",  color: "text-yellow-600",  bar: "bg-yellow-400",  badge: "bg-yellow-50 text-yellow-700" },
  alto:      { label: "Alto",      color: "text-orange-600",  bar: "bg-orange-500",  badge: "bg-orange-50 text-orange-700" },
  critico:   { label: "Crítico",   color: "text-red-600",     bar: "bg-red-500",     badge: "bg-red-50 text-red-700" },
};

const DIMENSAO_LABEL: Record<string, string> = {
  queimadas:            "Queimadas",
  desmatamento:         "Desmatamento",
  terras_indigenas:     "Terras Indígenas",
  unidades_conservacao: "Unid. Conservação",
  quilombolas:          "Quilombolas",
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

          {/* Por dimensão */}
          {Object.keys(risco.por_dimensao).length > 0 && (
            <div className="flex flex-col gap-2">
              {Object.entries(risco.por_dimensao).map(([dim, pts]) => {
                const maxPts: Record<string, number> = {
                  queimadas: 40, desmatamento: 40,
                  terras_indigenas: 10, unidades_conservacao: 5, quilombolas: 5,
                };
                const max = maxPts[dim] ?? 40;
                const pctDim = Math.round((pts / max) * 100);
                return (
                  <div key={dim} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 w-36 shrink-0">{DIMENSAO_LABEL[dim] ?? dim}</span>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", cfg.bar)}
                        style={{ width: `${pctDim}%` }}
                      />
                    </div>
                    <span className="text-slate-600 font-mono w-6 text-right">{pts}</span>
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
    </section>
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

function TokenList({ label, items, tooltip }: { label: string; items: string[]; tooltip: string }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <TooltipLabel label={label} tip={tooltip} className="text-sm text-slate-500 font-medium" />

      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-sm font-mono"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DetailsModal({ data }: Props) {
  const [open, setOpen] = useState(false);

  if (data.intencao_detectada?.includes("fora_do_escopo")) return null;

  const sourcesLabel =
    data.fontes?.map((s) => s.nome || s.identificador).join(" | ") || "Não informada";

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
                  label="Intenção"
                  tooltip="Tipo de pergunta que o sistema interpretou na mensagem."
                  value={data.intencao_detectada}
                  colorValue="font-semibold"
                />
                <DetailItem label="Fonte(s)" value={sourcesLabel} />
                <DetailItem label="Ano" value={data.entidades?.periodo?.ano} />
                <DetailItem
                  label="Tempo de processamento"
                  tooltip="Tempo total que o sistema levou para processar a pergunta, incluindo pré-processamento, classificação de intenção e busca nas fontes."
                  value={`${data.tempo_processamento_ms}ms`}
                />
              </div>
            </div>

            {data.confianca && (
              <div className="flex flex-col">
                <TooltipLabel
                  label="Confiança"
                  tip="Probabilidade do sistema de IA ter acertado a intenção da pergunta."
                  className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2"
                />

                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center h-full">
                  <span
                    className={cn(
                      "text-5xl font-bold tabular-nums",
                      data.confianca >= 0.9 ? "text-emerald-600" : "text-amber-500"
                    )}
                  >
                    {(data.confianca * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </section>

          {data.nota_risco && data.nota_risco.nivel !== "sem_dados" && (
            <NotaRiscoSection risco={data.nota_risco} />
          )}

          {data.preprocessamento && (
            <section className="flex flex-col gap-4 pt-8 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                PLN & Pré-processamento
              </h4>
              <div className="grid gap-4">
                <div className="flex flex-col gap-1.5">
                  <TooltipLabel
                    label="Texto Limpo"
                    tip="Texto após o pré-processamento: minúsculas, remoção de stopwords e limpeza de caracteres."
                    className="text-sm text-slate-500 font-medium"
                  />
                  <div className="p-3 bg-slate-50 text-slate-600 rounded-lg font-mono ">
                    {data.preprocessamento.texto_limpo}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <TokenList
                    label="Tokens Originais"
                    tooltip="Palavras da pergunta após a separação inicial do texto."
                    items={data.preprocessamento.tokens_originais}
                  />

                  <TokenList
                    label="Lemmas"
                    tooltip="Forma base das palavras após a lematização."
                    items={data.preprocessamento.lemmas}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </Modal>
    </>
  );
}
