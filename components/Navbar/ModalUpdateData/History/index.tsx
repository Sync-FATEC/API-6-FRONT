"use client";

import { useState } from "react";
import { IAgendamentoResponse } from "@/interfaces/services/ScheduleService";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import Icon from "@/components/Icon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs";
import { usePipelineContext } from "../Context";
import { Button } from "@/components/Button";

function recurringLabel(s: IAgendamentoResponse): string {
  const unidades: Record<string, string> = {
    minuto: "minuto(s)",
    hora: "hora(s)",
    dia: "dia(s)",
    semana: "semana(s)",
    mes: "mês(es)",
  };

  const unidade = unidades[s.unidade] ?? s.unidade;
  const base = `A cada ${s.intervalo} ${unidade}`;

  if (s.unidade !== "minuto" && s.unidade !== "hora") {
    return `${base} às ${s.horario}`;
  }

  return base;
}

function tipoStatusFonte(status: string | undefined): "ok" | "erro" | "retrying" | "andamento" | "neutro" {
  const valor = (status ?? "").toUpperCase();
  if (!valor) return "neutro";
  if (valor.includes("RETRY")) return "retrying";
  if (valor.includes("ERRO") || valor.includes("FALHA")) return "erro";
  if (valor.includes("ANDAMENTO")) return "andamento";
  if (valor.startsWith("OK") || valor.includes("SUCESSO")) return "ok";
  return "neutro";
}

function classeStatusFonte(status: string | undefined): string {
  const tipo = tipoStatusFonte(status);
  if (tipo === "ok") return "bg-success-50 text-success";
  if (tipo === "retrying") return "bg-amber-50 text-amber-700";
  if (tipo === "erro") return "bg-danger-50 text-danger";
  if (tipo === "andamento") return "bg-sky-50 text-sky-700";
  return "bg-slate-100 text-slate-500";
}

function labelStatusFonte(status: string | undefined): string {
  const tipo = tipoStatusFonte(status);
  if (tipo === "ok") return "Sucesso";
  if (tipo === "retrying") return "Retry";
  if (tipo === "erro") return "Erro";
  if (tipo === "andamento") return "Em andamento";
  return status || "Pendente";
}

function formatarDataHora(dataIso: string | undefined): string {
  if (!dataIso) return "";
  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleString("pt-BR");
}

