import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ModalFooter from "@/components/Modal/Footer";
import ExecutePopover from "../ExecutePopover";

interface Props {
  goToHistory: () => void;
  goToSchedule: () => void;
  handleExecute: () => Promise<void>;
  cooldown: number;
  isLoading: boolean;
}

export default function ExecutionFooter({
  goToHistory,
  goToSchedule,
  handleExecute,
  cooldown,
  isLoading,
}: Props) {
  return (
    <ModalFooter
      left={
        <Button variant="secondary" size="lg" onClick={goToHistory}>
          <Icon name="clock" />
          Ver histórico
        </Button>
      }
      right={
        <ExecutePopover
          handleExecute={handleExecute}
          cooldown={cooldown}
          isLoading={isLoading}
          goToSchedule={goToSchedule}
        />
      }
    />
  );
}
