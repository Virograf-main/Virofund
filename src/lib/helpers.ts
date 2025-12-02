export function formatDateToYMD(date?: Date) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export function formatChatDate(date: Date): string {
  const now = new Date();

  // Strip time parts → compare only the date portions
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Yesterday check
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  // const hours = date.getHours();
  // const minutes = date.getMinutes();

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isSameDay(date, now)) {
    return `Today | ${formattedTime}`;
  }

  if (isSameDay(date, yesterday)) {
    return `Yesterday | ${formattedTime}`;
  }

  // Otherwise show day of week (Mon, Tue, Wed…)
  const dayOfWeek = date.toLocaleDateString("en-US", {
    weekday: "short",
  });

  return `${dayOfWeek} | ${formattedTime}`;
}
