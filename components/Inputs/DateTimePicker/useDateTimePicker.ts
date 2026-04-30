import { useMemo, useCallback } from "react";

interface Props {
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date) => void;
}

export function useDateTimePicker({ value, minDate, maxDate, onChange }: Props) {
  const day = value.getDate();
  const month = value.getMonth() + 1;
  const year = value.getFullYear();
  const hour = value.getHours();
  const minute = (Math.round(value.getMinutes() / 5) * 5) % 60;

  const getDaysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();

  const yearsList = useMemo(() => {
    const minVal = minDate ? minDate.getFullYear() : year - 10;
    const maxVal = maxDate ? maxDate.getFullYear() : year + 10;
    return Array.from({ length: Math.max(0, maxVal - minVal + 1) }, (_, i) => minVal + i);
  }, [minDate, maxDate, year]);

  const monthsList = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysList = useMemo(
    () => Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 1),
    [month, year]
  );
  const hoursList = Array.from({ length: 24 }, (_, i) => i);
  const minutesList = Array.from({ length: 12 }, (_, i) => i * 5);

  const isMonthDisabled = useCallback(
    (m: number) => {
      if (minDate && year === minDate.getFullYear() && m < minDate.getMonth() + 1) return true;
      if (maxDate && year === maxDate.getFullYear() && m > maxDate.getMonth() + 1) return true;
      return false;
    },
    [minDate, maxDate, year]
  );

  const isDayDisabled = useCallback(
    (d: number) => {
      if (
        minDate &&
        year === minDate.getFullYear() &&
        month === minDate.getMonth() + 1 &&
        d < minDate.getDate()
      )
        return true;
      if (
        maxDate &&
        year === maxDate.getFullYear() &&
        month === maxDate.getMonth() + 1 &&
        d > maxDate.getDate()
      )
        return true;
      return false;
    },
    [minDate, maxDate, year, month]
  );

  const isHourDisabled = useCallback(
    (h: number) => {
      if (
        minDate &&
        year === minDate.getFullYear() &&
        month === minDate.getMonth() + 1 &&
        day === minDate.getDate() &&
        h < minDate.getHours()
      )
        return true;
      if (
        maxDate &&
        year === maxDate.getFullYear() &&
        month === maxDate.getMonth() + 1 &&
        day === maxDate.getDate() &&
        h > maxDate.getHours()
      )
        return true;
      return false;
    },
    [minDate, maxDate, year, month, day]
  );

  const isMinuteDisabled = useCallback(
    (min: number) => {
      if (
        minDate &&
        year === minDate.getFullYear() &&
        month === minDate.getMonth() + 1 &&
        day === minDate.getDate() &&
        hour === minDate.getHours() &&
        min < minDate.getMinutes()
      )
        return true;
      if (
        maxDate &&
        year === maxDate.getFullYear() &&
        month === maxDate.getMonth() + 1 &&
        day === maxDate.getDate() &&
        hour === maxDate.getHours() &&
        min > maxDate.getMinutes()
      )
        return true;
      return false;
    },
    [minDate, maxDate, year, month, day, hour]
  );

  const handleSetDay = useCallback(
    (newDay: number) => {
      onChange(new Date(year, month - 1, newDay, hour, minute));
    },
    [year, month, hour, minute, onChange]
  );

  const handleSetMonth = useCallback(
    (newMonth: number) => {
      const maxDays = getDaysInMonth(newMonth, year);
      const cappedDay = Math.min(day, maxDays);
      onChange(new Date(year, newMonth - 1, cappedDay, hour, minute));
    },
    [year, day, hour, minute, onChange]
  );

  const handleSetYear = useCallback(
    (newYear: number) => {
      const maxDays = getDaysInMonth(month, newYear);
      const cappedDay = Math.min(day, maxDays);
      onChange(new Date(newYear, month - 1, cappedDay, hour, minute));
    },
    [month, day, hour, minute, onChange]
  );

  const handleSetHour = useCallback(
    (newHour: number) => {
      onChange(new Date(year, month - 1, day, newHour, minute));
    },
    [year, month, day, minute, onChange]
  );

  const handleSetMinute = useCallback(
    (newMinute: number) => {
      onChange(new Date(year, month - 1, day, hour, newMinute));
    },
    [year, month, day, hour, onChange]
  );

  return {
    state: { day, month, year, hour, minute },
    actions: {
      setDay: handleSetDay,
      setMonth: handleSetMonth,
      setYear: handleSetYear,
      setHour: handleSetHour,
      setMinute: handleSetMinute,
    },
    lists: { daysList, monthsList, yearsList, hoursList, minutesList },
    validators: { isMonthDisabled, isDayDisabled, isHourDisabled, isMinuteDisabled },
  };
}
