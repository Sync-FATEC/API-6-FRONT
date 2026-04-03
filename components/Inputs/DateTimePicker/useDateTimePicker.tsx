import { useState, useEffect, useMemo, useCallback } from "react";

interface Props {
  initialDate: Date;
  minDate?: Date;
  maxDate?: Date;
  includeTime: boolean;
  onChange?: (date: Date) => void;
}

export function useDateTimePicker({
  initialDate,
  minDate,
  maxDate,
  includeTime,
  onChange,
}: Props) {
  const [day, setDay] = useState(initialDate.getDate());
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [year, setYear] = useState(initialDate.getFullYear());
  const [hour, setHour] = useState(initialDate.getHours());

  const initialMinute = initialDate.getMinutes();
  const [minute, setMinute] = useState((Math.round(initialMinute / 5) * 5) % 60);

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

  const isMonthDisabled = useCallback((m: number) => {
    if (minDate && year === minDate.getFullYear() && m < minDate.getMonth() + 1) return true;
    if (maxDate && year === maxDate.getFullYear() && m > maxDate.getMonth() + 1) return true;
    return false;
  }, [minDate, maxDate, year]);

  const isDayDisabled = useCallback((d: number) => {
    if (minDate && year === minDate.getFullYear() && month === minDate.getMonth() + 1 && d < minDate.getDate()) return true;
    if (maxDate && year === maxDate.getFullYear() && month === maxDate.getMonth() + 1 && d > maxDate.getDate()) return true;
    return false;
  }, [minDate, maxDate, year, month]);

  const isHourDisabled = useCallback((h: number) => {
    if (minDate && year === minDate.getFullYear() && month === minDate.getMonth() + 1 && day === minDate.getDate() && h < minDate.getHours()) return true;
    if (maxDate && year === maxDate.getFullYear() && month === maxDate.getMonth() + 1 && day === maxDate.getDate() && h > maxDate.getHours()) return true;
    return false;
  }, [minDate, maxDate, year, month, day]);

  const isMinuteDisabled = useCallback((min: number) => {
    if (minDate && year === minDate.getFullYear() && month === minDate.getMonth() + 1 && day === minDate.getDate() && hour === minDate.getHours() && min < minDate.getMinutes()) return true;
    if (maxDate && year === maxDate.getFullYear() && month === maxDate.getMonth() + 1 && day === maxDate.getDate() && hour === maxDate.getHours() && min > maxDate.getMinutes()) return true;
    return false;
  }, [minDate, maxDate, year, month, day, hour]);

  useEffect(() => {
    if (isMonthDisabled(month)) setMonth(monthsList.find((m) => !isMonthDisabled(m)) || month);
    if (isDayDisabled(day)) setDay(daysList.find((d) => !isDayDisabled(d)) || day);
    if (includeTime) {
      if (isHourDisabled(hour)) setHour(hoursList.find((h) => !isHourDisabled(h)) || hour);
      if (isMinuteDisabled(minute)) setMinute(minutesList.find((m) => !isMinuteDisabled(m)) || minute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, day, hour, minute, includeTime]);

  useEffect(() => {
    const maxDays = getDaysInMonth(month, year);
    if (day > maxDays) setDay(maxDays);
  }, [month, year, day]);

  useEffect(() => {
    if (onChange) {
      const newDate = new Date(year, month - 1, day, hour, minute);
      onChange(newDate);
    }
  }, [day, month, year, hour, minute, onChange]);

  return {
    state: { day, month, year, hour, minute },
    actions: { setDay, setMonth, setYear, setHour, setMinute },
    lists: { daysList, monthsList, yearsList, hoursList, minutesList },
    validators: { isMonthDisabled, isDayDisabled, isHourDisabled, isMinuteDisabled }
  };
}