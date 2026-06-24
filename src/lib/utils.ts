import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    INFO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    LOW: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    MEDIUM: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[severity] || colors.INFO;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    RESEARCHING: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    TESTING: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    COMPLETED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    OPEN: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    CONFIRMED: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    MITIGATED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    CLOSED: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    DRAFT: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    REVIEW: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    SUBMITTED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    ACCEPTED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    ACTIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    HIDDEN: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    DEPRECATED: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  };
  return colors[status] || colors.DRAFT;
}
