export type EmergencyType =
  | "cardiac"
  | "respiratory"
  | "trauma"
  | "burn"
  | "stroke"
  | "bleeding"
  | "fracture"
  | "allergic"
  | "poisoning"
  | "other";

export type Severity = "low" | "moderate" | "high" | "critical";
export type AnalysisStatus = "pending" | "analyzing" | "complete" | "error";

export interface EmergencyInput {
  id: string;
  description: string;
  type: EmergencyType | null;
  severity: Severity | null;
  createdAt: string;
  status: "active" | "resolved" | "archived";
  location?: { lat: number; lng: number; label?: string };
  imageUri?: string;
  voiceTranscript?: string;
}

export interface AIAnalysis {
  emergencyType: EmergencyType;
  severity: Severity;
  confidence: number; // 0-100
  riskScore: number; // 0-100
  recommendedAction: string;
  responsePriority: "immediate" | "urgent" | "standard" | "minor";
  firstAidSteps: FirstAidStep[];
  dos: string[];
  donts: string[];
  warning?: string;
}

export interface FirstAidStep {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: "hospital" | "police" | "fire" | "shelter";
  lat: number;
  lng: number;
  address: string;
  phone: string;
  distanceKm?: number;
  open24h: boolean;
  rating?: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface UserSettings {
  language: "en" | "es" | "fr" | "hi";
  theme: "light" | "dark" | "system";
  highContrast: boolean;
  voiceNavigation: boolean;
  notifications: boolean;
  contacts: EmergencyContact[];
  profile: {
    name: string;
    bloodType: string;
    allergies: string;
    medicalConditions: string;
  };
}
