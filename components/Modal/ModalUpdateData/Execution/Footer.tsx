import Icon from "@/components/Icon";
import ModalFooter from "@/components/Modal/Footer";
import ExecutePopover from "../ExecutePopover";
import { usePipelineContext } from "../Context";
import { Button } from "@/components/Button";

export default function ExecutionFooter() {
  const { goToHistory, isTerminalOpen, isStreamFinished, closeTerminal, pipeline } =
    usePipelineContext();

  return (
    <ModalFooter
      left={
        <Button variant="soft" onClick={goToHistory}>
          <Icon name="clock" />
          Ver histórico
        </Button>
      }
      right={
        isTerminalOpen ? (
          isStreamFinished ? (
            <Button variant="solid" onClick={closeTerminal}>
              <Icon name="arrow-left" />
              Voltar
            </Button>
          ) : (
            <Button
              variant="solid"
              color="danger"
              onClick={() => pipeline.cancelExecution()}
              isLoading={pipeline.isCancelingExecution}
            >
              <Icon name="trash" />
              Cancelar execução
            </Button>
          )
        ) : (
          <ExecutePopover />
        )
      }
    />
  );
}
