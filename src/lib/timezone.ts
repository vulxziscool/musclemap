// All dates/times in the app use the user's LOCAL browser timezone
// This fixes the "one day behind" bug caused by UTC on servers

export function todayLocal(): string {
  // Use Intl to get the user's actual local date parts
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function timeLocal(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

// Keep old name as alias so nothing breaks
export const todayET = todayLocal;
export const timeET = timeLocal;

export function formatDateLocal(dateStr: string): string {
  // Parse as local date (not UTC) by appending T12:00:00
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function formatFullDateLocal(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Keep old names
export const formatDateET = formatDateLocal;
export const formatFullDateET = formatFullDateLocal;
export const nowET = () => new Date();
