export function formatDateToYMD(date?: Date) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}
