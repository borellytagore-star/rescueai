import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface SOSButtonProps {
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function SOSButton({
  onClick,
  size = "lg",
  label = "SOS",
  className,
}: SOSButtonProps) {
  const dims = {
    sm: "w-16 h-16 text-sm",
    md: "w-24 h-24 text-base",
    lg: "w-36 h-36 text-xl",
  }[size];

  return (
    <div className={cn("relative grid place-items-center", className)}>
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative rounded-full gradient-emergency text-white font-bold shadow-2xl shadow-red-500/40 grid place-items-center animate-pulse-ring",
          dims,
        )}
        aria-label="Send SOS"
      >
        <div className="flex flex-col items-center gap-1">
          <Phone className={size === "lg" ? "w-7 h-7" : "w-5 h-5"} strokeWidth={2.5} />
          <span className="tracking-widest">{label}</span>
        </div>
      </motion.button>
    </div>
  );
}
