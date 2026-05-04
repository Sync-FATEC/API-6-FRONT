import { IQueryResponse } from "@/interfaces/services/QueryService";
import { formatIntent } from "@/constants/chat";
import { DetailItem } from "./DetailItem";
import { GroupDetailCard } from "./GroupDetailCard";
import { RiskScoreSection } from "./RiskScore";

interface DetailsBodyProps {
  data: IQueryResponse;
}

export function DetailsBody({ data }: DetailsBodyProps) {
  const groups = data.grupos ?? [];
  const hasGroups = groups.length > 1;

  const detectedIntents =
    data.intencoes_detectadas && data.intencoes_detectadas.length > 0
      ? data.intencoes_detectadas.map((i) => formatIntent(i.intencao)).join(" + ")
      : formatIntent(data.intencao_detectada);

  const sourcesSet = new Set<string>();
  data.fontes?.forEach((source) => {
    const label = source.nome || source.identificador;
    if (label) sourcesSet.add(label);
  });

  groups.forEach((group) =>
    group.fontes?.forEach((source) => {
      const label = source.nome || source.identificador;
      if (label) sourcesSet.add(label);
    })
  );

  const sourcesLabel = sourcesSet.size > 0 ? Array.from(sourcesSet).join(" | ") : "Não informado";

  return (
    <div className="flex flex-col gap-8 py-2">
      <section className="gap-4 items-stretch">
        <div className="flex flex-col">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Geral</h4>

          <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 h-full">
            <DetailItem
              label={hasGroups ? "Intenções" : "Intenção"}
              tooltip="Tipo de pergunta que o sistema interpretou na mensagem."
              value={detectedIntents}
              colorValue="font-semibold"
            />
            <DetailItem label="Fonte(s)" value={sourcesLabel} />
            <DetailItem label="Ano" value={data.entidades?.periodo?.ano} />
            <DetailItem
              label="Consultas realizadas"
              value={hasGroups ? groups.length : undefined}
            />
            <DetailItem
              label="Tempo de processamento"
              tooltip="Tempo total que o sistema levou para processar a pergunta, incluindo pré-processamento, classificação de intenção e busca nas fontes."
              value={`${data.tempo_processamento_ms}ms`}
            />
          </div>
        </div>
      </section>

      {hasGroups && (
        <section className="flex flex-col gap-3 pt-8 border-t border-slate-200">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Consultas realizadas
          </h4>
          <p className="text-xs text-slate-500 -mt-1">
            Sua pergunta foi decomposta em {groups.length} consultas independentes. Abaixo os
            detalhes de cada uma.
          </p>
          <div className="grid gap-3">
            {groups.map((group, index) => (
              <GroupDetailCard key={`${group.rotulo}-${index}`} group={group} />
            ))}
          </div>
        </section>
      )}

      {data.nota_risco && data.nota_risco.nivel !== "sem_dados" && (
        <RiskScoreSection risk={data.nota_risco} />
      )}
    </div>
  );
}
