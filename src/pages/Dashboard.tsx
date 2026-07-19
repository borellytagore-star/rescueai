import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageSquare, Mic, Camera, Phone, AlertTriangle,
  Lightbulb, Clock, ArrowRight, Activity, HeartPulse,
} from "lucide-react";
import { EmergencyCard } from "@/components/EmergencyCard";
import { SOSButton } from "@/components/SOSButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEmergencies } from "@/context/EmergencyContext";
import { emergencyMeta, severityMeta, formatDate } from "@/utils/emergency";

const tips = [
  { icon: AlertTriangle, text: "Stay calm. Panic costs seconds — clarity saves them." },
  { icon: HeartPulse, text: "For chest pain, call 911 and chew 325mg aspirin if not allergic." },
  { icon: Activity, text: "Note the time symptoms began — it guides treatment." },
  { icon: Phone, text: "Know your local emergency number before you need it." },
];

export default function Dashboard() {
  const { emergencies } = useEmergencies();
  const recent = emergencies.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-10">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emergency Dashboard</h1>
          <p className="text-muted-foreground mt-1">Choose how you'd like to report an emergency.</p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          AI ready
        </Badge>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <EmergencyCard
          icon={MessageSquare}
          title="Describe Emergency"
          description="Type what's happening and get instant AI triage."
          to="/emergency"
          accent="red"
          delay={0.05}
        />
        <EmergencyCard
          icon={Mic}
          title="Speak to AI"
          description="Hands-free voice reporting with live transcription."
          to="/emergency?mode=voice"
          accent="blue"
          delay={0.12}
        />
        <EmergencyCard
          icon={Camera}
          title="Upload Image"
          description="Share a photo of the scene for visual analysis."
          to="/emergency?mode=image"
          accent="green"
          delay={0.19}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent emergencies */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" /> Recent Emergencies
            </h2>
            <Link to="/history" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No emergencies yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((e, i) => {
                const em = e.type ? emergencyMeta[e.type] : null;
                const sev = e.severity ? severityMeta[e.severity] : null;
                return (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/70 hover:bg-muted/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{e.description}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(e.createdAt)}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {em && <Badge variant="secondary" className="text-xs">{em.label}</Badge>}
                      {sev && <Badge className={`text-xs ${sev.bg} ${sev.color}`}>{sev.label}</Badge>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick SOS */}
        <Card className="p-6 flex flex-col items-center justify-center text-center gap-4 border-red-200 dark:border-red-500/20">
          <div>
            <h2 className="text-lg font-semibold">Quick SOS</h2>
            <p className="text-sm text-muted-foreground mt-1">Send your location instantly.</p>
          </div>
          <SOSButton size="md" onClick={() => (window.location.href = "/sos")} />
          <Link to="/sos" className="text-sm text-primary hover:underline">Open SOS screen</Link>
        </Card>
      </div>

      {/* Tips */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-500" /> Emergency Tips
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {tips.map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <t.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm">{t.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
