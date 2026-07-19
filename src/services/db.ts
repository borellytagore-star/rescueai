import { supabase } from "./supabase";
import type { AIAnalysis, EmergencyInput, Facility } from "@/types";

/**
 * Persistence layer backed by Supabase. Each function returns typed data and
 * throws on error so callers can surface a visible error state.
 */

interface EmergencyRow {
  id: string;
  description: string;
  type: string | null;
  severity: string | null;
  status: string;
  lat: number | null;
  lng: number | null;
  location_label: string | null;
  image_uri: string | null;
  voice_transcript: string | null;
  created_at: string;
  resolved_at: string | null;
}

interface AnalysisRow {
  id: string;
  emergency_id: string;
  emergency_type: string;
  severity: string;
  confidence: number;
  risk_score: number;
  recommended_action: string;
  response_priority: string;
  warning: string | null;
  first_aid_steps?: { step_number: number; title: string; description: string }[];
  first_aid_dos_donts?: { kind: string; text: string }[];
}

function rowToEmergency(r: EmergencyRow): EmergencyInput {
  return {
    id: r.id,
    description: r.description,
    type: (r.type as EmergencyInput["type"]) ?? null,
    severity: (r.severity as EmergencyInput["severity"]) ?? null,
    createdAt: r.created_at,
    status: r.status as EmergencyInput["status"],
    location:
      r.lat != null && r.lng != null
        ? { lat: r.lat, lng: r.lng, label: r.location_label ?? undefined }
        : undefined,
    imageUri: r.image_uri ?? undefined,
    voiceTranscript: r.voice_transcript ?? undefined,
  };
}

function rowToAnalysis(r: AnalysisRow): AIAnalysis {
  return {
    emergencyType: r.emergency_type as AIAnalysis["emergencyType"],
    severity: r.severity as AIAnalysis["severity"],
    confidence: r.confidence,
    riskScore: r.risk_score,
    recommendedAction: r.recommended_action,
    responsePriority: r.response_priority as AIAnalysis["responsePriority"],
    warning: r.warning ?? undefined,
    firstAidSteps: (r.first_aid_steps ?? [])
      .sort((a, b) => a.step_number - b.step_number)
      .map((s, i) => ({
        id: i + 1,
        title: s.title,
        description: s.description,
      })),
    dos: (r.first_aid_dos_donts ?? []).filter((d) => d.kind === "do").map((d) => d.text),
    donts: (r.first_aid_dos_donts ?? []).filter((d) => d.kind === "dont").map((d) => d.text),
  };
}

export const db = {
  async listEmergencies(): Promise<EmergencyInput[]> {
    const { data, error } = await supabase
      .from("emergencies")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as EmergencyRow[]).map(rowToEmergency);
  },

  async getAnalysis(emergencyId: string): Promise<AIAnalysis | null> {
    const { data, error } = await supabase
      .from("emergency_analyses")
      .select(
        "*, first_aid_steps(*), first_aid_dos_donts(*)",
      )
      .eq("emergency_id", emergencyId)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToAnalysis(data as AnalysisRow) : null;
  },

  async saveEmergency(input: EmergencyInput, analysis?: AIAnalysis): Promise<void> {
    const { error: eErr } = await supabase.from("emergencies").upsert({
      id: input.id,
      description: input.description,
      type: input.type,
      severity: input.severity,
      status: input.status,
      lat: input.location?.lat ?? null,
      lng: input.location?.lng ?? null,
      location_label: input.location?.label ?? null,
      image_uri: input.imageUri ?? null,
      voice_transcript: input.voiceTranscript ?? null,
      created_at: input.createdAt,
      resolved_at: input.status === "resolved" ? new Date().toISOString() : null,
    });
    if (eErr) throw eErr;

    if (analysis) {
      const analysisId = crypto.randomUUID();
      const { error: aErr } = await supabase.from("emergency_analyses").upsert({
        id: analysisId,
        emergency_id: input.id,
        emergency_type: analysis.emergencyType,
        severity: analysis.severity,
        confidence: analysis.confidence,
        risk_score: analysis.riskScore,
        recommended_action: analysis.recommendedAction,
        response_priority: analysis.responsePriority,
        warning: analysis.warning ?? null,
      });
      if (aErr) throw aErr;

      await supabase.from("first_aid_steps").delete().eq("analysis_id", analysisId);
      if (analysis.firstAidSteps.length) {
        const { error: sErr } = await supabase
          .from("first_aid_steps")
          .insert(
            analysis.firstAidSteps.map((s) => ({
              analysis_id: analysisId,
              step_number: s.id,
              title: s.title,
              description: s.description,
            })),
          );
        if (sErr) throw sErr;
      }

      await supabase.from("first_aid_dos_donts").delete().eq("analysis_id", analysisId);
      const dd = [
        ...analysis.dos.map((t) => ({ analysis_id: analysisId, kind: "do", text: t })),
        ...analysis.donts.map((t) => ({ analysis_id: analysisId, kind: "dont", text: t })),
      ];
      if (dd.length) {
        const { error: ddErr } = await supabase.from("first_aid_dos_donts").insert(dd);
        if (ddErr) throw ddErr;
      }
    }
  },

  async resolveEmergency(id: string): Promise<void> {
    const { error } = await supabase
      .from("emergencies")
      .update({ status: "resolved", resolved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  async removeEmergency(id: string): Promise<void> {
    const { error } = await supabase.from("emergencies").delete().eq("id", id);
    if (error) throw error;
  },

  async listFacilities(): Promise<Facility[]> {
    const { data, error } = await supabase
      .from("facilities")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as any[]).map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      lat: Number(r.lat),
      lng: Number(r.lng),
      address: r.address,
      phone: r.phone,
      open24h: r.open_24h,
      rating: r.rating != null ? Number(r.rating) : undefined,
    }));
  },
};
