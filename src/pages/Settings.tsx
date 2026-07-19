import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Globe, Moon, Bell, Users, Plus, Trash2, Heart,
  ShieldAlert, Volume2, Contrast,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Settings() {
  const { settings, update, addContact, removeContact } = useSettings();
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });

  const save = () => toast.success("Settings saved");

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Personalize RescueAI for your needs.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-2 sm:flex sm:w-auto">
          <TabsTrigger value="general"><Globe className="w-4 h-4 mr-1.5" /> General</TabsTrigger>
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-1.5" /> Profile</TabsTrigger>
          <TabsTrigger value="contacts"><Users className="w-4 h-4 mr-1.5" /> Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Globe className="w-4 h-4" /> Appearance & Language</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Language</Label>
                <Select value={settings.language} onValueChange={(v) => update({ language: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Theme</Label>
                <Select value={settings.theme} onValueChange={(v) => update({ theme: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ToggleRow
              icon={Contrast}
              label="High contrast mode"
              description="Improves visibility for low-vision users."
              checked={settings.highContrast}
              onChange={(v) => update({ highContrast: v })}
            />
            <ToggleRow
              icon={Volume2}
              label="Voice navigation"
              description="Enable spoken guidance throughout the app."
              checked={settings.voiceNavigation}
              onChange={(v) => update({ voiceNavigation: v })}
            />
            <ToggleRow
              icon={Bell}
              label="Notifications"
              description="Receive safety tips and emergency alerts."
              checked={settings.notifications}
              onChange={(v) => update({ notifications: v })}
            />
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Medical Profile</h2>
            <p className="text-sm text-muted-foreground">This information can be shared with responders during an emergency.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Full name</Label>
                <Input value={settings.profile.name} onChange={(e) => update({ profile: { ...settings.profile, name: e.target.value } })} />
              </div>
              <div>
                <Label className="mb-1.5 block">Blood type</Label>
                <Input value={settings.profile.bloodType} onChange={(e) => update({ profile: { ...settings.profile, bloodType: e.target.value } })} />
              </div>
              <div>
                <Label className="mb-1.5 block">Allergies</Label>
                <Input value={settings.profile.allergies} onChange={(e) => update({ profile: { ...settings.profile, allergies: e.target.value } })} />
              </div>
              <div>
                <Label className="mb-1.5 block">Medical conditions</Label>
                <Input value={settings.profile.medicalConditions} onChange={(e) => update({ profile: { ...settings.profile, medicalConditions: e.target.value } })} />
              </div>
            </div>
            <Button onClick={save}>Save profile</Button>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4 mt-4">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Users className="w-4 h-4" /> Emergency Contacts</h2>
            <div className="space-y-2">
              {settings.contacts.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary grid place-items-center">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.relation} · {c.phone}</div>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeContact(c.id)}>
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="pt-3 border-t border-border">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add contact</h3>
              <div className="grid sm:grid-cols-3 gap-2">
                <Input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
                <Input placeholder="Relation" value={newContact.relation} onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })} />
                <Input placeholder="Phone" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
              </div>
              <Button
                className="mt-3"
                onClick={() => {
                  if (!newContact.name || !newContact.phone) return toast.error("Name and phone required");
                  addContact(newContact);
                  setNewContact({ name: "", relation: "", phone: "" });
                  toast.success("Contact added");
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-4 flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          RescueAI stores all settings and history locally on your device. We never upload your data without your action.
        </p>
      </Card>
    </div>
  );
}

function ToggleRow({
  icon: Icon, label, description, checked, onChange,
}: {
  icon: typeof Bell; label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-muted grid place-items-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
