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

  const handleCancelSchedule = async (scheduleId: number) => {
    if (!onCancelSchedule) return;

    setCancelingId(scheduleId);

    try {
      await onCancelSchedule(scheduleId);
    } finally {
      setCancelingId(null);
    }
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
                      Duração: {Math.floor((execution.duracao_total || 0) / 60)} min{" "}
                      {Math.round((execution.duracao_total || 0) % 60)} s
                    </span>
                  </div>

                  {execution.etapas.length > 0 && (
                    <div className="text-xs text-slate-500">
                      <span className="font-medium text-slate-600">Etapas: </span>

                      {execution.etapas.map((stage) => stage.etapa).join(" -> ")}
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
