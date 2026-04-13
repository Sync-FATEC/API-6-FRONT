"use client";
import Select from "@/components/Inputs/Select";
import { GEO_ENTITIES, PIPELINE_STAGES } from "@/constants/common";
import GeoEntitiesTable from "./EntitiesTable";
import { usePipelineContext } from "../Context";
import LogTerminal from "@/components/LogTerminal";
import { formatDateParts } from "@/utils/date";
import Tooltip from "@/components/Tooltip";

export default function ExecutionBody() {
  const { stage, setStage, selectedEntities, setSelectedEntities, pipeline, isTerminalOpen, logs } =
    usePipelineContext();

  const { pipelineStatus } = pipeline;

  const formattedDate = formatDateParts(pipelineStatus?.inicio_execucao);

  const stageName =
    PIPELINE_STAGES.find((s) => s.value === pipelineStatus?.etapa_atual)?.label ||
    pipelineStatus?.etapa_atual;

  const renderEntities = () => {
    const entidades = pipelineStatus?.entidades_atuais;

    if (!entidades || entidades.length === 0) return "Nenhuma";

    const REVERSE_MAP: Record<string, string> = {
      unidades_conservacao: "mma/icmbio",
      terras_indigenas: "funai",
      desmatamentos: "inpe/deter",
      queimadas: "inpe/queimadas",
      quilombos: "fundação_cultural_palmares",
      sicar: "sicar_-_sp_area_imovel",
    };

    const labels = entidades.map((key) => {
      const frontendKey = REVERSE_MAP[key] || key;
      const entity = GEO_ENTITIES.find((e) => e.key === frontendKey || e.key === key);
      return entity ? entity.label : key;
    });

    const uniqueLabels = Array.from(new Set(labels));

    if (uniqueLabels.length <= 2) {
      return uniqueLabels.join(", ");
    }

    const visibleLabels = uniqueLabels.slice(0, 2).join(", ");
    const remainingCount = uniqueLabels.length - 2;

    const tooltipContent = (
      <ul className="text-left">
        {uniqueLabels.map((label, idx) => (
          <li key={idx}>{label}</li>
        ))}
      </ul>
    );

    return (
      <Tooltip content={tooltipContent} side="top">
        <span className="flex items-center gap-2">
          <span>{visibleLabels}</span>
          <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
            +{remainingCount}
          </span>
        </span>
      </Tooltip>
    );
  };

  return (
    <div className="text-slate-600 space-y-6">
      {isTerminalOpen ? (
        <div className="space-y-3">
          <p className="font-medium text-slate-700">Acompanhe os logs do pipeline atual:</p>

          {pipelineStatus?.rodando && (
            <div className="bg-slate-50 shadow-inner rounded-md p-3 text-sm flex gap-8 font-medium">
              <p>
                <span className="font-semibold text-slate-700">Etapa:</span> {stageName}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Início:</span>{" "}
                {formattedDate ? (
                  <>
                    <span>{formattedDate.date}</span>{" "}
                    <span className="text-slate-400">{formattedDate.time}</span>
                  </>
                ) : (
                  "-"
                )}
              </p>
              <p className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Entidades:</span> {renderEntities()}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p>
          Escolha as entidades e etapa que você quer rodar e depois clique no botão{" "}
          <span className="text-slate-700 font-semibold">Executar Pipeline</span> para iniciar um
          processo de Pipeline ETL no servidor.
        </p>
      )}

      {isTerminalOpen ? (
        <LogTerminal logs={logs} />
      ) : (
        <>
          <GeoEntitiesTable
            status={pipelineStatus}
            selectedEntities={selectedEntities}
            setSelectedEntities={setSelectedEntities}
          />

          <Select
            label="Etapa do Pipeline"
            options={PIPELINE_STAGES}
            value={stage}
            onChange={setStage}
            className="w-1/3"
          />
        </>
      )}
    </div>
  );
}
