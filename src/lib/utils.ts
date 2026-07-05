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
    const secs = Math.floor(diffMs / 1000) % 60;
    
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  } catch (e) {
    return null;
  }
}

export function formatDate(isoStr: string | null): string | null {
  if (!isoStr) return null;
  try {
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return isoStr; // Fallback for old formatted data
    return date.toLocaleString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
}
