import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: "red" | "blue" | "green" | "amber";
  href?: string;
  delay?: number;
}

const accents = {
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  accent = "red",
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-border/70 bg-card p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all"
    >
      <div className={cn("w-12 h-12 rounded-xl grid place-items-center mb-4", accents[accent])}>
        <Icon className="w-6 h-6" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
