import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Risk level color utilities
export function getRiskLevelColor(level: string): string {
  const normalizedLevel = level?.toUpperCase();
  switch (normalizedLevel) {
    case 'CRITICAL':
      return 'risk-critical';
    case 'HIGH':
      return 'risk-high';
    case 'MEDIUM':
      return 'risk-medium';
    case 'LOW':
      return 'risk-low';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getRiskLevelColorLight(level: string): string {
  const normalizedLevel = level?.toUpperCase();
  switch (normalizedLevel) {
    case 'CRITICAL':
      return 'risk-critical-light';
    case 'HIGH':
      return 'risk-high-light';
    case 'MEDIUM':
      return 'risk-medium-light';
    case 'LOW':
      return 'risk-low-light';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getRiskLevelBadgeVariant(level: string): 'default' | 'destructive' | 'secondary' | 'outline' {
  const normalizedLevel = level?.toUpperCase();
  switch (normalizedLevel) {
    case 'CRITICAL':
      return 'destructive';
    case 'HIGH':
      return 'secondary';
    case 'MEDIUM':
      return 'secondary';
    case 'LOW':
      return 'secondary';
    default:
      return 'secondary';
  }
}

// Format risk level text for display (converts CRITICAL -> Critical)
export function formatRiskLevel(level: string): string {
  if (!level) return 'Unknown';
  const normalized = level.toUpperCase();
  return normalized.charAt(0) + normalized.slice(1).toLowerCase();
}
