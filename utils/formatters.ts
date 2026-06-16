export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(parsedDate);
}

export const formatArea = (value: string | number | undefined | null, unit: string) =>
  value ? `${typeof value === "number" ? value.toFixed(1) : value} ${unit}` : null;

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const abs = Math.abs(value);
  const maximumFractionDigits = Number.isInteger(value)
    ? 0
    : abs < 10
      ? 2
      : abs < 1000
        ? 1
        : 0;
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits }).format(value);
}
