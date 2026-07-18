// All dates/times in the app use Eastern Time (America/New_York)
const TZ = "America/New_York";

export function nowET(): Date {
  // Get current time formatted in ET, then parse it back
  const str = new Date().toLocaleString("en-US", { timeZone: TZ });
  return new Date(str);
}

export function todayET(): string {
  // Returns YYYY-MM-DD in Eastern Time
  const d = nowET();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function timeET(): string {
  // Returns HH:MM in Eastern Time
  const d = nowET();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatDateET(dateStr: string): string {
  // Format a date string for display in ET
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { timeZone: TZ, weekday: "short", month: "short", day: "numeric" });
}

export function formatFullDateET(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { timeZone: TZ, month: "short", day: "numeric", year: "numeric" });
}
