import {
  format,
  isToday,
  isYesterday,
  subDays,
  startOfWeek,
  isSameMonth,
} from "date-fns";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to categorize dates
export const categorizeDate = (dateStr: string): string => {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (date >= subDays(new Date(), 7)) {
    return "Last 7 days";
  } else if (date >= startOfWeek(new Date(), { weekStartsOn: 1 })) {
    return "Last 2 weeks";
  } else if (isSameMonth(new Date(), date)) {
    return format(date, "MMMM"); // e.g., "August"
  } else {
    return format(date, "MMMM yyyy"); // e.g., "July 2024"
  }
};
