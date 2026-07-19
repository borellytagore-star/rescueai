import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    recRef.current?.stop?.();
  }, []);

  const start = () => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      onTranscript(text);
    };
    rec.onend = () => setRecording(false);
    rec.start();
    recRef.current = rec;
    setRecording(true);
    setSeconds(0);
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stop = () => {
    recRef.current?.stop?.();
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  if (!supported) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Voice recognition isn't supported in this browser. Try Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <button
        onClick={recording ? stop : start}
        className={cn(
          "relative w-24 h-24 rounded-full grid place-items-center transition-all",
          recording
            ? "bg-red-500 text-white shadow-lg shadow-red-500/40"
            : "bg-primary/10 text-primary hover:bg-primary/20",
        )}
      >
        <AnimatePresence mode="wait">
          {recording ? (
            <motion.span key="stop" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Square className="w-8 h-8 fill-current" />
            </motion.span>
          ) : (
            <motion.span key="mic" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Mic className="w-8 h-8" />
            </motion.span>
          )}
        </AnimatePresence>
        {recording && (
          <span className="absolute inset-0 rounded-full ring-4 ring-red-500/30 animate-ping" />
        )}
      </button>
      <div className="text-center">
        {recording ? (
          <div className="flex items-center gap-2 text-red-600 font-medium">
            <Loader2 className="w-4 h-4 animate-spin" /> Recording... {seconds}s
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Tap to speak your emergency</p>
        )}
      </div>
      {recording && (
        <Button variant="outline" size="sm" onClick={stop}>
          Stop & transcribe
        </Button>
      )}
    </div>
  );
}
