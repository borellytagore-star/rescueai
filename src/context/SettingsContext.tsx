import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EmergencyContact, UserSettings } from "@/types";

const STORAGE_KEY = "rescueai.settings.v1";

const defaultSettings: UserSettings = {
  language: "en",
  theme: "system",
  highContrast: false,
  voiceNavigation: false,
  notifications: true,
  contacts: [
    { id: "c1", name: "Sarah Johnson", relation: "Spouse", phone: "+1 (555) 123-4567" },
    { id: "c2", name: "Dr. Michael Reed", relation: "Physician", phone: "+1 (555) 987-6543" },
  ],
  profile: {
    name: "Alex Carter",
    bloodType: "O+",
    allergies: "Penicillin",
    medicalConditions: "Asthma",
  },
};

interface SettingsContextValue {
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
  addContact: (c: Omit<EmergencyContact, "id">) => void;
  removeContact: (id: string) => void;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function load(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return defaultSettings;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    const apply = (dark: boolean) => root.classList.toggle("dark", dark);
    if (settings.theme === "dark") apply(true);
    else if (settings.theme === "light") apply(false);
    else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches);
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [settings.theme]);

  const value = useMemo<SettingsContextValue>(() => ({
    settings,
    update: (patch) => setSettings((s) => ({ ...s, ...patch })),
    addContact: (c) =>
      setSettings((s) => ({
        ...s,
        contacts: [...s.contacts, { ...c, id: crypto.randomUUID() }],
      })),
    removeContact: (id) =>
      setSettings((s) => ({
        ...s,
        contacts: s.contacts.filter((c) => c.id !== id),
      })),
    toggleTheme: () =>
      setSettings((s) => ({
        ...s,
        theme: s.theme === "dark" ? "light" : "dark",
      })),
  }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
