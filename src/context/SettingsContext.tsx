import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EmergencyContact, UserSettings } from "@/types";
import { supabase } from "@/services/supabase";
import { toast } from "sonner";

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

  // Sync from Supabase on mount (cloud is source of truth if present)
  useEffect(() => {
    (async () => {
      try {
        const [{ data: sRow }, { data: cRows }, { data: pRow }] = await Promise.all([
          supabase.from("user_settings").select("*").eq("id", "00000000-0000-0000-0000-000000000001").maybeSingle(),
          supabase.from("emergency_contacts").select("*").order("created_at", { ascending: true }),
          supabase.from("user_profile").select("*").eq("id", "00000000-0000-0000-0000-000000000001").maybeSingle(),
        ]);
        setSettings((prev) => ({
          ...prev,
          language: (sRow as any)?.language ?? prev.language,
          theme: (sRow as any)?.theme ?? prev.theme,
          highContrast: (sRow as any)?.high_contrast ?? prev.highContrast,
          voiceNavigation: (sRow as any)?.voice_navigation ?? prev.voiceNavigation,
          notifications: (sRow as any)?.notifications ?? prev.notifications,
          contacts: (cRows as any[])?.map((r) => ({
            id: r.id, name: r.name, relation: r.relation, phone: r.phone,
          })) ?? prev.contacts,
          profile: pRow ? {
            name: (pRow as any).name,
            bloodType: (pRow as any).blood_type,
            allergies: (pRow as any).allergies,
            medicalConditions: (pRow as any).medical_conditions,
          } : prev.profile,
        }));
      } catch {
        // keep localStorage defaults
      }
    })();
  }, []);

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
    update: (patch) => {
      setSettings((s) => ({ ...s, ...patch }));
      if (patch.language || patch.theme || patch.highContrast !== undefined || patch.voiceNavigation !== undefined || patch.notifications !== undefined) {
        supabase.from("user_settings")
          .upsert({
            id: "00000000-0000-0000-0000-000000000001",
            language: patch.language ?? settings.language,
            theme: patch.theme ?? settings.theme,
            high_contrast: patch.highContrast ?? settings.highContrast,
            voice_navigation: patch.voiceNavigation ?? settings.voiceNavigation,
            notifications: patch.notifications ?? settings.notifications,
            updated_at: new Date().toISOString(),
          })
          .then(({ error }) => { if (error) toast.error("Settings sync failed"); });
      }
      if (patch.profile) {
        supabase.from("user_profile")
          .upsert({
            id: "00000000-0000-0000-0000-000000000001",
            name: patch.profile.name,
            blood_type: patch.profile.bloodType,
            allergies: patch.profile.allergies,
            medical_conditions: patch.profile.medicalConditions,
            updated_at: new Date().toISOString(),
          })
          .then(({ error }) => { if (error) toast.error("Profile sync failed"); });
      }
    },
    addContact: (c) => {
      const id = crypto.randomUUID();
      setSettings((s) => ({ ...s, contacts: [...s.contacts, { ...c, id }] }));
      supabase.from("emergency_contacts")
        .insert({ id, name: c.name, relation: c.relation, phone: c.phone })
        .then(({ error }) => { if (error) toast.error("Contact save failed"); });
    },
    removeContact: (id) => {
      setSettings((s) => ({ ...s, contacts: s.contacts.filter((c) => c.id !== id) }));
      supabase.from("emergency_contacts").delete().eq("id", id).then(({ error }) => {
        if (error) toast.error("Contact delete failed");
      });
    },
    toggleTheme: () =>
      setSettings((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" })),
  }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
