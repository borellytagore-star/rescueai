import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Activity, Clock, Sparkles } from "lucide-react";
import type { AIAnalysis } from "@/types";
import { emergencyMeta, severityMeta, priorityMeta } from "@/utils/emergency";
import { RiskMeter } from "./RiskMeter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AIResponseCard({ analysis }: { analysis: AIAnalysis }) {
  const em = emergencyMeta[analysis.emergencyType];
  const sev = severityMeta[analysis.severity];
  const prio = priorityMeta[analysis.responsePriority];

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> AI Analysis Complete
              </div>
              <h2 className="text-2xl font-bold">{em.label}</h2>
              <p className="text-sm text-muted-foreground max-w-lg">{analysis.recommendedAction}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={cn("ring-1", sev.bg, sev.color, sev.ring)}>{sev.label} severity</Badge>
              <span className={cn("text-sm font-semibold", prio.color)}>{prio.label} priority</span>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Activity} label="Confidence" value={`${analysis.confidence}%`} tone="blue" delay={0.1} />
        <StatCard icon={AlertTriangle} label="Risk Score" value={`${analysis.riskScore}/100`} tone="red" delay={0.15} />
        <StatCard icon={Clock} label="Response" value={prio.label} tone="amber" delay={0.2} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <Card className="p-6 space-y-4">
          <RiskMeter score={analysis.riskScore} />
          {analysis.warning && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{analysis.warning}</span>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  delay,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  tone: "red" | "blue" | "amber";
  delay: number;
}) {
  const tones = {
    red: "text-red-600 bg-red-50 dark:bg-red-500/10",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="p-5 flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg grid place-items-center", tones[tone])}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
      </Card>
    </motion.div>
  );
}

export function FirstAidList({ analysis }: { analysis: AIAnalysis }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" /> Step-by-step instructions
        </h3>
        {analysis.firstAidSteps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-4 flex gap-4 items-start">
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-sm shrink-0">
                {step.id}
              </div>
              <div>
                <h4 className="font-semibold">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="space-y-4">
        <Card className="p-5 border-emerald-200 dark:border-emerald-500/20">
          <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3">Do's</h4>
          <ul className="space-y-2 text-sm">
            {analysis.dos.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-emerald-500 font-bold">✓</span> {d}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5 border-red-200 dark:border-red-500/20">
          <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">Don'ts</h4>
          <ul className="space-y-2 text-sm">
            {analysis.donts.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-red-500 font-bold">✕</span> {d}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
