import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Send, Loader2, MessageSquare, Mic, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { ImageUploader } from "@/components/ImageUploader";
import { aiService } from "@/services/ai";
import { useEmergencies } from "@/context/EmergencyContext";
import type { AIAnalysis, EmergencyInput } from "@/types";
import { toast } from "sonner";

type Mode = "text" | "voice" | "image";

export default function Emergency() {
  const [params] = useSearchParams();
  const initial = (params.get("mode") as Mode) ?? "text";
  const [mode, setMode] = useState<Mode>(initial);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const { addEmergency } = useEmergencies();

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "voice") return aiService.analyzeVoice(text);
      if (mode === "image") return aiService.analyzeImage(image);
      return aiService.analyzeText(text);
    },
    onSuccess: (analysis: AIAnalysis) => {
      const input: EmergencyInput = {
        id: crypto.randomUUID(),
        description: text || (mode === "image" ? "Image analysis" : "Voice report"),
        type: analysis.emergencyType,
        severity: analysis.severity,
        createdAt: new Date().toISOString(),
        status: "active",
        imageUri: image || undefined,
        voiceTranscript: mode === "voice" ? text : undefined,
      };
      addEmergency(input, analysis);
      navigate(`/analysis/${input.id}`);
    },
    onError: () => toast.error("Could not analyze. Try again."),
  });

  const canSubmit = mode === "image" ? !!image : !!text.trim();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Report an emergency</h1>
        <p className="text-muted-foreground mt-1">Describe what's happening. Our AI will guide you.</p>
      </div>

      {/* Mode tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-muted">
        {([
          { id: "text", label: "Describe", icon: MessageSquare },
          { id: "voice", label: "Voice", icon: Mic },
          { id: "image", label: "Image", icon: Camera },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={`relative flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === t.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode === t.id && (
              <motion.div layoutId="tab" className="absolute inset-0 rounded-lg bg-primary" />
            )}
            <t.icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <Card className="p-6 space-y-4">
        {mode === "text" && (
          <>
            <label className="text-sm font-medium">What's the emergency?</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. My friend is having chest pain and difficulty breathing..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">Be as specific as possible. Mention symptoms, timing, and the person's condition.</p>
          </>
        )}
        {mode === "voice" && (
          <div className="space-y-4">
            <VoiceRecorder onTranscript={setText} />
            {text && (
              <div className="p-3 rounded-lg bg-muted/60 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Transcript</p>
                <p className="text-sm">{text}</p>
              </div>
            )}
          </div>
        )}
        {mode === "image" && (
          <div className="space-y-4">
            <ImageUploader onImage={setImage} value={image} />
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a brief description (optional)..."
              rows={3}
              className="resize-none"
            />
          </div>
        )}

        <Button
          onClick={() => mutation.mutate()}
          disabled={!canSubmit || mutation.isPending}
          size="lg"
          className="w-full gradient-emergency text-white shadow-lg shadow-red-500/20"
        >
          {mutation.isPending ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
          ) : (
            <><Send className="w-4 h-4 mr-2" /> Analyze with AI</>
          )}
        </Button>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        For life-threatening emergencies, always call 911 first.
      </p>
    </div>
  );
}
