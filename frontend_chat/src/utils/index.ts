export interface FormatMessageTimeParams {
  date: string | number | Date;
}

export function formatMessageTime(
  date: FormatMessageTimeParams["date"]
): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
