import { motion } from "framer-motion";

export function LoadingScreen({ label = "Analyzing..." }: { label?: string }) {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-200"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500"
            animate={{ rotate: -360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-2xl">+</span>
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">AI is processing your input</p>
        </div>
      </div>
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-current"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