export default function HistoryBody() {
  const { pipeline } = usePipelineContext();

  const {
    isLoadingHistory: isLoading,
    historyData: data,
    schedulesData,
    isLoadingSchedules,
    cancelSchedule: onCancelSchedule,
    isCancelingSchedule,
  } = pipeline;

  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [detalhesAbertos, setDetalhesAbertos] = useState<Record<string, boolean>>({});

  const handleCancelSchedule = async (scheduleId: number) => {
    if (!onCancelSchedule) return;

    setCancelingId(scheduleId);

    try {
      await onCancelSchedule(scheduleId);
    } finally {
      setCancelingId(null);
    }
  };

  const toggleDetalhes = (key: string) => {
    setDetalhesAbertos((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Tabs defaultValue="agendamentos" className="flex flex-col gap-4">
      <TabsList>
        <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
        <TabsTrigger value="execucoes">Execuções</TabsTrigger>
      </TabsList>

      <div className="max-h-[52vh] overflow-y-auto pr-2 scrollbar-mini">
        <TabsContent value="agendamentos">
          {isLoadingSchedules ? (
            <p className="text-slate-500 text-sm py-2">Carregando agendamentos...</p>
          ) : !schedulesData || schedulesData.length === 0 ? (
            <p className="text-slate-500 text-sm">Nenhum agendamento cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {schedulesData.map((s) => (
                <li key={s.id} className="rounded-lg p-3 text-sm flex flex-col gap-2 bg-slate-50">
                  <div className="flex justify-between items-center font-semibold text-slate-700">
                    <span>{recurringLabel(s)}</span>

                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-sm text-xs",
                        s.ativo ? "bg-success-50 text-success" : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {s.ativo ? "Ativo" : "Cancelado"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex justify-between border-b border-slate-200 pb-1 mb-0.5">
                    <span>Criado em: {formatDate(s.criado_em)}</span>
                  </div>

                  {s.ultima_execucao_em ? (
                    <div className="text-xs text-slate-500 flex justify-between">
                      <span>Última execução: {formatDate(s.ultima_execucao_em)}</span>

                      {s.ultimo_status && (
                        <span
                          className={cn(
                            "font-medium",
                            s.ultimo_status === "sucesso" ? "text-success" : "text-danger"
                          )}
                        >
                          {s.ultimo_status}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Ainda não executado.</p>
                  )}

                  {s.ativo && (
                    <Button
                      className="inline-flex px-2 py-1 w-fit"
                      size="sm"
                      onClick={() => handleCancelSchedule(s.id)}
                      disabled={cancelingId === s.id || isCancelingSchedule}
                    >
                      {cancelingId === s.id ? (
                        "Cancelando..."
                      ) : (
                        <>
                          <Icon size={20} name="close" />
                          Cancelar
                        </>
                      )}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="execucoes">
          {isLoading ? (
            <p className="text-slate-500 text-sm py-2">Carregando histórico...</p>
          ) : !data || data.execucoes.length === 0 ? (
            <p className="text-slate-500 text-sm">Nenhum histórico foi encontrado.</p>
          ) : (
            <ul className="space-y-3">
              {data.execucoes.map((execution, index) => (
                <li key={index} className="rounded-lg p-3 text-sm flex flex-col gap-2 bg-slate-50">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-slate-700">{execution.pipeline}</span>

                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-sm text-xs",
                        execution.sucesso
                          ? "bg-success-50 text-success"
                          : "bg-danger-50 text-danger"
                      )}
                    >
                      {execution.sucesso ? "Sucesso" : "Falha"}
                    </span>
                  </div>

                  <div className="text-slate-500 text-xs flex justify-between border-b border-slate-200 pb-2 mb-1">
                    <span>Início: {formatDate(execution.inicio)}</span>

                    <span>
                      Duração: {Math.floor((execution.duracao_total || execution.duracao_total_segundos || 0) / 60)} min{" "}
                      {Math.round((execution.duracao_total || execution.duracao_total_segundos || 0) % 60)} s
                    </span>
                  </div>

                  {execution.etapas.length > 0 && (
                    <div className="text-xs text-slate-500">
                      <span className="font-medium text-slate-600">Etapas: </span>

                      {execution.etapas.map((stage) => stage.etapa).join(" -> ")}
                    </div>
                  )}

                  {execution.fontes && execution.fontes.length > 0 && (
                    <div className="text-xs text-slate-500 space-y-2">
                      <p className="font-medium text-slate-600">Status por base:</p>
                      <ul className="space-y-1">
                        {execution.fontes.map((fonte) => {
                          const fonteKey = `${execution.inicio}-${fonte.fonte}`;
                          const detalhesVisiveis = Boolean(detalhesAbertos[fonteKey]);

                          return (
                            <li key={fonteKey} className="rounded bg-white px-2 py-1 border border-slate-200">
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-slate-700">{fonte.fonte}</span>
                                <span className={cn("px-2 py-0.5 rounded-sm", classeStatusFonte(fonte.status))}>
                                  {labelStatusFonte(fonte.status)}
                                </span>
                                <span className="text-slate-500">
                                  {fonte.tentativas ?? 1}/{fonte.max_tentativas ?? fonte.tentativas ?? 1} tent.
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleDetalhes(fonteKey)}
                                className="mt-1 text-xs font-medium text-primary hover:underline"
                              >
                                {detalhesVisiveis ? "Ocultar detalhes técnicos" : "Ver detalhes técnicos"}
                              </button>

                              {detalhesVisiveis && (
                                <div className="mt-2 rounded border border-slate-200 bg-slate-50 p-2 space-y-2 text-xs text-slate-600">
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
                                          <li key={`${fonteKey}-${tentativa.tentativa}-${tentativa.timestamp ?? "sem-data"}`} className="rounded border border-slate-200 bg-white px-2 py-1">
                                            T{tentativa.tentativa} - {tentativa.status}
                                            {typeof tentativa.duracao_segundos === "number" && ` - ${tentativa.duracao_segundos.toFixed(1)}s`}
                                            {tentativa.timestamp && ` - ${formatarDataHora(tentativa.timestamp)}`}
                                            {tentativa.erro && (
                                              <div className="text-danger mt-0.5">{tentativa.erro}!</div>
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
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}
