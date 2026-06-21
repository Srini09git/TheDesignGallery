import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDuration(startStr: string, endStr: string): string | null {
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return null; // Edge case: completed before download

    const totalHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHrs / 24);
    const hrs = totalHrs % 24;

    if (days > 0) return `${days}d ${hrs}h`;
    if (hrs > 0) return `${hrs}h`;
    
    const mins = Math.floor(diffMs / (1000 * 60));
    return `${mins}m`;
  } catch (e) {
    return null;
  }
}
