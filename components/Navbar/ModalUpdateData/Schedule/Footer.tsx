import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ModalFooter from "@/components/Modal/Footer";

interface Props {
  goToExecution: () => void;
  isScheduling: boolean;
  isScheduleSuccess?: boolean;
}

export default function ScheduleFooter({ goToExecution, isScheduling, isScheduleSuccess }: Props) {
  return (
    <ModalFooter
      right={
        <>
          <Button variant="secondary" onClick={goToExecution}>
            <Icon name="arrow-left" />
            Voltar
          </Button>
          {!isScheduleSuccess && (
            <Button
              form="schedule-form"
              type="submit"
              variant="primary"
              disabled={isScheduling}
            >
              Agendar
              <Icon name="check" />
            </Button>
          )}
        </>
      }
    />
  );
}
