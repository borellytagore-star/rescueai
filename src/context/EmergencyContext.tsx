import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AIAnalysis, EmergencyInput } from "@/types";

const STORAGE_KEY = "rescueai.emergencies.v1";

interface EmergencyContextValue {
  emergencies: EmergencyInput[];
  addEmergency: (input: EmergencyInput, analysis?: AIAnalysis) => void;
  resolveEmergency: (id: string) => void;
  removeEmergency: (id: string) => void;
  analyses: Record<string, AIAnalysis>;
}

const Ctx = createContext<EmergencyContextValue | null>(null);

const seed: EmergencyInput[] = [
  {
    id: "s1",
    description: "Chest pain and shortness of breath during morning run.",
    type: "cardiac",
    severity: "critical",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "resolved",
    location: { lat: 40.7128, lng: -74.006, label: "Central Park, NY" },
  },
  {
    id: "s2",
    description: "Child fell from bike, possible wrist fracture.",
    type: "fracture",
    severity: "moderate",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "resolved",
  },
  {
    id: "s3",
    description: "Severe allergic reaction after bee sting.",
    type: "allergic",
    severity: "high",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    status: "active",
  },
];

function load(): EmergencyInput[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return seed;
}

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [emergencies, setEmergencies] = useState<EmergencyInput[]>(load);
  const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emergencies));
  }, [emergencies]);

  const value = useMemo<EmergencyContextValue>(() => ({
    emergencies,
    analyses,
    addEmergency: (input, analysis) => {
      setEmergencies((e) => [input, ...e]);
      if (analysis) setAnalyses((a) => ({ ...a, [input.id]: analysis }));
    },
    resolveEmergency: (id) =>
      setEmergencies((e) =>
        e.map((x) => (x.id === id ? { ...x, status: "resolved" } : x)),
      ),
    removeEmergency: (id) =>
      setEmergencies((e) => e.filter((x) => x.id !== id)),
  }), [emergencies, analyses]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEmergencies() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEmergencies must be used within EmergencyProvider");
  return ctx;
}
