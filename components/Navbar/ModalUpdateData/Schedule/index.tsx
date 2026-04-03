import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import DateTimePicker from "@/components/Inputs/DateTimePicker";

interface Props {
  schedulePipeline: (payload: { date: string; time: string }) => Promise<void>;
  isScheduling: boolean;
  isSuccess: boolean;
}

export default function ScheduleBody({ schedulePipeline, isSuccess }: Props) {
  const [dateTime, setDateTime] = useState<Date | undefined>();


  const { minDate, maxDate } = useMemo(() => {
    const now = new Date();

    const min = now;
    const max = new Date(now.getFullYear(), 11, 31, 23, 59);

    return { minDate: min, maxDate: max };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateTime) return;

    const date = dateTime.toISOString().split("T")[0];
    const time = dateTime.toTimeString().slice(0, 5);

    await schedulePipeline({ date, time });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="bg-green-100 text-success rounded-lg p-3">
          <Icon name="check" size={28} />
        </div>

        <p className="text-base font-semibold text-slate-700">Atualização agendada com sucesso!</p>

        {dateTime && (
          <p className="text-sm text-slate-500">
            A base de dados será atualizada em{" "}
            <span className="font-medium text-slate-700">{dateTime.toLocaleString("pt-BR")}</span>.
          </p>
        )}
      </div>
    );
  }

  return (
    <form id="schedule-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
      <p className="text-slate-500">
        Selecione a data e o horário para a próxima atualização da base de dados.
      </p>

      <DateTimePicker
        value={dateTime}
        onChange={setDateTime}
        includeTime
        minDate={minDate}
        maxDate={maxDate}
      />
    </form>
  );
}
