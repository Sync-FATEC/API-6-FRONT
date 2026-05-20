import Icon from "@/components/Icon";
import ModalFooter from "@/components/Modal/Footer";
import { usePipelineContext } from "../Context";
import { Button } from "@/components/Button";

export default function HistoryFooter() {
  const { goToExecution } = usePipelineContext();

  return (
    <ModalFooter
      right={
        <Button onClick={goToExecution}>
          <Icon name="arrow-left" />
          Voltar
        </Button>
      }
    />
  );
}
