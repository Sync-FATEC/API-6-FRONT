"use client";
import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import DateTimePicker from "@/components/Inputs/DateTimePicker";
import Select from "@/components/Inputs/Select";
import Input, { InputPattern } from "@/components/Inputs/Text";
import { usePipelineContext } from "../Context";

export default function ScheduleBody() {
  const { pipeline } = usePipelineContext();
  const { schedulePipeline, isScheduleSuccess: isSuccess } = pipeline;

  const [dateTime, setDateTime] = useState<Date | undefined>();
  const [interval, setInterval] = useState<number | "">("");
  const [unit, setUnit] = useState<"minuto" | "hora" | "dia" | "semana" | "mes" | "">("");

  const { minDate, maxDate } = useMemo(() => {
    const now = new Date();
    const min = now;
    const max = new Date(now.getFullYear(), 11, 31, 23, 59);

    return { minDate: min, maxDate: max };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateTime || interval === "" || unit === "") return;

    const date = dateTime.toISOString().split("T")[0];
    const time = dateTime.toTimeString().slice(0, 5);

    await schedulePipeline({
      date,
      time,
      interval: interval as number,
      unit: unit as "minuto" | "hora" | "dia" | "semana" | "mes",
    });
  };

  const unitLabel = unit === "mes" ? "mês" : unit;
  const unitLabelPlural = unit === "mes" ? "meses" : `${unit}s`;

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="bg-green-50 text-success rounded-lg p-3">
          <Icon name="check" size={28} />
        </div>

        <p className="text-lg font-semibold text-slate-700">Atualização agendada com sucesso!</p>

        {dateTime && (
          <p className="text-slate-500">
            Agendamento configurado para executar{" "}
            <span className="font-medium text-slate-700">
              a cada {interval} {interval === 1 ? unitLabel : unitLabelPlural}
            </span>{" "}
            a partir de{" "}
            <span className="font-medium text-slate-700">
              {dateTime.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            .
          </p>
        )}
      </div>
    );
  }

  const unitOptions = [
    { label: "Minuto", value: "minuto" },
    { label: "Hora", value: "hora" },
    { label: "Dia", value: "dia" },
    { label: "Semana", value: "semana" },
    { label: "Mês", value: "mes" },
  ];

  return (
    <form id="schedule-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
      <p className="text-slate-500">
        Selecione a data, o horário e a recorrência para agendar as próximas atualizações da base de
        dados.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="schedule-interval"
          label="Intervalo"
          type="text"
          inputMode="numeric"
          allowPattern={InputPattern.OnlyNumbers}
          maxLength={5}
          value={interval}
          placeholder="Número"
          onChange={(e) => setInterval(e.target.value === "" ? "" : Number(e.target.value))}
          required
        />

        <Select
          id="schedule-unit"
          label="Unidade"
          options={unitOptions}
          value={unit}
          placeholder="Selecione um"
          onChange={(val) => setUnit(val as "minuto" | "hora" | "dia" | "semana" | "mes")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DateTimePicker
          id="schedule-datetime"
          label="A partir de"
          value={dateTime}
          onChange={setDateTime}
          includeTime
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    </form>
  );
}
