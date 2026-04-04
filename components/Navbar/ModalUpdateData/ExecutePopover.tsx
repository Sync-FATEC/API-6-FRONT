import Popover from "@/components/Popover";
import { PopoverItem } from "@/components/Popover/Item";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

interface Props {
  handleExecute: () => Promise<void>;
  goToSchedule: () => void;
  cooldown: number;
  isLoading: boolean;
}

export default function ExecutePopover({
  handleExecute,
  goToSchedule,
  cooldown,
  isLoading,
}: Props) {
  return (
    <Popover
      align="end"
      trigger={
        <Button variant="primary">
          <Icon name="play" size={20} />
          Executar Pipeline
          <div className="w-0.5 h-6 bg-white/20 mx-3" />
          <Icon name="chevron-down" size={24} />
        </Button>
      }
    >
      <div className="flex flex-col w-56">
        <PopoverItem
          onClick={handleExecute}
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
