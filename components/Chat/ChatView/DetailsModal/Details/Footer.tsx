import { Button } from "@/components/Button";
import ModalFooter from "@/components/Modal/Footer";

interface Props {
  hasAHP: boolean;
  onViewCalculation: () => void;
  onClose: () => void;
}

export function DetailsFooter({ hasAHP, onViewCalculation, onClose }: Props) {
  return (
    <ModalFooter
      left={
        hasAHP ? (
          <Button variant="soft" onClick={onViewCalculation}>
            Como o cálculo foi feito?
          </Button>
        ) : null
      }
      right={<Button onClick={onClose}>Fechar</Button>}
    />
  );
}