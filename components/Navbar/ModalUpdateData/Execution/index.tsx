"use client";
import Select from "@/components/Inputs/Select";
import { GEO_ENTITIES, PIPELINE_STAGES } from "@/constants/common";
import GeoEntitiesTable from "./EntitiesTable";
import { usePipelineContext } from "../Context";
import LogTerminal from "@/components/LogTerminal";
import { formatDateParts } from "@/utils/date";
import Tooltip from "@/components/Tooltip";
import { useState } from "react";
import {
  IPipelineSourceStatus,
  IPipelineStatusEvent,
} from "@/interfaces/services/PipelineService";

function tipoStatusFonte(status: string | undefined): "ok" | "erro" | "retrying" | "andamento" | "neutro" {
  const valor = (status ?? "").toUpperCase();
  if (!valor) return "neutro";
  if (valor.includes("RETRY")) return "retrying";
  if (valor.includes("ERRO") || valor.includes("FALHA")) return "erro";
  if (valor.includes("ANDAMENTO")) return "andamento";
  if (valor.startsWith("OK") || valor.includes("SUCESSO")) return "ok";
  return "neutro";
}

function labelStatusFonte(fonte: IPipelineSourceStatus): string {
  const tipo = tipoStatusFonte(fonte.status);
  if (tipo === "ok") return "Sucesso";
  if (tipo === "retrying") return "Tentando novamente";
  if (tipo === "erro") return "Erro definitivo";
  if (tipo === "andamento") return "Em andamento";
  return fonte.status || "Pendente";
}

function classeStatusFonte(fonte: IPipelineSourceStatus): string {
  const tipo = tipoStatusFonte(fonte.status);
  if (tipo === "ok") return "bg-success-50 text-success";
  if (tipo === "retrying") return "bg-amber-50 text-amber-700";
  if (tipo === "erro") return "bg-danger-50 text-danger";
  if (tipo === "andamento") return "bg-sky-50 text-sky-700";
  return "bg-slate-100 text-slate-600";
}

function classeStatusExecucao(status: string | undefined): string {
  if (status === "sucesso") return "bg-success/5 text-green-700";
  if (status === "falha") return "bg-red-50 border border-red-200 text-red-700";
  return "bg-sky-50 text-sky-700";
}

function labelStatusExecucao(status: string | undefined): string {
  if (status === "sucesso") return "Concluído com sucesso";
  if (status === "falha") return "Falha definitiva";
  return "Em andamento";
}

