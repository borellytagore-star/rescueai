import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Phone, MapPin, BookOpen, CheckCircle2 } from "lucide-react";
import { useEmergencies } from "@/context/EmergencyContext";
import { AIResponseCard, FirstAidList } from "@/components/AIResponseCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Analysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { emergencies, analyses, resolveEmergency, loadAnalysis } = useEmergencies();
  const emergency = emergencies.find((e) => e.id === id);
  const analysis = id ? analyses[id] : undefined;
  const [loadingAnalysis, setLoadingAnalysis] = useState(!analysis);

  useEffect(() => {
    if (!id || analysis) return;
    let cancelled = false;
    setLoadingAnalysis(true);
    loadAnalysis(id).finally(() => {
      if (!cancelled) setLoadingAnalysis(false);
    });
    return () => { cancelled = true; };
  }, [id, analysis, loadAnalysis]);

  if (!emergency) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Emergency not found</h1>
        <Button asChild><Link to="/dashboard">Back to dashboard</Link></Button>
      </div>
    );
  }

  if (!analysis) {
    return loadingAnalysis ? <LoadingScreen label="Loading analysis..." /> : (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Analysis unavailable</h1>
        <p className="text-muted-foreground">This report's AI analysis could not be loaded.</p>
        <Button asChild><Link to="/dashboard">Back to dashboard</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/sos"><Phone className="w-4 h-4 mr-1" /> SOS</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/hospitals"><MapPin className="w-4 h-4 mr-1" /> Nearby help</Link>
          </Button>
          {emergency.status === "active" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                resolveEmergency(emergency.id);
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" /> Mark resolved
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4 bg-muted/40">
        <p className="text-sm text-muted-foreground">Reported: {new Date(emergency.createdAt).toLocaleString()}</p>
        <p className="font-medium mt-1">{emergency.description}</p>
      </Card>

      <Tabs defaultValue="analysis">
        <TabsList>
          <TabsTrigger value="analysis"><BookOpen className="w-4 h-4 mr-1.5" /> AI Analysis</TabsTrigger>
          <TabsTrigger value="firstaid">First Aid Guide</TabsTrigger>
        </TabsList>
        <TabsContent value="analysis" className="mt-4">
          <AIResponseCard analysis={analysis} />
        </TabsContent>
        <TabsContent value="firstaid" className="mt-4">
          <FirstAidList analysis={analysis} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
