import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface EmergencyCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  accent: "red" | "blue" | "green";
  delay?: number;
}

const accents = {
  red: {
    gradient: "from-red-500/10 to-rose-500/5",
    iconBg: "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30",
    hoverBorder: "hover:border-red-300 dark:hover:border-red-500/40",
    text: "text-red-600 dark:text-red-400",
  },
  blue: {
    gradient: "from-blue-500/10 to-indigo-500/5",
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-500/40",
    text: "text-blue-600 dark:text-blue-400",
  },
  green: {
    gradient: "from-emerald-500/10 to-green-500/5",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-500/40",
    text: "text-emerald-600 dark:text-emerald-400",
  },
};

export function EmergencyCard({
  icon: Icon,
  title,
  description,
  to,
  accent,
  delay = 0,
}: EmergencyCardProps) {
  const a = accents[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link
        to={to}
        className={cn(
          "group relative block overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1",
          a.hoverBorder,
        )}
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity", a.gradient)} />
        <div className="relative">
          <div className={cn("w-14 h-14 rounded-2xl grid place-items-center mb-4 shadow-lg", a.iconBg)}>
            <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold mb-1.5">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
          <div className={cn("inline-flex items-center gap-1.5 text-sm font-medium", a.text)}>
            Start now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
