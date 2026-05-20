import Icon from "@/components/Icon";
import ModalFooter from "@/components/Modal/Footer";
import { usePipelineContext } from "../Context";
import { Button } from "@/components/Button";

export default function ScheduleFooter() {
  const { goToExecution, pipeline } = usePipelineContext();
  const { isScheduling, isScheduleSuccess } = pipeline;

  return (
    <ModalFooter
      right={
        <>
          <Button variant="soft" onClick={goToExecution}>
            <Icon name="arrow-left" />
            Voltar
          </Button>
          {!isScheduleSuccess && (
            <Button form="schedule-form" type="submit" disabled={isScheduling}>
              Agendar
              <Icon name="check" />
            </Button>
          )}
        </>
      }
    />
  );
}
