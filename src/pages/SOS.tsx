import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Phone, Copy, Share2, MapPin, Loader2, Check, AlertTriangle,
} from "lucide-react";
import { SOSButton } from "@/components/SOSButton";
import { aiService } from "@/services/ai";
import { useEmergencies } from "@/context/EmergencyContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { EmergencyInput } from "@/types";

export default function SOS() {
  const { emergencies, addEmergency } = useEmergencies();
  const [location, setLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [input] = useState<EmergencyInput>(() => ({
    id: crypto.randomUUID(),
    description: "Medical emergency — assistance needed immediately.",
    type: null,
    severity: "high",
    createdAt: new Date().toISOString(),
    status: "active",
  }));

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        };
        setLocation(loc);
        input.location = loc;
      },
      () => setLocation({ lat: 40.7128, lng: -74.006, label: "Default location" }),
    );
  }, [input]);

  const gen = useMutation({
    mutationFn: () => aiService.generateSOS({ ...input, location: location ?? undefined }),
    onSuccess: (msg) => {
      setMessage(msg);
      addEmergency(input);
    },
  });

  useEffect(() => {
    if (location && !message) gen.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const copy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast.success("SOS message copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Emergency SOS", text: message });
      } catch { /* cancelled */ }
    } else {
      copy();
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Emergency SOS</h1>
        <p className="text-muted-foreground mt-1">Your location and a help message, ready to share.</p>
      </div>

      <div className="flex justify-center py-4">
        <SOSButton size="lg" onClick={() => window.location.href = "tel:911"} label="CALL 911" />
      </div>

      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="w-4 h-4 text-primary" /> Current Location
        </div>
        {location ? (
          <p className="text-sm text-muted-foreground">{location.label}</p>
        ) : (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Detecting location...
          </p>
        )}
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">SOS Message</h2>
          {gen.isPending && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="p-3 rounded-lg bg-muted/60 border border-border">
          <p className="text-sm leading-relaxed">{message || "Generating message..."}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={copy} disabled={!message}>
            {copied ? <Check className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" className="flex-1" onClick={share} disabled={!message}>
            <Share2 className="w-4 h-4 mr-1" /> Share
          </Button>
        </div>
      </Card>

      <Card className="p-5 space-y-3 border-red-200 dark:border-red-500/20">
        <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
          <AlertTriangle className="w-4 h-4" /> Emergency Contacts
        </div>
        <div className="grid gap-2">
          {[
            { name: "Emergency Services", number: "911" },
            { name: "Poison Control", number: "1-800-222-1222" },
            { name: "Sarah Johnson (Spouse)", number: "+1 (555) 123-4567" },
          ].map((c) => (
            <motion.a
              key={c.number}
              href={`tel:${c.number}`}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div>
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.number}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-red-500 text-white grid place-items-center">
                <Phone className="w-4 h-4" />
              </div>
            </motion.a>
          ))}
        </div>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Sharing your message does not automatically contact authorities. Please call 911 directly in life-threatening situations.
      </p>
    </div>
  );
}
