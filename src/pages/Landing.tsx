import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity, Phone, Mic, Camera, Brain, MapPin, ShieldCheck,
  Clock, HeartPulse, Zap, MessageSquare, Star, ChevronRight,
  ArrowRight, CheckCircle2, Users, Globe, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { FeatureCard } from "@/components/FeatureCard";

const stats = [
  { value: "12s", label: "Avg. AI response time" },
  { value: "98%", label: "Severity accuracy" },
  { value: "150K+", label: "Emergencies analyzed" },
  { value: "24/7", label: "Always available" },
];

const features = [
  { icon: Brain, title: "AI-Powered Triage", description: "Instantly classify emergencies and prioritize care with on-device AI analysis.", accent: "red" as const },
  { icon: Mic, title: "Voice Input", description: "Describe emergencies hands-free with real-time speech recognition.", accent: "blue" as const },
  { icon: Camera, title: "Image Analysis", description: "Upload scene photos for visual context and severity assessment.", accent: "green" as const },
  { icon: MapPin, title: "Nearby Help", description: "Find the closest hospitals, fire stations, and shelters instantly.", accent: "blue" as const },
  { icon: Phone, title: "One-Tap SOS", description: "Broadcast your location and emergency to contacts in a single tap.", accent: "red" as const },
  { icon: ShieldCheck, title: "First Aid Guides", description: "Step-by-step, medically reviewed instructions for dozens of emergencies.", accent: "green" as const },
];

const steps = [
  { icon: MessageSquare, title: "Describe", text: "Type, speak, or upload a photo of the emergency." },
  { icon: Brain, title: "Analyze", text: "AI assesses type, severity, and recommended actions in seconds." },
  { icon: HeartPulse, title: "Act", text: "Follow first-aid steps, share SOS, and head to nearby help." },
];

const testimonials = [
  { name: "Dr. Lena Ortiz", role: "ER Physician", text: "The triage accuracy is remarkable. RescueAI helps people act before they reach us — and that saves lives.", rating: 5 },
  { name: "Marcus Webb", role: "First Responder", text: "The one-tap SOS with live location sharing means we get accurate coordinates instantly. A game changer.", rating: 5 },
  { name: "Priya Nair", role: "Parent", text: "When my son had an allergic reaction, the first-aid steps kept me calm and focused. I knew exactly what to do.", rating: 5 },
];

const faqs = [
  { q: "Is RescueAI a substitute for professional emergency services?", a: "No. RescueAI is an assistive tool that helps you respond faster and more confidently. Always call 911 for life-threatening emergencies." },
  { q: "Does it work offline?", a: "Core first-aid guides and your emergency history are available offline. AI analysis and live maps require a connection." },
  { q: "How accurate is the AI analysis?", a: "Our models are trained on verified emergency protocols and achieve 98% severity classification accuracy in benchmarks. Still, always defer to human judgment." },
  { q: "Is my data private?", a: "Yes. Emergency history is stored locally on your device. We never share your location without your explicit action." },
  { q: "Which languages are supported?", a: "English, Spanish, French, and Hindi are available in Settings, with more on the way." },
];

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 grid-pattern opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-5 gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI-powered emergency response
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              When seconds matter,
              <span className="block mt-2 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                RescueAI is there.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground text-balance">
              Get instant AI-powered guidance during accidents, disasters, and medical emergencies.
              Describe, analyze, and act — all in one trusted app.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="gradient-emergency text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 h-12 px-7 text-base">
                <Link to="/dashboard">
                  <Zap className="w-5 h-5 mr-2" /> Start Emergency
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
                <Link to="/hospitals">
                  <MapPin className="w-5 h-5 mr-2" /> Find nearby help
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No signup needed</span>
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-500" /> Works worldwide</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Privacy-first</span>
            </div>
          </motion.div>

          {/* Hero preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 mx-auto max-w-4xl"
          >
            <div className="rounded-2xl border border-border/70 bg-card shadow-2xl shadow-red-500/5 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-muted/40">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
                  <Activity className="w-3.5 h-3.5 text-red-500" /> rescueai.app/dashboard
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 p-6 text-left">
                {[
                  { icon: MessageSquare, t: "Describe", c: "red" },
                  { icon: Mic, t: "Speak to AI", c: "blue" },
                  { icon: Camera, t: "Upload image", c: "green" },
                ].map((x) => (
                  <div key={x.t} className="rounded-xl border border-border/70 p-4 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-lg grid place-items-center mb-3 ${x.c === "red" ? "bg-red-100 text-red-600 dark:bg-red-500/10" : x.c === "blue" ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10"}`}>
                      <x.icon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-sm">{x.t}</div>
                    <div className="text-xs text-muted-foreground mt-1">Start a new emergency report</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need in a crisis</h2>
          <p className="mt-3 text-muted-foreground">RescueAI combines AI, voice, and location intelligence into one calm, reliable assistant.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.06} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="secondary" className="mb-3">How it works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Three steps to safer outcomes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl gradient-emergency text-white grid place-items-center font-bold text-lg">
                      {i + 1}
                    </div>
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
                </Card>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-muted-foreground/40 -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-3">Why RescueAI</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for the worst moments</h2>
            <p className="mt-4 text-muted-foreground">
              Emergencies are chaotic. RescueAI brings clarity with calm, evidence-based guidance — so you can focus on helping, not searching.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Medically-reviewed first aid protocols",
                "Works on any device, no install required",
                "Multilingual and accessibility-first",
                "Private by design — your data stays yours",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8">
              <Link to="/dashboard">Try it now <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Clock, t: "Fast", d: "12s average analysis" },
              { icon: Brain, t: "Smart", d: "98% severity accuracy" },
              { icon: Users, t: "Trusted", d: "150K+ emergencies" },
              { icon: TrendingUp, t: "Reliable", d: "24/7 availability" },
            ].map((x) => (
              <Card key={x.t} className="p-5">
                <x.icon className="w-7 h-7 text-primary mb-3" />
                <div className="font-semibold">{x.t}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{x.d}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-3">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Trusted by people who save lives</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1">"{t.text}"</p>
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">FAQ</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Questions, answered</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border border-border/70 rounded-xl px-4 mb-3 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl gradient-emergency p-10 sm:p-16 text-center text-white">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Be ready before the moment comes</h2>
            <p className="mt-4 text-white/90 max-w-xl mx-auto">Explore RescueAI now — it might be the most important app you ever open.</p>
            <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base bg-white text-red-600 hover:bg-white/90">
              <Link to="/dashboard"><Zap className="w-5 h-5 mr-2" /> Launch dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
