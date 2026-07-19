import { api } from "./api";
import type { AIAnalysis, EmergencyInput, Facility } from "@/types";

/**
 * Placeholder AI services. These return simulated results so the UI is fully
 * demoable without a live backend. Swap the internals for real `api.post`
 * calls when the FastAPI backend is connected.
 */

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function buildAnalysis(text: string): AIAnalysis {
  const t = text.toLowerCase();
  let emergencyType: AIAnalysis["emergencyType"] = "other";
  let severity: AIAnalysis["severity"] = "moderate";
  let riskScore = 50;
  let recommendedAction = "Keep the person calm and monitor vitals.";
  let responsePriority: AIAnalysis["responsePriority"] = "standard";

  if (/chest|heart|cardiac|collapse|unconscious/.test(t)) {
    emergencyType = "cardiac";
    severity = "critical";
    riskScore = 92;
    recommendedAction = "Call 911 immediately. Begin CPR if trained.";
    responsePriority = "immediate";
  } else if (/breath|choke|asthma|wheeze/.test(t)) {
    emergencyType = "respiratory";
    severity = "high";
    riskScore = 78;
    recommendedAction = "Help them sit upright. Use inhaler if available.";
    responsePriority = "urgent";
  } else if (/stroke|face|arm|speech/.test(t)) {
    emergencyType = "stroke";
    severity = "critical";
    riskScore = 88;
    recommendedAction = "Note the time of symptom onset. Call 911 now.";
    responsePriority = "immediate";
  } else if (/burn|fire|scald/.test(t)) {
    emergencyType = "burn";
    severity = "high";
    riskScore = 70;
    recommendedAction = "Cool the burn with running water for 20 minutes.";
    responsePriority = "urgent";
  } else if (/bleed|blood|cut|laceration/.test(t)) {
    emergencyType = "bleeding";
    severity = "high";
    riskScore = 74;
    recommendedAction = "Apply firm direct pressure with a clean cloth.";
    responsePriority = "urgent";
  } else if (/fracture|broken|bone|sprain/.test(t)) {
    emergencyType = "fracture";
    severity = "moderate";
    riskScore = 55;
    recommendedAction = "Immobilize the area. Do not move the limb.";
    responsePriority = "standard";
  } else if (/allerg|sting|bee|peanut/.test(t)) {
    emergencyType = "allergic";
    severity = "high";
    riskScore = 72;
    recommendedAction = "Administer EpiPen if available. Call 911.";
    responsePriority = "urgent";
  } else if (/poison|swallow|toxic|chemical/.test(t)) {
    emergencyType = "poisoning";
    severity = "high";
    riskScore = 80;
    recommendedAction = "Call Poison Control: 1-800-222-1222.";
    responsePriority = "urgent";
  } else if (/fall|accident|injur|trauma/.test(t)) {
    emergencyType = "trauma";
    severity = "high";
    riskScore = 68;
    recommendedAction = "Stabilize head and neck. Call 911.";
    responsePriority = "urgent";
  }

  return {
    emergencyType,
    severity,
    confidence: 70 + Math.floor(Math.random() * 25),
    riskScore,
    recommendedAction,
    responsePriority,
    firstAidSteps: firstAidFor(emergencyType),
    dos: dosFor(emergencyType),
    donts: dontsFor(emergencyType),
    warning:
      severity === "critical"
        ? "Life-threatening condition. Act immediately."
        : undefined,
  };
}

