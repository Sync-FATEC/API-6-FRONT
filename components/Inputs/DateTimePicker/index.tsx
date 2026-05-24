import { useState } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/utils/className";
import Popover from "@/components/Popover";
import { WheelColumn } from "./WheelColumn";
import { useDateTimePicker } from "./useDateTimePicker";
import InputWrapper from "../InputWrapper";
import { baseInputClasses } from "@/constants/styles/input";

interface Props {
  includeTime?: boolean;
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  wrapperClassName?: string;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  id?: string;
}

export default function DateTimePicker({
  includeTime = false,
  value,
  onChange,
  className,
  wrapperClassName,
  minDate,
  maxDate,
  label,
  id,
}: Props) {
  const [open, setOpen] = useState(false);

  const currentDate = value || new Date();

  const { state, actions, lists, validators } = useDateTimePicker({
    value: currentDate,
    minDate,
    maxDate,
    onChange: onChange || (() => {}),
  });

  const formattedDay = state.day.toString().padStart(2, "0");
  const formattedMonthNumber = state.month.toString().padStart(2, "0");
  const formattedHour = state.hour.toString().padStart(2, "0");
  const formattedMinute = state.minute.toString().padStart(2, "0");

  const triggerButton = (
    <button type="button" id={id} className={cn(baseInputClasses, "cursor-pointer", className)}>
      <Icon name="calendar" size={20} className="text-slate-400 me-1" />
      <div className="flex items-center gap-2 text-slate-700">
        <span>{formattedDay}</span>
        <span className="text-slate-300">/</span>
        <span>{formattedMonthNumber}</span>
        <span className="text-slate-300">/</span>
        <span>{state.year}</span>
        {includeTime && (
          <>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <span>
              {formattedHour} : {formattedMinute}
            </span>
          </>
        )}
      </div>
    </button>
  );

  const content = (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={triggerButton}
      align="start"
      sideOffset={8}
      contentClassName="p-2"
    >
      <div className="flex items-center gap-1">
        <WheelColumn
          isOpen={open}
          currentValue={state.day}
          options={lists.daysList}
          onChangeSegment={actions.setDay}
          isOptionDisabled={validators.isDayDisabled}
        />
        <WheelColumn
          isOpen={open}
          currentValue={state.month}
          options={lists.monthsList}
          onChangeSegment={actions.setMonth}
          isMonth
          isOptionDisabled={validators.isMonthDisabled}
        />
        <WheelColumn
          isOpen={open}
          currentValue={state.year}
          options={lists.yearsList}
          onChangeSegment={actions.setYear}
          padLength={4}
        />

        {includeTime && (
          <>
            <div className="w-px h-40 bg-slate-100 mx-2" />
            <WheelColumn
              isOpen={open}
              currentValue={state.hour}
              options={lists.hoursList}
              onChangeSegment={actions.setHour}
              isOptionDisabled={validators.isHourDisabled}
            />
            <span className="text-slate-300 font-bold mx-1">:</span>
            <WheelColumn
              isOpen={open}
              currentValue={state.minute}
              options={lists.minutesList}
              onChangeSegment={actions.setMinute}
              isOptionDisabled={validators.isMinuteDisabled}
            />
          </>
        )}
      </div>
    </Popover>
  );

  if (label) {
    return (
      <InputWrapper label={label} id={id} className={wrapperClassName}>
        {content}
      </InputWrapper>
    );
  }

  return content;
}
