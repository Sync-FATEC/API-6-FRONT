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
