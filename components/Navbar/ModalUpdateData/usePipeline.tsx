import { useState, useEffect, useRef } from "react";
import { IPipelineHistoryResponse } from "@/interfaces/services/PipelineService";
import { IAgendamentoResponse } from "@/interfaces/services/ScheduleService";
import { toast } from "@/lib/toast";
import { PipelineService } from "@/services/PipelineService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScheduleService } from "@/services/ScheduleService";

export function usePipeline(currentView: "execution" | "history" | "schedule" = "execution") {
  const queryClient = useQueryClient();

  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  const executeMutation = useMutation({
    mutationFn: (stage: string = "full") => PipelineService.execute(stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historyData"] });
      toast.success("Pipeline iniciado", "A execução do pipeline começou com sucesso.");
    },
    onError: () => {
      toast.error("Erro na execução", "Ocorreu um problema inesperado ao iniciar o pipeline.");
    },
  });

  const handleExecutePipeline = async (stage: string = "full") => {
    await executeMutation.mutateAsync(stage);
    setCooldown(10);
  };

  const historyQuery = useQuery({
    queryKey: ["historyData"],
    queryFn: () => PipelineService.history(),
    enabled: currentView === "history",
    select: (data: IPipelineHistoryResponse) => ({
      ...data,
      execucoes: data.execucoes.filter((execution) => execution.etapas.length > 0),
    }),
  });

  const schedulesQuery = useQuery<IAgendamentoResponse[]>({
    queryKey: ["schedulesData"],
    queryFn: () => ScheduleService.list(),
    enabled: currentView === "history",
  });

  type SchedulePayload = {
    date: string;
    time: string;
    interval: number;
    unit: "minuto" | "hora" | "dia" | "semana" | "mes";
  };

  const scheduleMutation = useMutation({
    mutationFn: (payload: SchedulePayload) =>
      ScheduleService.scheduleUpdate({
        data_inicio: payload.date,
        horario: payload.time,
        intervalo: payload.interval,
        unidade: payload.unit,
      }),
    onSuccess: () => {
      toast.success("Agendamento criado", "A atualização foi agendada com sucesso.");
    },
    onError: () => {
      toast.error(
        "Erro no agendamento",
        "Ocorreu um problema inesperado ao agendar a atualização."
      );
    },
  });

  const handleSchedulePipeline = async (payload: SchedulePayload) => {
    await scheduleMutation.mutateAsync(payload);
  };

  const cancelScheduleMutation = useMutation({
    mutationFn: (scheduleId: number) => ScheduleService.cancelarComRecorrencias(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedulesData"] });
      toast.success("Agendamento cancelado", "O agendamento foi cancelado com sucesso.");
    },
    onError: () => {
      toast.error(
        "Erro ao cancelar",
        "Ocorreu um problema inesperado ao cancelar o agendamento."
      );
    },
  });

  const handleCancelSchedule = async (scheduleId: number) => {
    await cancelScheduleMutation.mutateAsync(scheduleId);
  };

  return {
    executePipeline: handleExecutePipeline,
    cooldown,
    isLoading: executeMutation.isPending,
    error: executeMutation.error instanceof Error ? executeMutation.error.message : null,
    data: executeMutation.data,

    schedulePipeline: handleSchedulePipeline,
    isScheduling: scheduleMutation.isPending,
    isScheduleSuccess: scheduleMutation.isSuccess,

    cancelSchedule: handleCancelSchedule,
    isCancelingSchedule: cancelScheduleMutation.isPending,

    resetState: () => {
      executeMutation.reset();
      scheduleMutation.reset();
      cancelScheduleMutation.reset();
    },
    historyData: historyQuery.data,
    isLoadingHistory: historyQuery.isFetching,
    schedulesData: schedulesQuery.data,
    isLoadingSchedules: schedulesQuery.isFetching,
  };
}