function firstAidFor(type: AIAnalysis["emergencyType"]) {
  const steps: Record<string, { title: string; description: string }[]> = {
    cardiac: [
      { title: "Call 911", description: "Tell them it's a suspected heart attack." },
      { title: "Keep them calm", description: "Have them sit down and rest quietly." },
      { title: "Aspirin", description: "Chew 325mg aspirin if not allergic." },
      { title: "Begin CPR", description: "If unresponsive and no pulse, start chest compressions." },
    ],
    respiratory: [
      { title: "Sit upright", description: "Help them into a comfortable sitting position." },
      { title: "Loosen clothing", description: "Remove tight items around the neck and chest." },
      { title: "Use inhaler", description: "Assist with their prescribed rescue inhaler." },
      { title: "Call 911", description: "If no improvement within 5 minutes." },
    ],
    bleeding: [
      { title: "Apply pressure", description: "Use a clean cloth and press firmly on the wound." },
      { title: "Elevate", description: "Raise the injured area above heart level if possible." },
      { title: "Add cloth", description: "Don't remove original cloth; add more on top." },
      { title: "Call 911", description: "If bleeding is severe or doesn't stop." },
    ],
    burn: [
      { title: "Cool it", description: "Run cool (not cold) water over the burn for 20 minutes." },
      { title: "Remove items", description: "Take off jewelry near the burn before swelling." },
      { title: "Cover loosely", description: "Use a clean non-stick dressing." },
      { title: "Don't burst", description: "Never pop blisters that form." },
    ],
    stroke: [
      { title: "Call 911", description: "Note the exact time symptoms began." },
      { title: "FAST check", description: "Face droop, Arm weakness, Speech, Time." },
      { title: "Keep them safe", description: "Lay them on their side if vomiting." },
      { title: "Don't drive", description: "Wait for emergency services." },
    ],
    fracture: [
      { title: "Don't move", description: "Keep the injured limb still and supported." },
      { title: "Immobilize", description: "Use a splint or padding to prevent movement." },
      { title: "Apply cold", description: "Ice pack wrapped in cloth for 20 minutes." },
      { title: "Seek care", description: "Transport to urgent care or call 911." },
    ],
    allergic: [
      { title: "EpiPen", description: "Inject into outer thigh if available." },
      { title: "Call 911", description: "Anaphylaxis can worsen rapidly." },
      { title: "Position", description: "Lay them flat, elevate legs if no breathing issues." },
      { title: "Second dose", description: "If no improvement in 5-15 minutes." },
    ],
    poisoning: [
      { title: "Call Poison Control", description: "1-800-222-1222 immediately." },
      { title: "Don't induce vomiting", description: "Unless told to by a professional." },
      { title: "Save container", description: "Keep the product for identification." },
      { title: "Wipe mouth", description: "Remove any remaining substance." },
    ],
    trauma: [
      { title: "Check responsiveness", description: "Tap and shout. Look for breathing." },
      { title: "Stabilize neck", description: "Do not move the head if spinal injury suspected." },
      { title: "Control bleeding", description: "Apply direct pressure to wounds." },
      { title: "Call 911", description: "Trauma needs professional evaluation." },
    ],
    other: [
      { title: "Stay calm", description: "Reassure the person and keep them still." },
      { title: "Assess", description: "Check breathing, bleeding, and responsiveness." },
      { title: "Call for help", description: "Contact emergency services if unsure." },
      { title: "Monitor", description: "Watch for changes until help arrives." },
    ],
  };
  const list = steps[type] ?? steps.other;
  return list.map((s, i) => ({ id: i + 1, ...s }));
}

function dosFor(type: AIAnalysis["emergencyType"]) {
  return [
    "Stay calm and reassure the person",
    "Keep the area safe from further harm",
    "Monitor breathing and responsiveness",
    "Call emergency services when in doubt",
  ];
}
function dontsFor(_type: AIAnalysis["emergencyType"]) {
  return [
    "Don't give food or water",
    "Don't move someone with a suspected spinal injury",
    "Don't remove an embedded object",
    "Don't apply ointments to severe burns",
  ];
}

export const aiService = {
  async analyzeText(description: string): Promise<AIAnalysis> {
    await wait(1400);
    return buildAnalysis(description);
  },

  async analyzeVoice(transcript: string): Promise<AIAnalysis> {
    await wait(1600);
    return buildAnalysis(transcript);
  },

  async analyzeImage(_imageUri: string): Promise<AIAnalysis> {
    await wait(1800);
    return buildAnalysis("injury accident trauma");
  },

  async recommendFacilities(lat: number, lng: number): Promise<Facility[]> {
    await wait(800);
    const offsets = [
      { dlat: 0.008, dlng: 0.004, name: "Mercy General Hospital", type: "hospital" },
      { dlat: -0.006, dlng: 0.011, name: "City Medical Center", type: "hospital" },
      { dlat: 0.012, dlng: -0.009, name: "Precinct 12 Police Station", type: "police" },
      { dlat: -0.01, dlng: -0.005, name: "Central Fire Station", type: "fire" },
      { dlat: 0.005, dlng: 0.015, name: "Riverside Emergency Shelter", type: "shelter" },
      { dlat: -0.014, dlng: 0.008, name: "St. Mary's Hospital", type: "hospital" },
      { dlat: 0.016, dlng: 0.002, name: "Northside Fire Rescue", type: "fire" },
    ] as const;
    return offsets.map((o, i) => ({
      id: `f-${i}`,
      name: o.name,
      type: o.type,
      lat: lat + o.dlat,
      lng: lng + o.dlng,
      address: `${100 + i} Emergency Ave`,
      phone: `+1 (555) 100-20${i}`,
      distanceKm: +(Math.hypot(o.dlat, o.dlng) * 111).toFixed(1),
      open24h: o.type !== "shelter",
      rating: 4 + Math.random(),
    }));
  },

  async generateSOS(input: EmergencyInput): Promise<string> {
    await wait(500);
    const loc = input.location?.label ?? "my current location";
    return `EMERGENCY: ${input.description || "Medical emergency"} - I need help at ${loc}. This is an automated SOS from RescueAI.`;
  },

  // Real backend wiring (commented for future use):
  // async analyzeText(description: string) {
  //   const { data } = await api.post("/analyze/text", { description });
  //   return data as AIAnalysis;
  // },
};
