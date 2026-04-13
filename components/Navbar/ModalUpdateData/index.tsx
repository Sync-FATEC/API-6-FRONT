import { BaseModalProps } from "@/interfaces/components/modal";
import Modal from "@/components/Modal";

import ExecutionBody from "./Execution";
import HistoryBody from "./History";
import ScheduleBody from "./Schedule";

import ExecutionFooter from "./Execution/Footer";
import HistoryFooter from "./History/Footer";
import ScheduleFooter from "./Schedule/Footer";
import { PipelineProvider, usePipelineContext } from "./Context";

function ModalContent({ open, onOpenChange }: BaseModalProps) {
  const { currentView } = usePipelineContext();

  const titles = {
    execution: "Atualizar banco de dados",
    history: "Histórico de execuções",
    schedule: "Criar agendamento",
  };

  const bodies = {
    execution: <ExecutionBody />,
    history: <HistoryBody />,
    schedule: <ScheduleBody />,
  };

  const footers = {
    execution: <ExecutionFooter />,
    history: <HistoryFooter />,
    schedule: <ScheduleFooter />,
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

// Exportação principal que injeta o Provider
export default function ModalUpdateData(props: BaseModalProps) {
  return (
    <PipelineProvider open={props.open}>
      <ModalContent {...props} />
    </PipelineProvider>
  );
}
