import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePipeline } from "./usePipeline";
import { useQueryClient } from "@tanstack/react-query";
import { useLogStream } from "@/components/LogTerminal/useLogTerminal";

export type ModalView = "execution" | "history" | "schedule";

interface PipelineContextData {
  currentView: ModalView;
  setCurrentView: (view: ModalView) => void;
  goToExecution: () => void;
  goToHistory: () => void;
  goToSchedule: () => void;

  stage: string;
  setStage: (stage: string) => void;

  selectedEntities: string[];
  setSelectedEntities: (entities: string[]) => void;

  pipeline: ReturnType<typeof usePipeline>;

  isTerminalOpen: boolean;
  isStreamFinished: boolean;
  closeTerminal: () => void;
  logs: string[];
}

const PipelineContext = createContext<PipelineContextData | undefined>(undefined);

export function PipelineProvider({ children, open }: { children: ReactNode; open: boolean }) {
  const queryClient = useQueryClient();
  const [currentView, setCurrentView] = useState<ModalView>("execution");
  const [stage, setStage] = useState("full");
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);

  const pipeline = usePipeline(currentView);

  const { isLoading, pipelineStatus } = pipeline;

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    if (isLoading || pipelineStatus?.rodando) {
      setIsTerminalOpen(true);
    } else if (!pipelineStatus?.rodando) {
      setIsTerminalOpen(false);
    }
  }, [isLoading, pipelineStatus?.rodando]);

  const logs = useLogStream(isTerminalOpen);

  const isStreamFinished =
    logs.length > 0 &&
    (logs[logs.length - 1].includes("Pipeline finalizado") ||
      logs[logs.length - 1].includes("Stream não iniciado") ||
      logs[logs.length - 1].includes("[ERRO]"));

  const closeTerminal = () => {
    setIsTerminalOpen(false);
    pipeline.resetState();
    queryClient.invalidateQueries({ queryKey: ["pipelineStatus"] });
    queryClient.invalidateQueries({ queryKey: ["historyData"] });
  };

  useEffect(() => {
    if (open) {
      setCurrentView("execution");
      pipeline.resetState();
      setStage("full");
      setSelectedEntities([]);
      if (pipelineStatus?.rodando) {
        setIsTerminalOpen(true);
      } else {
        setIsTerminalOpen(false);
      }
      queryClient.invalidateQueries({ queryKey: ["pipelineStatus"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const goToExecution = () => {
    pipeline.resetState();
    setCurrentView("execution");
  };

  const goToHistory = () => {
    pipeline.resetState();
    setCurrentView("history");
  };

  const goToSchedule = () => {
    pipeline.resetState();
    setCurrentView("schedule");
  };

  return (
    <PipelineContext.Provider
      value={{
        currentView,
        setCurrentView,
        goToExecution,
        goToHistory,
        goToSchedule,
        stage,
        setStage,
        selectedEntities,
        setSelectedEntities,
        pipeline,
        isTerminalOpen,
        isStreamFinished,
        closeTerminal,
        logs,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipelineContext() {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error("usePipelineContext deve ser usado dentro de um PipelineProvider");
  }
  return context;
}
