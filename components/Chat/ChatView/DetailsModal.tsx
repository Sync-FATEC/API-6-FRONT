import { useState } from "react";
import Modal from "@/components/Modal";
import { IQueryResponse } from "@/interfaces/services/QueryService";
import { cn } from "@/utils/className";
import TooltipLabel from "@/components/Tooltip/TooltipLabel";
import { Button } from "@/components/Button";

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

  return (
    <>
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
          </section>

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
