import Popover from "@/components/Popover";
import { PopoverItem } from "@/components/Popover/Item";
import Icon from "@/components/Icon";
import { usePipelineContext } from "./Context";
import { Button } from "@/components/Button";

export default function ExecutePopover() {
  const { goToSchedule, stage, selectedEntities, pipeline } = usePipelineContext();
  const { executePipeline, cooldown, isLoading } = pipeline;

  return (
    <Popover
      align="end"
      trigger={
        <Button>
          Executar Pipeline
          <Icon name="chevron-down" size={24} />
        </Button>
      }
    >
      <div className="flex flex-col w-56">
        <PopoverItem
          onClick={() => executePipeline(stage, selectedEntities)}
          disabled={isLoading || cooldown > 0}
          className="justify-between"
        >
          <div className="flex items-center gap-2">
            <Icon name="play" size={18} />
            Executar agora
          </div>

          {cooldown > 0 && (
            <div className="flex items-center gap-1 text-slate-400 font-medium ml-4">
              <Icon name="clock" size={14} />
              <span>{cooldown}s</span>
            </div>
          )}
        </PopoverItem>

        <PopoverItem onClick={goToSchedule}>
          <div className="flex items-center gap-2">
            <Icon name="calendar-plus" size={18} />
            Criar agendamento
          </div>
        </PopoverItem>
      </div>
    </Popover>
  );
}
