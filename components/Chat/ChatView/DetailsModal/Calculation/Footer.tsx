import { Button } from "@/components/Button";
import ModalFooter from "@/components/Modal/Footer";

interface Props {
  onBack: () => void;
}

export function CalculationFooter({ onBack }: Props) {
  return (
    <ModalFooter
      right={<Button onClick={onBack}>Voltar</Button>}
    />
  );
}