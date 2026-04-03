import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ModalFooter from "@/components/Modal/Footer";

interface Props {
  goToExecution: () => void;
}

export default function HistoryFooter({ goToExecution }: Props) {
  return (
    <ModalFooter
      right={
        <Button variant="primary" size="lg" onClick={goToExecution}>
          <Icon name="arrow-left" />
          Voltar
        </Button>
      }
    />
  );
}
