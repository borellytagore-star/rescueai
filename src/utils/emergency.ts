import { EmergencyType, Severity } from "@/types";

export const emergencyMeta: Record<
  EmergencyType,
  { label: string; emoji: string; color: string }
> = {
  cardiac: { label: "Cardiac Emergency", emoji: "heart", color: "text-red-500" },
  respiratory: { label: "Respiratory Distress", emoji: "wind", color: "text-blue-500" },
  trauma: { label: "Trauma / Injury", emoji: "alert-triangle", color: "text-orange-500" },
  burn: { label: "Burn Injury", emoji: "flame", color: "text-orange-600" },
  stroke: { label: "Stroke", emoji: "brain", color: "text-purple-500" },
  bleeding: { label: "Severe Bleeding", emoji: "droplet", color: "text-red-600" },
  fracture: { label: "Fracture", emoji: "bone", color: "text-amber-500" },
  allergic: { label: "Allergic Reaction", emoji: "shield-alert", color: "text-pink-500" },
  poisoning: { label: "Poisoning", emoji: "skull", color: "text-red-700" },
  other: { label: "General Emergency", emoji: "life-buoy", color: "text-blue-600" },
};

export const severityMeta: Record<
  Severity,
  { label: string; color: string; bg: string; ring: string }
> = {
  low: { label: "Low", color: "text-emerald-700", bg: "bg-emerald-100", ring: "ring-emerald-500" },
  moderate: { label: "Moderate", color: "text-amber-700", bg: "bg-amber-100", ring: "ring-amber-500" },
  high: { label: "High", color: "text-orange-700", bg: "bg-orange-100", ring: "ring-orange-500" },
  critical: { label: "Critical", color: "text-red-700", bg: "bg-red-100", ring: "ring-red-500" },
};

export const priorityMeta: Record<
  string,
  { label: string; color: string }
> = {
  immediate: { label: "Immediate", color: "text-red-600" },
  urgent: { label: "Urgent", color: "text-orange-600" },
  standard: { label: "Standard", color: "text-blue-600" },
  minor: { label: "Minor", color: "text-emerald-600" },
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
