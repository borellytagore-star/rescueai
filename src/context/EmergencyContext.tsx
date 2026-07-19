import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AIAnalysis, EmergencyInput } from "@/types";
import { db } from "@/services/db";
import { toast } from "sonner";

const CACHE_KEY = "rescueai.emergencies.v1";

interface EmergencyContextValue {
  emergencies: EmergencyInput[];
  analyses: Record<string, AIAnalysis>;
  loading: boolean;
  addEmergency: (input: EmergencyInput, analysis?: AIAnalysis) => void;
  resolveEmergency: (id: string) => void;
  removeEmergency: (id: string) => void;
  loadAnalysis: (id: string) => Promise<AIAnalysis | null>;
}

const Ctx = createContext<EmergencyContextValue | null>(null);

function loadCache(): EmergencyInput[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [emergencies, setEmergencies] = useState<EmergencyInput[]>(loadCache);
  const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(emergencies));
  }, [emergencies]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await db.listEmergencies();
        if (!cancelled) {
          setEmergencies(rows);
          if (rows.length === 0) setEmergencies([]);
        }
      } catch {
        // keep cache; backend unavailable
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addEmergency = useCallback((input: EmergencyInput, analysis?: AIAnalysis) => {
    setEmergencies((e) => [input, ...e.filter((x) => x.id !== input.id)]);
    if (analysis) setAnalyses((a) => ({ ...a, [input.id]: analysis }));
    db.saveEmergency(input, analysis).catch(() => {
      toast.error("Could not save to cloud — kept locally.");
    });
  }, []);

  const resolveEmergency = useCallback((id: string) => {
    setEmergencies((e) =>
      e.map((x) => (x.id === id ? { ...x, status: "resolved" } : x)),
    );
    db.resolveEmergency(id).catch(() => {});
  }, []);

  const removeEmergency = useCallback((id: string) => {
    setEmergencies((e) => e.filter((x) => x.id !== id));
    db.removeEmergency(id).catch(() => {});
  }, []);

  const loadAnalysis = useCallback(async (id: string) => {
    if (analyses[id]) return analyses[id];
    try {
      const a = await db.getAnalysis(id);
      if (a) setAnalyses((prev) => ({ ...prev, [id]: a }));
      return a;
    } catch {
      return null;
    }
  }, [analyses]);

  const value = useMemo<EmergencyContextValue>(
    () => ({
      emergencies,
      analyses,
      loading,
      addEmergency,
      resolveEmergency,
      removeEmergency,
      loadAnalysis,
    }),
    [emergencies, analyses, loading, addEmergency, resolveEmergency, removeEmergency, loadAnalysis],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEmergencies() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEmergencies must be used within EmergencyProvider");
  return ctx;
}
