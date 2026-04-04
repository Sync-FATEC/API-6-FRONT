import { useState, useEffect } from "react";
import { BaseModalProps } from "@/interfaces/components/modal";
import { usePipeline } from "./usePipeline";

import Modal from "@/components/Modal";

import ExecutionBody from "./Execution";
import HistoryBody from "./History";
import ScheduleBody from "./Schedule";

import ExecutionFooter from "./Execution/Footer";
import HistoryFooter from "./History/Footer";
import ScheduleFooter from "./Schedule/Footer";

export type ModalView = "execution" | "history" | "schedule";

export default function ModalUpdateData({ open, onOpenChange }: BaseModalProps) {
  const [currentView, setCurrentView] = useState<ModalView>("execution");

  const {
    executePipeline,
    isLoading,
    cooldown,
    error,
    data,
    resetState,
    historyData,
    isLoadingHistory,
    schedulePipeline,
    isScheduling,
    isScheduleSuccess,
  } = usePipeline(currentView);

  useEffect(() => {
    if (open) {
      setCurrentView("execution");
      resetState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);


  const goToExecution = () => {
    resetState();
    setCurrentView("execution");
  };

  const goToHistory = () => {
    resetState();
    setCurrentView("history");
  };

  const goToSchedule = () => {
    resetState();
    setCurrentView("schedule");
  };

  const titles: Record<ModalView, string> = {
    execution: "Atualizar banco de dados",
    history: "Histórico de execuções",
    schedule: "Criar agendamento",
  };

  const bodies: Record<ModalView, React.ReactNode> = {
    execution: <ExecutionBody isLoading={isLoading} error={error} data={data} />,
    history: <HistoryBody isLoading={isLoadingHistory} data={historyData} />,
    schedule: (
      <ScheduleBody
        schedulePipeline={schedulePipeline}
        isScheduling={isScheduling}
        isSuccess={isScheduleSuccess}
      />
    ),
  };

  const footers: Record<ModalView, React.ReactNode> = {
    execution: (
      <ExecutionFooter
        goToHistory={goToHistory}
        goToSchedule={goToSchedule}
        handleExecute={() => executePipeline("full")}
        cooldown={cooldown}
        isLoading={isLoading}
      />
    ),

    history: <HistoryFooter goToExecution={goToExecution} />,

    schedule: (
      <ScheduleFooter
        goToExecution={goToExecution}
        isScheduling={isScheduling}
        isScheduleSuccess={isScheduleSuccess}
      />
    ),
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={titles[currentView]}
      footer={footers[currentView]}
    >
      {bodies[currentView]}
    </Modal>
  );
}