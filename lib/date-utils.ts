/**
 * Parse an ISO 8601 string containing explicit timezone offset (e.g., 2026-10-15T09:30:00+05:00)
 * Extracts local date, time, and offset directly from the string without client/server timezone conversion.
 */
export interface ParsedFlightTime {
  time: string;       // e.g. "09:30"
  date: string;       // e.g. "15 Oct 2026"
  shortDate: string;  // e.g. "15 Oct"
  offset: string;     // e.g. "+05:00"
  timeWithOffset: string; // e.g. "09:30 (+05:00)"
  rawIso: string;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function parseIsoWithOffset(isoString: string): ParsedFlightTime {
  if (!isoString) {
    return {
      time: "--:--",
      date: "",
      shortDate: "",
      offset: "",
      timeWithOffset: "--:--",
      rawIso: "",
    };
  }

  // Matches "2026-10-15T09:30:00+05:00" or "...Z" or "...+04:00"
  const match = isoString.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?(?:(\+|-)\d{2}:\d{2}|Z)?$/
  );

  if (!match) {
    return {
      time: isoString.substring(11, 16) || "--:--",
      date: "",
      shortDate: "",
      offset: "",
      timeWithOffset: isoString.substring(11, 16) || "--:--",
      rawIso: isoString,
    };
  }

  const [, year, month, day, hours, minutes] = match;
  const monthIdx = parseInt(month, 10) - 1;
  const monthName = MONTH_NAMES[monthIdx] || month;

  // Extract offset suffix
  let offset = "";
  if (isoString.endsWith("Z")) {
    offset = "UTC";
  } else {
    const offsetMatch = isoString.match(/([+-]\d{2}:\d{2})$/);
    if (offsetMatch) {
      offset = offsetMatch[1];
    }
  }

  const time = `${hours}:${minutes}`;
  const shortDate = `${parseInt(day, 10)} ${monthName}`;
  const date = `${parseInt(day, 10)} ${monthName} ${year}`;
  const timeWithOffset = offset ? `${time} (${offset})` : time;

  return {
    time,
    date,
    shortDate,
    offset,
    timeWithOffset,
    rawIso: isoString,
  };
}

/**
 * Formats duration in minutes into a human-readable string (e.g. "2h 15m")
 */
export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