function formatarHoraEvento(evento: IPipelineStatusEvent): string {
  if (!evento.timestamp) return "";
  const data = new Date(evento.timestamp);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatarDataHora(dataIso: string | undefined): string {
  if (!dataIso) return "";
  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleString("pt-BR");
}

export default function ExecutionBody() {
  const {
    stage,
    setStage,
    selectedEntities,
    setSelectedEntities,
    pipeline,
    isTerminalOpen,
    logs,
  } = usePipelineContext();

  const {
    pipelineStatus,
    isLoading,
    error,
    data,
    executionId,
    executionStatusData: statusData,
    isLoadingStatus,
    statusError,
  } = pipeline;

  const [detalhesAbertos, setDetalhesAbertos] = useState<Record<string, boolean>>({});

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

  const fontes = statusData?.fontes ?? [];
  const eventos = statusData?.eventos ?? [];
  const eventosRetry = (statusData?.eventos ?? [])
    .filter((evento) => {
      const tipo = (evento.tipo ?? "").toLowerCase();
      return tipo.includes("retry") || tipo.includes("tentativa_falha") || tipo.includes("falha_definitiva");
    })
    .slice(-8)
    .reverse();

  const fontesComErroDefinitivo = fontes.filter((fonte) => tipoStatusFonte(fonte.status) === "erro");

  const toggleDetalhes = (fonte: string) => {
    setDetalhesAbertos((prev) => ({ ...prev, [fonte]: !prev[fonte] }));
  };

  const obterUltimoRetryDaFonte = (fonte: string): IPipelineStatusEvent | undefined => {
    for (let i = eventos.length - 1; i >= 0; i -= 1) {
      const evento = eventos[i];
      const tipo = (evento.tipo ?? "").toLowerCase();
      if (evento.fonte === fonte && tipo.includes("retry")) {
        return evento;
      }
    }
    return undefined;
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

      {isLoading && (
        <div className="p-3 rounded-md bg-sky-50 text-sky-700 text-sm">
          Solicitando execução do pipeline...
        </div>
      )}

      {error && (
        <div className="p-3 rounded-md bg-danger-50 text-danger text-sm">
          {error}
        </div>
      )}

      {data?.status === "iniciado" && !statusData && (
        <div className="p-3 bg-success/5 rounded-md text-green-700 text-sm">
          <strong>Pipeline iniciado com sucesso.</strong>
          {executionId && (
            <>
              <br />
              ID da execução: <span className="font-medium">{executionId}</span>
            </>
          )}
        </div>
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

      {statusData && (
        <div className={`p-3 rounded-md text-sm ${classeStatusExecucao(statusData.status_execucao)}`}>
          <strong>{labelStatusExecucao(statusData.status_execucao)}</strong>
          {statusData.mensagem && (
            <>
              <br />
              {statusData.mensagem}
            </>
          )}
          {statusData.status_execucao === "falha" && fontesComErroDefinitivo.length > 0 && (
            <>
              <br />
              {fontesComErroDefinitivo.length} base(s) com erro definitivo.
            </>
          )}
        </div>
      )}

      {statusError && executionId && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
          Falha ao consultar status em tempo real: {statusError}
        </div>
      )}

      {executionId && !statusData && !statusError && (
        <div className="p-3 rounded-md bg-slate-50 text-slate-600 text-sm">
          Aguardando primeiros eventos de execução...
        </div>
      )}

      {fontes.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Status por base de dados</p>
          <ul className="space-y-2">
            {fontes.map((fonte) => {
              const tentativaAtual = fonte.tentativa_atual ?? fonte.tentativas ?? 1;
              const maxTentativas = fonte.max_tentativas ?? fonte.tentativas ?? tentativaAtual;
              const ultimoRetry = obterUltimoRetryDaFonte(fonte.fonte);
              const fonteKey = fonte.fonte;
              const detalhesVisiveis = Boolean(detalhesAbertos[fonteKey]);

              return (
                <li key={fonte.fonte} className="rounded-md border border-slate-200 bg-white p-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{fonte.fonte}</span>
                    <span className={`px-2 py-0.5 rounded-sm text-xs ${classeStatusFonte(fonte)}`}>
                      {labelStatusFonte(fonte)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>Registros: {fonte.registros ?? 0}</span>
                    <span>
                      Tentativa atual: {tentativaAtual}/{maxTentativas}
                    </span>
                    <span>
                      Tentativas: {fonte.tentativas ?? tentativaAtual}/{maxTentativas}
                    </span>
                    {typeof fonte.duracao_segundos === "number" && (
                      <span>Duração: {fonte.duracao_segundos.toFixed(1)}s</span>
                    )}
                  </div>

                  {tipoStatusFonte(fonte.status) === "retrying" && (
                    <p className="mt-2 text-xs text-amber-700">
                      {typeof ultimoRetry?.aguardar_segundos === "number"
                        ? `Tentativa ${tentativaAtual}/${maxTentativas} falhou. Nova tentativa automática em ${ultimoRetry.aguardar_segundos}s.`
                        : `Tentativa ${tentativaAtual}/${maxTentativas} falhou. O sistema está tentando novamente automaticamente.`}
                    </p>
                  )}

                  {fonte.mensagem && (
                    <p className="mt-2 text-xs text-slate-600">{fonte.mensagem}</p>
                  )}

                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => toggleDetalhes(fonteKey)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {detalhesVisiveis ? "Ocultar detalhes técnicos" : "Ver detalhes técnicos"}
                    </button>
                  </div>

                  {detalhesVisiveis && (
                    <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600 space-y-2">
                      <p>
                        <span className="font-medium text-slate-700">Status bruto:</span> {fonte.status}
                      </p>

                      {fonte.erro && (
                        <p>
                          <span className="font-medium text-slate-700">Erro:</span> {fonte.erro}
                        </p>
                      )}

                      {fonte.mensagem_final && (
                        <p>
                          <span className="font-medium text-slate-700">Mensagem final:</span> {fonte.mensagem_final}
                        </p>
                      )}

                      {fonte.historico_tentativas && fonte.historico_tentativas.length > 0 && (
                        <div className="space-y-1">
                          <p className="font-medium text-slate-700">Histórico de tentativas:</p>
                          <ul className="space-y-1">
                            {fonte.historico_tentativas.map((tentativa) => (
                              <li key={`${fonte.fonte}-${tentativa.tentativa}-${tentativa.timestamp ?? "sem-data"}`} className="rounded border border-slate-200 bg-white px-2 py-1">
                                T{tentativa.tentativa} - {tentativa.status}
                                {typeof tentativa.duracao_segundos === "number" && ` - ${tentativa.duracao_segundos.toFixed(1)}s`}
                                {tentativa.timestamp && ` - ${formatarDataHora(tentativa.timestamp)}`}
                                {tentativa.erro && (
                                  <div className="text-danger mt-0.5">{tentativa.erro}</div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {eventosRetry.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Tentativas automáticas (retry)</p>
          <ul className="space-y-1">
            {eventosRetry.map((evento, index) => (
              <li key={`${evento.timestamp}-${index}`} className="text-xs text-slate-600 bg-slate-50 rounded p-2">
                <span className="font-medium text-slate-700">{evento.fonte ?? "Sistema"}</span>
                {formatarHoraEvento(evento) && (
                  <span className="text-slate-500"> - {formatarHoraEvento(evento)}</span>
                )}
                <div>{evento.mensagem}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {executionId && isLoadingStatus && !statusData?.finalizado && (
        <p className="text-xs text-slate-500">Atualizando status da execução...</p>
      )}
    </div>
  );
}
