import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RiskMeterProps {
  score: number; // 0-100
  label?: string;
}

export function RiskMeter({ score, label = "Risk Level" }: RiskMeterProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const tone =
    clamped >= 80
      ? { text: "text-red-600", bar: "from-red-500 to-red-600", tag: "Critical" }
      : clamped >= 60
        ? { text: "text-orange-600", bar: "from-orange-400 to-orange-500", tag: "High" }
        : clamped >= 35
          ? { text: "text-amber-600", bar: "from-amber-400 to-amber-500", tag: "Moderate" }
          : { text: "text-emerald-600", bar: "from-emerald-400 to-emerald-500", tag: "Low" };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-semibold", tone.text)}>{tone.tag} · {clamped}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", tone.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
