import { IPipelineHistoryResponse } from "@/interfaces/services/PipelineService";
import { PipelineService } from "@/services/PipelineService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePipeline(currentView: "execution" | "history" = "execution") {
  const queryClient = useQueryClient();

  const executeMutation = useMutation({
    mutationFn: (stage: string = "full") => PipelineService.execute(stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historyData"] });
    },
  });

  const historyQuery = useQuery({
    queryKey: ["historyData"],
    queryFn: () => PipelineService.history(),
    enabled: currentView === "history",
    select: (data: IPipelineHistoryResponse) => ({
      ...data,
      execucoes: data.execucoes.filter((execution) => execution.etapas.length > 0),
    }),
  });

  return {
    executePipeline: executeMutation.mutateAsync,
    isLoading: executeMutation.isPending,
    error: executeMutation.error instanceof Error ? executeMutation.error.message : null,
    data: executeMutation.data,
    resetState: executeMutation.reset,
    historyData: historyQuery.data,
    isLoadingHistory: historyQuery.isFetching,
  };
}
