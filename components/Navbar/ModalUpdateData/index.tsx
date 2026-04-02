import { useState, useEffect } from "react";
import { BaseModalProps } from "@/interfaces/components/modal";
import { usePipeline } from "./usePipeline";
import Modal from "@/components/Modal";
import ExecutionBody from "./Bodies/Execution";
import HistoryBody from "./Bodies/History";
import ModalUpdateDataFooter from "./Footer";

export default function ModalUpdateData({ open, onOpenChange }: BaseModalProps) {
  const [currentView, setCurrentView] = useState<"execution" | "history">("execution");

  const { executePipeline, isLoading, error, data, resetState, historyData, isLoadingHistory } =
    usePipeline(currentView);

  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        setCurrentView("execution");
        resetState();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [open, resetState]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={currentView === "execution" ? "Atualizar banco de dados" : "Histórico de execuções"}
      footer={
        <ModalUpdateDataFooter
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoading={isLoading}
          isStarted={data?.status === "iniciado"}
          handleExecute={async () => {
            await executePipeline("full");
          }}
          onClose={() => onOpenChange(false)}
          resetState={resetState}
        />
      }
    >
      {currentView === "execution" ? (
        <ExecutionBody isLoading={isLoading} error={error} data={data} />
      ) : (
        <HistoryBody isLoading={isLoadingHistory} data={historyData} />
      )}
    </Modal>
  );
}
