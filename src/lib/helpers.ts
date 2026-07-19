export function formatDateToYMD(date?: Date) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

/**
 * Compares two field values for equality, treating arrays (e.g. multi-select
 * fields like skills/personality traits) as equal when they contain the same
 * items regardless of order. Used to figure out which fields a user has
 * actually changed so only those get sent to the backend.
 */
export function valuesEqual(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((v, i) => v === sortedB[i]);
  }
  return a === b;
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
